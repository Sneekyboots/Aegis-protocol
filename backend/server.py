"""
AEGIS Backend — Real data from Sui testnet + CoinGecko.
Reads: Sui GraphQL RPC (https://graphql.testnet.sui.io/graphql)
PTBs:  sui client call (subprocess — agent wallet already configured)
"""

from fastapi import FastAPI, APIRouter, HTTPException
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import httpx
import subprocess
import json
import time
import logging

load_dotenv(Path(__file__).parent / ".env")

PACKAGE_ID    = os.environ.get("AEGIS_PACKAGE_ID",    "0x57cc884ee0b0b192bb5e11e1072361b660ab69ce4cd8564271258c64b4b00309")
# Events are always indexed with the ORIGINAL (v1) package ID even after upgrade
ORIGINAL_PKG  = os.environ.get("AEGIS_ORIGINAL_PACKAGE_ID", "0xd8e4db745b986cca6ce1987b32010d9f3f249f04e3c85abbe4935ef49554246a")
REGISTRY_ID   = os.environ.get("AEGIS_REGISTRY_ID",   "0x26e92b12ce21c2541192f360c8a47ca7e396a93af3470390be1c4cd1c4ca4e6f")
SUI_RPC       = os.environ.get("SUI_RPC_URL",          "https://fullnode.testnet.sui.io:443")
SUI_GRAPHQL   = os.environ.get("SUI_GRAPHQL_URL",      "https://graphql.testnet.sui.io/graphql")
CORS_ORIGINS  = os.environ.get("CORS_ORIGINS",         "http://localhost:3000").split(",")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("aegis")

app = FastAPI(title="AEGIS API", description="Real-time Sui testnet data")
api_router = APIRouter(prefix="/api")


# ─────────────────────────────────────────────
# Sui JSON-RPC helpers (valid until July 2026)
# ─────────────────────────────────────────────

async def sui_rpc(method: str, params: list) -> dict:
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(SUI_RPC, json={
            "jsonrpc": "2.0", "id": 1, "method": method, "params": params,
        })
        r.raise_for_status()
        body = r.json()
        if "error" in body:
            raise RuntimeError(f"Sui RPC error: {body['error']}")
        return body.get("result", {})


async def query_events(event_type: str, limit: int = 50) -> list:
    # Events use the ORIGINAL package ID even when emitted by upgraded package versions
    result = await sui_rpc("suix_queryEvents", [
        {"MoveEventType": f"{ORIGINAL_PKG}::intent::{event_type}"},
        None, limit, True,
    ])
    return result.get("data", [])


async def get_object(object_id: str) -> dict:
    return await sui_rpc("sui_getObject", [
        object_id, {"showContent": True, "showOwner": True},
    ])


async def get_dynamic_fields(parent_id: str) -> list:
    result = await sui_rpc("suix_getDynamicFields", [parent_id, None, 20])
    return result.get("data", [])


async def get_dynamic_field_object(parent_id: str, field_name: dict) -> dict:
    return await sui_rpc("suix_getDynamicFieldObject", [parent_id, field_name])


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def decode_bytes(value) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        try:
            return bytes(value).decode("utf-8").rstrip("\x00")
        except Exception:
            return ""
    return str(value or "")


def status_label(code: int) -> str:
    return {0: "PENDING", 1: "APPROVED", 2: "EXECUTED", 3: "BLOCKED", 4: "REVOKED"}.get(code, "UNKNOWN")


def quantum_label(code: int) -> str:
    return {0: "classical", 1: "hybrid", 2: "pqc-ready"}.get(code, "classical")


def expires_in_str(expires_at_ms: int) -> str:
    remaining = (expires_at_ms - int(time.time() * 1000)) // 1000
    if remaining <= 0:
        return "expired"
    if remaining < 3600:
        return f"{remaining // 60}m"
    return f"{remaining // 3600}h {(remaining % 3600) // 60}m"


async def build_intent_from_object(object_id: str, created_event=None) -> dict | None:
    """Fetch intent object + Dynamic Fields and return structured dict."""
    try:
        obj_result = await get_object(object_id)
    except Exception as e:
        log.warning(f"get_object {object_id[:10]}… failed: {e}")
        return None

    content = (obj_result.get("data") or {}).get("content") or {}
    if not content or content.get("dataType") != "moveObject":
        return None

    fields = content.get("fields", {})
    now = int(time.time() * 1000)
    status_code = int(fields.get("status", 0))
    expires_at  = int(fields.get("expires_at", now + 3600000))

    intent: dict = {
        "id": decode_bytes(fields.get("intent_id")) or f"INTENT-{object_id[2:8].upper()}",
        "object_id": object_id,
        "action": decode_bytes(fields.get("action")),
        "token_in": decode_bytes(fields.get("token_in")),
        "token_out": decode_bytes(fields.get("token_out")),
        "amount": int(fields.get("amount", 0)),
        "status": status_label(status_code),
        "quantum": "hybrid",
        "expires_in": expires_in_str(expires_at),
        "evaluated_at": now,
        "risk_score": 0,
        "risk_breakdown": {"volatility": 0, "liquidity": 0, "concentration": 0, "quantum": 0},
        "market_snapshot": {"price": 0, "change_24h": 0, "volume_24h": "$0", "liquidity_depth": "$0"},
        "policy": {"max_risk": 70, "auto_execute": False, "min_liquidity": 500000},
        "risk_history": [],
        "logs": [{"action": "created", "timestamp": int(fields.get("created_at", now)), "result": "IntentCreated on-chain"}],
        "note": "Live from Sui testnet",
    }

    # ── Fetch Dynamic Fields (brain) ──────────────────────────────
    try:
        df_list = await get_dynamic_fields(object_id)
    except Exception:
        df_list = []

    for df in df_list:
        name = df.get("name", {})
        name_value = name.get("value")

        try:
            df_obj = await get_dynamic_field_object(object_id, name)
        except Exception:
            continue

        df_content = (
            (df_obj.get("data") or {})
            .get("content") or {}
        ).get("fields") or {}

        # Decode the field key
        if isinstance(name_value, list):
            try:
                key = bytes(name_value).decode("utf-8").rstrip("\x00")
            except Exception:
                continue
        else:
            key = str(name_value or "")

        if key == "risk":
            total = int(df_content.get("total_score", 0))
            intent["risk_score"] = total
            intent["risk_breakdown"] = {
                "volatility":    int(df_content.get("volatility", 0)),
                "liquidity":     int(df_content.get("liquidity", 0)),
                "concentration": int(df_content.get("concentration", 0)),
                "quantum":       int(df_content.get("quantum", 0)),
            }
            evaluated_at = int(df_content.get("evaluated_at", now))
            intent["evaluated_at"] = evaluated_at
            intent["risk_history"].append({"timestamp": evaluated_at, "score": total})

        elif key == "market":
            price_raw = int(df_content.get("base_price", 0))
            intent["market_snapshot"] = {
                "price":           price_raw / 1e9 if price_raw > 0 else 0,
                "change_24h":      int(df_content.get("change_24h", 0)) / 100,
                "volume_24h":      f"${int(df_content.get('volume_24h', 0)) / 1e9:.2f}B",
                "liquidity_depth": f"${int(df_content.get('liquidity_depth', 0)) / 1e6:.1f}M",
            }

        elif key == "policy":
            intent["policy"] = {
                "max_risk":      int(df_content.get("max_risk_score", 70)),
                "auto_execute":  bool(df_content.get("auto_execute", False)),
                "min_liquidity": int(df_content.get("min_liquidity_required", 500000)),
            }

        elif key == "quantum":
            qstatus = int(df_content.get("status", 0))
            intent["quantum"] = quantum_label(qstatus)

        elif key == "log":
            entries = df_content if isinstance(df_content, list) else []
            for entry in entries:
                intent["logs"].append({
                    "action":    decode_bytes(entry.get("action", b"action")),
                    "timestamp": int(entry.get("timestamp", now)),
                    "result":    decode_bytes(entry.get("details", b"")),
                })

    return intent


# ─────────────────────────────────────────────
# CoinGecko market data
# ─────────────────────────────────────────────

_market_cache: dict = {}
_market_cache_ts: float = 0

async def fetch_market_data() -> dict:
    global _market_cache, _market_cache_ts
    if time.time() - _market_cache_ts < 55:
        return _market_cache
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "sui", "vs_currencies": "usd",
                        "include_24hr_change": "true", "include_24hr_vol": "true"},
            )
            r.raise_for_status()
            data = r.json()["sui"]
            _market_cache = {
                "pair":            "SUI/USDC",
                "price":           round(float(data["usd"]), 4),
                "change_24h":      round(float(data.get("usd_24h_change", 0)), 2),
                "volume_24h":      f"${float(data.get('usd_24h_vol', 0)) / 1e9:.2f}B",
                "liquidity_depth": "$5.0M",
            }
            _market_cache_ts = time.time()
            return _market_cache
    except Exception as exc:
        log.warning(f"CoinGecko failed: {exc}")
        if _market_cache:
            return _market_cache
        return {"pair": "SUI/USDC", "price": 3.85, "change_24h": 2.1,
                "volume_24h": "$1.25B", "liquidity_depth": "$5.0M"}


# ─────────────────────────────────────────────
# PTB helpers via sui CLI
# ─────────────────────────────────────────────

def sui_call(module: str, function: str, args: list[str], gas_budget: int = 100_000_000) -> dict:
    """Fire a Move call via the configured sui CLI (uses active wallet)."""
    cmd = [
        "sui", "client", "call",
        "--package",  PACKAGE_ID,
        "--module",   module,
        "--function", function,
        "--args",     *args,
        "--gas-budget", str(gas_budget),
        "--json",
    ]
    log.info(f"sui CLI: {module}::{function}({', '.join(args[:2])}…)")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "sui client call failed")
    try:
        out = json.loads(result.stdout)
    except json.JSONDecodeError:
        # CLI sometimes prints logs before JSON; extract last valid JSON object
        for line in reversed(result.stdout.splitlines()):
            try:
                out = json.loads(line)
                break
            except Exception:
                continue
        else:
            raise RuntimeError(f"Could not parse sui CLI output: {result.stdout[:200]}")
    return out


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"status": "ok", "message": "AEGIS API — Execution Firewall for Agentic Web3"}


@api_router.get("/intents")
async def get_intents():
    """Return all intents discovered via on-chain IntentCreated events."""
    try:
        events = await query_events("IntentCreated", limit=50)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Sui RPC error: {exc}")

    intents = []
    seen: set[str] = set()
    for event in events:
        parsed = event.get("parsedJson", {}) or {}
        intent_id_raw = parsed.get("intent_id")
        # intent_id is the object UID inner ID = plain hex object ID string
        # e.g. "0xd566bf0c49b7e0760ffe7adfa5acb2aeeced43609b..."
        if isinstance(intent_id_raw, dict):
            object_id = intent_id_raw.get("id") or ""
        elif isinstance(intent_id_raw, str) and intent_id_raw.startswith("0x"):
            object_id = intent_id_raw
        else:
            object_id = str(intent_id_raw or "")

        if not object_id or object_id in seen:
            continue
        seen.add(object_id)

        intent = await build_intent_from_object(object_id, event)
        if intent:
            intents.append(intent)

    return intents


@api_router.get("/intents/{object_id}")
async def get_intent_detail(object_id: str):
    """Return a single intent with all Dynamic Fields."""
    intent = await build_intent_from_object(object_id)
    if not intent:
        raise HTTPException(status_code=404, detail="Intent not found on chain")
    return intent


@api_router.get("/market/live")
async def get_live_market():
    """Real-time SUI/USDC market data from CoinGecko."""
    return await fetch_market_data()


@api_router.post("/kill-switch/{object_id}")
async def kill_switch(object_id: str):
    """
    Revoke intent on-chain via the agent wallet.
    Calls intent::revoke_intent(intent, timestamp).
    Requires the connected sui CLI wallet to be intent.agent_address.
    """
    ts = str(int(time.time() * 1000))
    try:
        result = sui_call("intent", "revoke_intent", [object_id, ts])
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    status = (result.get("effects") or {}).get("status") or {}
    if status.get("status") != "success":
        raise HTTPException(status_code=400, detail=f"PTB failed: {status.get('error')}")

    return {
        "success": True,
        "tx_digest": result.get("digest"),
        "message": f"Intent {object_id[:10]}… revoked on-chain",
    }


@api_router.post("/simulate-rogue")
async def simulate_rogue():
    """
    Seed a new rogue intent on-chain with a 50,000 SUI swap and 10-minute expiry.
    The agent will pick it up, score it ~97/100, and call block_intent automatically.
    """
    ts        = int(time.time() * 1000)
    expiry    = str(ts + 600_000)           # 10 minutes
    intent_id = f"ROGUE-{str(ts)[-6:]}"
    amount    = "50000000000000"            # 50,000 SUI in MIST

    try:
        result = sui_call("intent", "create_and_transfer_intent", [
            intent_id, "swap", amount, "USDC", "SUI", expiry, "0x6",
        ])
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    status = (result.get("effects") or {}).get("status") or {}
    if status.get("status") != "success":
        raise HTTPException(status_code=400, detail=f"PTB failed: {status.get('error')}")

    # Extract created object ID from effects
    created = ((result.get("effects") or {}).get("created") or [])
    new_object_id = (created[0].get("reference") or {}).get("objectId") if created else None

    return {
        "success":   True,
        "tx_digest": result.get("digest"),
        "object_id": new_object_id,
        "message":   f"Rogue intent '{intent_id}' created. Agent will evaluate and block in ~10s.",
    }


@api_router.post("/seed-demo")
async def seed_demo():
    """
    Seed three demo intents on-chain (safe, medium, rogue).
    Safe to call multiple times — creates new objects each time.
    """
    ts = int(time.time() * 1000)
    intents_to_create = [
        ("INTENT-SAFE",   "swap",  "1000000000",   "USDC", "SUI",  str(ts + 3_600_000)),
        ("INTENT-MEDIUM", "lend",  "8500000000",   "USDC", "pool", str(ts + 7_200_000)),
        ("INTENT-ROGUE",  "swap",  "50000000000000","USDC", "SUI",  str(ts + 600_000)),
    ]

    results = []
    for (intent_id, action, amount, token_in, token_out, expiry) in intents_to_create:
        label = f"{intent_id}-{str(ts)[-4:]}"
        try:
            r = sui_call("intent", "create_and_transfer_intent", [
                label, action, amount, token_in, token_out, expiry, "0x6",
            ])
            created = ((r.get("effects") or {}).get("created") or [])
            oid = (created[0].get("reference") or {}).get("objectId") if created else None
            results.append({"id": label, "object_id": oid, "status": "created",
                            "tx": r.get("digest")})
        except RuntimeError as exc:
            results.append({"id": label, "status": "failed", "error": str(exc)})

    return {"seeded": results}


# ─────────────────────────────────────────────
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

