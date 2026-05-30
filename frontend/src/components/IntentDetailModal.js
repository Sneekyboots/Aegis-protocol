import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, AlertTriangle, TrendingDown, Droplets, Activity, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export function IntentDetailModal({ intent, open, onClose, onKillSwitch }) {
  if (!open || !intent) return null;

  const riskLevel = intent.risk_score < 40 ? "safe" : intent.risk_score < 70 ? "warning" : "danger";
  const canRevoke = !["REVOKED", "EXECUTED"].includes(intent.status);

  // Format risk history for chart
  const chartData = intent.risk_history.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: point.score,
  }));

  const handleKillSwitch = () => {
    if (window.confirm(`Are you sure you want to revoke ${intent.id}? This action cannot be undone.`)) {
      onKillSwitch(intent.id);
      toast.success(`${intent.id} has been revoked successfully`);
      onClose();
    }
  };

  const handleCopyObjectId = () => {
    navigator.clipboard.writeText(intent.object_id);
    toast.success("Object ID copied to clipboard");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="intent-detail-modal"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700 p-6 flex items-start justify-between z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{intent.id}</h2>
              <p className="text-gray-400">{intent.action}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-800"
              data-testid="close-modal-button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Object ID & Explorer Link */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-sm text-gray-400 block mb-1">Object ID</span>
                  <code 
                    className="text-sm text-purple-400 font-mono cursor-pointer hover:text-purple-300"
                    onClick={handleCopyObjectId}
                    data-testid="object-id"
                  >
                    {intent.object_id}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:border-purple-500"
                  onClick={() => window.open(`https://suiexplorer.com/object/${intent.object_id}?network=testnet`, '_blank')}
                  data-testid="explorer-link-button"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Sui Explorer
                </Button>
              </div>
            </div>

            {/* Risk Timeline Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Risk Timeline
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={riskLevel === "danger" ? "#EF4444" : riskLevel === "warning" ? "#F59E0B" : "#10B981"}
                    strokeWidth={3}
                    dot={{ fill: "#1F2937", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Fields - The Brain */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Dynamic Fields — The Brain
              </h3>

              {/* Risk Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">risk.score</span>
                  <Badge className={`${
                    riskLevel === "danger" ? "bg-red-500/20 text-red-400" :
                    riskLevel === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {intent.risk_score}/100
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Volatility</div>
                    <div className="text-lg font-bold text-white">{intent.risk_breakdown.volatility}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Liquidity</div>
                    <div className="text-lg font-bold text-white">{intent.risk_breakdown.liquidity}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Concentration</div>
                    <div className="text-lg font-bold text-white">{intent.risk_breakdown.concentration}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Quantum</div>
                    <div className="text-lg font-bold text-white">{intent.risk_breakdown.quantum}</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700 my-4" />

              {/* Market Snapshot */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">market</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Base Price</div>
                    <div className="text-sm font-semibold text-white">${intent.market_snapshot.price}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      24h Change
                    </div>
                    <div className={`text-sm font-semibold ${intent.market_snapshot.change_24h < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {intent.market_snapshot.change_24h}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Volume
                    </div>
                    <div className="text-sm font-semibold text-white">${(intent.market_snapshot.volume_24h / 1000).toFixed(1)}K</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      Liquidity
                    </div>
                    <div className="text-sm font-semibold text-white">${(intent.market_snapshot.liquidity_depth / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700 my-4" />

              {/* Policy */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">policy</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Max Risk</div>
                    <div className="text-sm font-semibold text-white">{intent.policy.max_risk}/100</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Auto Execute</div>
                    <div className="text-sm font-semibold text-white">{intent.policy.auto_execute ? "✓ Yes" : "✗ No"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Min Liquidity</div>
                    <div className="text-sm font-semibold text-white">${(intent.policy.min_liquidity / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700 my-4" />

              {/* Note */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">notes</div>
                <div className="text-sm text-gray-300">{intent.note}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Evaluated {new Date(intent.evaluated_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Execution Logs */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Execution Logs</h3>
              <div className="space-y-3">
                {intent.logs.map((log, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b border-gray-700 last:border-0">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{log.action}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{log.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kill Switch */}
            {canRevoke && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Emergency Kill Switch</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Immediately revoke this intent and block execution. This action is irreversible and will be logged on-chain.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleKillSwitch}
                      className="bg-red-600 hover:bg-red-700"
                      data-testid="kill-switch-button"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Activate Kill Switch
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
