import "@/App.css";
import { useEffect, useState, useCallback } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { SuiProviders } from "@/components/SuiProviders";
import { useRevokeIntent, useSuiIntents } from "@/hooks/useSuiIntents";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const FALLBACK_MARKET = {
  pair: 'SUI/USDC',
  price: 3.85,
  change_24h: 2.1,
  volume_24h: '$1.25B',
  liquidity_depth: '$5.0M',
};

function useMarketPrice() {
  const [data, setData] = useState(FALLBACK_MARKET);
  useEffect(() => {
    const fetchPrice = async () => {
      // Try backend first (keeps CoinGecko rate limits centralized)
      try {
        const res = await fetch(`${BACKEND_URL}/api/market/live`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const json = await res.json();
          setData(json);
          return;
        }
      } catch { /* fall through to direct CoinGecko */ }

      // Direct CoinGecko fallback
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true',
          { signal: AbortSignal.timeout(5000) }
        );
        if (!res.ok) return;
        const json = await res.json();
        const sui = json.sui;
        setData({
          pair: 'SUI/USDC',
          price: Math.round(sui.usd * 100) / 100,
          change_24h: Math.round(sui.usd_24h_change * 100) / 100,
          volume_24h: `$${(sui.usd_24h_vol / 1e9).toFixed(2)}B`,
          liquidity_depth: '$5.0M',
        });
      } catch { /* keep fallback */ }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, []);
  return data;
}

function AppContent() {
  const { intents, loading, error, lastUpdated, refetch } = useSuiIntents();
  const { revokeIntent } = useRevokeIntent();
  const marketData = useMarketPrice();

  const handleKillSwitch = async (intentObjectId) => {
    try {
      await revokeIntent(intentObjectId);
      setTimeout(refetch, 2000);
    } catch (err) {
      console.error("Failed to revoke intent:", err);
    }
  };

  const handleSimulateRogue = useCallback(async () => {
    toast.loading("Seeding rogue intent on-chain…", { id: "rogue" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/simulate-rogue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail || "Backend error");
      toast.success("Rogue intent created!", {
        id: "rogue",
        description: `${body.message} Watching agent response…`,
        duration: 6000,
      });
      // Refresh after a short delay to show the new intent
      setTimeout(refetch, 3000);
      // Refresh again after agent has time to evaluate it
      setTimeout(refetch, 15000);
    } catch (err) {
      toast.error("Simulate rogue failed", {
        id: "rogue",
        description: String(err?.message || err),
      });
    }
  }, [refetch]);

  return (
    <>
      <Dashboard
        intents={intents}
        marketData={marketData}
        loading={loading}
        backendError={error}
        lastUpdated={lastUpdated}
        onKillSwitch={handleKillSwitch}
        onSimulateRogue={handleSimulateRogue}
        onResetDemo={refetch}
      />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <SuiProviders>
      <AppContent />
    </SuiProviders>
  );
}
