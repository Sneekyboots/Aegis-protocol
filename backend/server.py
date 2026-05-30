from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import random


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class RiskBreakdown(BaseModel):
    volatility: int
    liquidity: int
    concentration: int
    quantum: int

class MarketSnapshot(BaseModel):
    price: float
    change_24h: float
    volume_24h: int
    liquidity_depth: int
    spread: int

class Policy(BaseModel):
    max_risk: int
    auto_execute: bool
    min_liquidity: int

class RiskHistoryPoint(BaseModel):
    timestamp: str
    score: int

class ExecutionLog(BaseModel):
    timestamp: str
    action: str
    result: str

class Intent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    object_id: str
    action: str
    risk_score: int
    status: str  # APPROVED, EXECUTED, BLOCKED, REVOKED
    quantum: str  # Classical, Hybrid
    expires_in: str
    risk_breakdown: RiskBreakdown
    market_snapshot: MarketSnapshot
    policy: Policy
    risk_history: List[RiskHistoryPoint]
    logs: List[ExecutionLog]
    evaluated_at: str
    note: str

class LiveMarket(BaseModel):
    pair: str
    price: float
    change_24h: float
    volume_24h: str
    liquidity_depth: str

class SimulateRogueRequest(BaseModel):
    intent_id: str


# Generate realistic mock data
def generate_intent_data():
    now = datetime.now(timezone.utc)
    
    intents = [
        Intent(
            id="INTENT-001",
            object_id="0xabc123def456789012345678901234567890abcd",
            action="Swap 5,000 USDC → SUI",
            risk_score=28,
            status="APPROVED",
            quantum="Classical",
            expires_in="47m",
            risk_breakdown=RiskBreakdown(
                volatility=12,
                liquidity=4,
                concentration=3,
                quantum=2
            ),
            market_snapshot=MarketSnapshot(
                price=0.90,
                change_24h=-2.6,
                volume_24h=12500,
                liquidity_depth=241000,
                spread=8
            ),
            policy=Policy(
                max_risk=70,
                auto_execute=True,
                min_liquidity=100000
            ),
            risk_history=[
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=60)).isoformat(), score=65),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=45)).isoformat(), score=52),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=30)).isoformat(), score=38),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=15)).isoformat(), score=28),
            ],
            logs=[
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=5)).isoformat(),
                    action="Risk Evaluation",
                    result="Score updated: 28/100"
                ),
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=10)).isoformat(),
                    action="Intent Created",
                    result="Awaiting execution"
                )
            ],
            evaluated_at=(now - timedelta(seconds=12)).isoformat(),
            note="Healthy liquidity depth, safe execution approved"
        ),
        Intent(
            id="INTENT-002",
            object_id="0xdef789abc123456789012345678901234567890e",
            action="Lend 2,000 USDC",
            risk_score=19,
            status="EXECUTED",
            quantum="Hybrid",
            expires_in="2h",
            risk_breakdown=RiskBreakdown(
                volatility=8,
                liquidity=3,
                concentration=2,
                quantum=6
            ),
            market_snapshot=MarketSnapshot(
                price=0.90,
                change_24h=-2.6,
                volume_24h=12500,
                liquidity_depth=241000,
                spread=6
            ),
            policy=Policy(
                max_risk=70,
                auto_execute=True,
                min_liquidity=100000
            ),
            risk_history=[
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=60)).isoformat(), score=35),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=45)).isoformat(), score=28),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=30)).isoformat(), score=22),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=15)).isoformat(), score=19),
            ],
            logs=[
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=2)).isoformat(),
                    action="Intent Executed",
                    result="Successfully executed on DeepBook"
                ),
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=8)).isoformat(),
                    action="Risk Evaluation",
                    result="Score: 19/100 - Auto-execute approved"
                ),
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=15)).isoformat(),
                    action="Intent Created",
                    result="Created by Agent-Alpha"
                )
            ],
            evaluated_at=(now - timedelta(seconds=8)).isoformat(),
            note="Low risk lending operation completed successfully"
        ),
        Intent(
            id="INTENT-003",
            object_id="0x789abc123def456789012345678901234567890f",
            action="Swap 50,000 USDC → SUI",
            risk_score=97,
            status="BLOCKED",
            quantum="Classical",
            expires_in="11m",
            risk_breakdown=RiskBreakdown(
                volatility=36,
                liquidity=28,
                concentration=13,
                quantum=2
            ),
            market_snapshot=MarketSnapshot(
                price=0.90,
                change_24h=-18.0,
                volume_24h=8500,
                liquidity_depth=45000,
                spread=65
            ),
            policy=Policy(
                max_risk=70,
                auto_execute=False,
                min_liquidity=100000
            ),
            risk_history=[
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=60)).isoformat(), score=75),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=45)).isoformat(), score=82),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=30)).isoformat(), score=89),
                RiskHistoryPoint(timestamp=(now - timedelta(minutes=15)).isoformat(), score=97),
            ],
            logs=[
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=1)).isoformat(),
                    action="Execution Blocked",
                    result="Risk too high: 97/100 exceeds threshold"
                ),
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=3)).isoformat(),
                    action="Risk Alert",
                    result="High volatility detected + thin liquidity"
                ),
                ExecutionLog(
                    timestamp=(now - timedelta(minutes=5)).isoformat(),
                    action="Intent Created",
                    result="Large order flagged for review"
                )
            ],
            evaluated_at=(now - timedelta(seconds=5)).isoformat(),
            note="⚠️ CRITICAL: Large order in volatile/illiquid market - DAO override required"
        )
    ]
    
    return intents


# In-memory storage (for demo purposes)
INTENTS_CACHE = generate_intent_data()


# Routes
@api_router.get("/")
async def root():
    return {"message": "Aegis API - Execution Firewall for Agentic Web3"}

@api_router.get("/intents", response_model=List[Intent])
async def get_intents():
    """Get all intents with their current status and risk scores"""
    return INTENTS_CACHE

@api_router.get("/intents/{intent_id}", response_model=Intent)
async def get_intent_detail(intent_id: str):
    """Get detailed information for a specific intent"""
    for intent in INTENTS_CACHE:
        if intent.id == intent_id:
            return intent
    raise HTTPException(status_code=404, detail="Intent not found")

@api_router.get("/market/live", response_model=LiveMarket)
async def get_live_market():
    """Get live market data for SUI/USDC on DeepBook"""
    return LiveMarket(
        pair="SUI/USDC",
        price=0.90,
        change_24h=-2.6,
        volume_24h="~$10K–15K",
        liquidity_depth="~$241K"
    )

@api_router.post("/simulate-rogue")
async def simulate_rogue_market(request: SimulateRogueRequest):
    """Simulate rogue market conditions - spikes volatility for demo"""
    global INTENTS_CACHE
    
    for intent in INTENTS_CACHE:
        if intent.id == request.intent_id:
            # Spike the risk factors
            intent.risk_score = 97
            intent.status = "BLOCKED"
            intent.risk_breakdown.volatility = 36
            intent.risk_breakdown.liquidity = 28
            intent.risk_breakdown.concentration = 13
            intent.market_snapshot.change_24h = -18.0
            intent.market_snapshot.liquidity_depth = 45000
            intent.market_snapshot.spread = 65
            intent.note = "⚠️ CRITICAL: Large order in volatile/illiquid market - DAO override required"
            
            now = datetime.now(timezone.utc)
            intent.logs.insert(0, ExecutionLog(
                timestamp=now.isoformat(),
                action="Market Volatility Spike",
                result="Risk increased to 97/100 - Execution blocked"
            ))
            intent.evaluated_at = now.isoformat()
            
            return {"success": True, "message": "Rogue market conditions simulated", "intent": intent}
    
    raise HTTPException(status_code=404, detail="Intent not found")

@api_router.post("/kill-switch/{intent_id}")
async def kill_switch(intent_id: str):
    """Emergency kill switch - revoke intent execution"""
    global INTENTS_CACHE
    
    for intent in INTENTS_CACHE:
        if intent.id == intent_id:
            if intent.status in ["REVOKED", "EXECUTED"]:
                raise HTTPException(status_code=400, detail=f"Cannot revoke {intent.status.lower()} intent")
            
            intent.status = "REVOKED"
            now = datetime.now(timezone.utc)
            intent.logs.insert(0, ExecutionLog(
                timestamp=now.isoformat(),
                action="Kill Switch Activated",
                result="Intent revoked by DAO/Guardian - Execution permanently blocked"
            ))
            intent.evaluated_at = now.isoformat()
            
            return {"success": True, "message": "Intent revoked successfully", "intent": intent}
    
    raise HTTPException(status_code=404, detail="Intent not found")

@api_router.post("/reset-demo")
async def reset_demo():
    """Reset demo data to initial state"""
    global INTENTS_CACHE
    INTENTS_CACHE = generate_intent_data()
    return {"success": True, "message": "Demo data reset successfully"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
