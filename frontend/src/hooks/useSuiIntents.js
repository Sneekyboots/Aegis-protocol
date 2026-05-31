import { useCallback, useEffect, useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const AEGIS_PACKAGE_ID = process.env.REACT_APP_AEGIS_PACKAGE_ID || '0x57cc884ee0b0b192bb5e11e1072361b660ab69ce4cd8564271258c64b4b00309';
// Events are indexed under the ORIGINAL (v1) package ID even after upgrade
const AEGIS_ORIGINAL_PKG = '0xd8e4db745b986cca6ce1987b32010d9f3f249f04e3c85abbe4935ef49554246a';
const DEFAULT_MARKET = {
  price: 3.85,
  change_24h: 2.1,
  volume_24h: 1250000,
  liquidity_depth: 5000000,
};

function eventIntentId(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value.id === 'string') return value.id;
  return '';
}

function decodeAction(actionValue) {
  if (typeof actionValue === 'string') return actionValue;
  if (Array.isArray(actionValue)) {
    try {
      return new TextDecoder().decode(Uint8Array.from(actionValue)).replace(/\0/g, '') || 'swap';
    } catch {
      return 'swap';
    }
  }
  return 'swap';
}

function toDisplayId(objectId) {
  if (!objectId || objectId.length < 12) return objectId;
  return `INTENT-${objectId.slice(2, 8).toUpperCase()}`;
}

function statusFromFlags(flags) {
  if (flags.revoked) return 'REVOKED';
  if (flags.blocked) return 'BLOCKED';
  if (flags.executed) return 'EXECUTED';
  return 'APPROVED';
}

function fallbackDemoIntents() {
  const now = Date.now();
  return [
    {
      id: 'INTENT-DEMO-001',
      object_id: '0xdemo0001',
      action: 'swap USDC -> SUI',
      status: 'APPROVED',
      risk_score: 34,
      risk_breakdown: { volatility: 12, liquidity: 10, concentration: 8, quantum: 4 },
      quantum: 'hybrid',
      expires_in: '59m',
      evaluated_at: now,
      risk_history: [{ timestamp: now - 300000, score: 28 }, { timestamp: now - 180000, score: 31 }],
      market_snapshot: DEFAULT_MARKET,
      policy: { max_risk: 70, auto_execute: false, min_liquidity: 500000 },
      note: 'Fallback demo intent. Seed real intents with ./seed-intents.sh.',
      logs: [{ action: 'created', timestamp: now - 300000, result: 'Intent created on demo dataset' }],
    },
    {
      id: 'INTENT-DEMO-002',
      object_id: '0xdemo0002',
      action: 'lend SUI to pool',
      status: 'BLOCKED',
      risk_score: 78,
      risk_breakdown: { volatility: 24, liquidity: 22, concentration: 20, quantum: 12 },
      quantum: 'pqc-ready',
      expires_in: '42m',
      evaluated_at: now,
      risk_history: [{ timestamp: now - 360000, score: 55 }, { timestamp: now - 120000, score: 78 }],
      market_snapshot: { ...DEFAULT_MARKET, change_24h: -3.8 },
      policy: { max_risk: 70, auto_execute: false, min_liquidity: 500000 },
      note: 'Fallback demo intent. Seed real intents with ./seed-intents.sh.',
      logs: [{ action: 'blocked', timestamp: now - 120000, result: 'Risk exceeded policy threshold' }],
    },
  ];
}

export function useSuiIntents() {
  const client = useSuiClient();
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntents = useCallback(async () => {
    try {
      setLoading(true);
      const [createdRes, riskRes, blockedRes, revokedRes, executedRes] = await Promise.all([
        client.queryEvents({ query: { MoveEventType: `${AEGIS_ORIGINAL_PKG}::intent::IntentCreated` }, order: 'descending', limit: 50 }),
        client.queryEvents({ query: { MoveEventType: `${AEGIS_ORIGINAL_PKG}::intent::RiskUpdated` }, order: 'descending', limit: 100 }),
        client.queryEvents({ query: { MoveEventType: `${AEGIS_ORIGINAL_PKG}::intent::IntentBlocked` }, order: 'descending', limit: 50 }),
        client.queryEvents({ query: { MoveEventType: `${AEGIS_ORIGINAL_PKG}::intent::IntentRevoked` }, order: 'descending', limit: 50 }),
        client.queryEvents({ query: { MoveEventType: `${AEGIS_ORIGINAL_PKG}::intent::IntentExecuted` }, order: 'descending', limit: 50 }),
      ]);

      const byId = new Map();
      const now = Date.now();

      for (const event of createdRes.data || []) {
        const json = event.parsedJson || {};
        const objectId = eventIntentId(json.intent_id);
        if (!objectId) continue;

        byId.set(objectId, {
          id: toDisplayId(objectId),
          object_id: objectId,
          action: decodeAction(json.action),
          status: 'APPROVED',
          risk_score: 0,
          risk_breakdown: { volatility: 0, liquidity: 0, concentration: 0, quantum: 0 },
          quantum: 'hybrid',
          expires_in: '60m',
          evaluated_at: now,
          risk_history: [],
          market_snapshot: DEFAULT_MARKET,
          policy: { max_risk: 70, auto_execute: false, min_liquidity: 500000 },
          note: 'Loaded from Sui testnet events',
          logs: [
            {
              action: 'created',
              timestamp: event.timestampMs ? Number(event.timestampMs) : now,
              result: 'IntentCreated event received',
            },
          ],
          _flags: { blocked: false, revoked: false, executed: false },
        });
      }

      for (const event of riskRes.data || []) {
        const json = event.parsedJson || {};
        const objectId = eventIntentId(json.intent_id);
        if (!objectId || !byId.has(objectId)) continue;
        const item = byId.get(objectId);
        const score = Number(json.risk_score || 0);
        item.risk_score = score;
        item.evaluated_at = Number(json.evaluated_at || event.timestampMs || now);
        item.risk_breakdown = {
          volatility: Math.round(score * 0.4),
          liquidity: Math.round(score * 0.3),
          concentration: Math.round(score * 0.2),
          quantum: Math.round(score * 0.1),
        };
        item.risk_history.push({ timestamp: Number(event.timestampMs || now), score });
        item.logs.unshift({
          action: 'risk_updated',
          timestamp: Number(event.timestampMs || now),
          result: `Risk score updated to ${score}`,
        });
      }

      for (const event of blockedRes.data || []) {
        const objectId = eventIntentId((event.parsedJson || {}).intent_id);
        if (!objectId || !byId.has(objectId)) continue;
        const item = byId.get(objectId);
        item._flags.blocked = true;
        item.logs.unshift({ action: 'blocked', timestamp: Number(event.timestampMs || now), result: 'IntentBlocked event received' });
      }

      for (const event of revokedRes.data || []) {
        const objectId = eventIntentId((event.parsedJson || {}).intent_id);
        if (!objectId || !byId.has(objectId)) continue;
        const item = byId.get(objectId);
        item._flags.revoked = true;
        item.logs.unshift({ action: 'revoked', timestamp: Number(event.timestampMs || now), result: 'IntentRevoked event received' });
      }

      for (const event of executedRes.data || []) {
        const objectId = eventIntentId((event.parsedJson || {}).intent_id);
        if (!objectId || !byId.has(objectId)) continue;
        const item = byId.get(objectId);
        item._flags.executed = true;
        item.logs.unshift({ action: 'executed', timestamp: Number(event.timestampMs || now), result: 'IntentExecuted event received' });
      }

      const mapped = Array.from(byId.values()).map((intent) => ({
        ...intent,
        status: statusFromFlags(intent._flags),
      }));

      if (mapped.length > 0) {
        setIntents(mapped);
      } else {
        setIntents(fallbackDemoIntents());
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching intents:', err);
      setError(err.message || 'Failed to fetch intents');
      setIntents(fallbackDemoIntents());
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Subscribe to real-time updates via WebSocket (falls back to polling only)
  useEffect(() => {
    let unsub;
    const subscribe = async () => {
      try {
        unsub = await client.subscribeEvent({
          filter: { MoveEventModule: { package: AEGIS_ORIGINAL_PKG, module: 'intent' } },
          onMessage: () => { fetchIntents(); },
        });
      } catch {
        /* WebSocket not available — polling is the fallback */
      }
    };
    subscribe();
    return () => { unsub?.(); };
  }, [client, fetchIntents]);

  // Poll every 10 seconds
  useEffect(() => {
    fetchIntents();
    const interval = setInterval(fetchIntents, 10000);
    return () => clearInterval(interval);
  }, [fetchIntents]);

  return { intents, loading, error, refetch: fetchIntents };
}

// Hook to read all Dynamic Fields of an intent object (brain data written by agent)
export function useIntentBrain(objectId) {
  const client = useSuiClient();
  const [brain, setBrain] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!objectId || objectId.startsWith('0xdemo')) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data: fieldList } = await client.getDynamicFields({ parentId: objectId });
        const result = {};
        for (const field of fieldList) {
          const obj = await client.getDynamicFieldObject({ parentId: objectId, name: field.name });
          const raw = Array.isArray(field.name.value)
            ? new TextDecoder().decode(Uint8Array.from(field.name.value)).replace(/\0/g, '')
            : String(field.name.value);
          if (!cancelled) result[raw] = obj.data?.content?.fields ?? obj.data?.content;
        }
        if (!cancelled) setBrain(result);
      } catch (err) {
        if (!cancelled) console.error('useIntentBrain:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [objectId, client]);

  return { brain, loading };
}

// Hook to execute intent
export function useExecuteIntent() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const executeIntent = async (intentObjectId) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${AEGIS_PACKAGE_ID}::intent::approve_for_execution`,
      arguments: [tx.object(intentObjectId), tx.pure.u64(Date.now())],
    });

    await signAndExecute({ transaction: tx });
  };

  return { executeIntent };
}

// Hook to revoke intent
export function useRevokeIntent() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const revokeIntent = async (intentObjectId) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${AEGIS_PACKAGE_ID}::intent::revoke_intent`,
      arguments: [tx.object(intentObjectId), tx.pure.u64(Date.now())],
    });

    await signAndExecute({ transaction: tx });
  };

  return { revokeIntent };
}
