import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Dashboard } from "@/components/Dashboard";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [intents, setIntents] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIntents = async () => {
    try {
      const response = await axios.get(`${API}/intents`);
      setIntents(response.data);
    } catch (error) {
      console.error("Error fetching intents:", error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(`${API}/market/live`);
      setMarketData(response.data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchIntents(), fetchMarketData()]);
      setLoading(false);
    };

    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchIntents();
      fetchMarketData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateRogue = async (intentId) => {
    try {
      await axios.post(`${API}/simulate-rogue`, { intent_id: intentId });
      await fetchIntents();
    } catch (error) {
      console.error("Error simulating rogue market:", error);
    }
  };

  const handleKillSwitch = async (intentId) => {
    try {
      await axios.post(`${API}/kill-switch/${intentId}`);
      await fetchIntents();
    } catch (error) {
      console.error("Error activating kill switch:", error);
    }
  };

  const handleResetDemo = async () => {
    try {
      await axios.post(`${API}/reset-demo`);
      await fetchIntents();
    } catch (error) {
      console.error("Error resetting demo:", error);
    }
  };

  return (
    <div className="App min-h-screen bg-[#0a0a0b]">
      <Dashboard
        intents={intents}
        marketData={marketData}
        loading={loading}
        onSimulateRogue={handleSimulateRogue}
        onKillSwitch={handleKillSwitch}
        onResetDemo={handleResetDemo}
      />
      <Toaster />
    </div>
  );
}

export default App;
