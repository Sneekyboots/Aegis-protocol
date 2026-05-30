import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, AlertTriangle, TrendingDown, Droplets, Activity, Cpu, Copy, Shield } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export function IntentDetailModal({ intent, open, onClose, onKillSwitch }) {
  if (!open || !intent) return null;

  const riskLevel = intent.risk_score < 40 ? "safe" : intent.risk_score < 70 ? "warning" : "danger";
  const riskColor = riskLevel === "safe" ? "#10B981" : riskLevel === "warning" ? "#F59E0B" : "#EF4444";
  const canRevoke = !["REVOKED", "EXECUTED"].includes(intent.status);

  const chartData = intent.risk_history.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: point.score,
  }));
  // Add current score as latest point
  chartData.push({
    time: new Date(intent.evaluated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: intent.risk_score,
  });

  const handleKillSwitch = () => {
    if (window.confirm(`Revoke ${intent.id}? This action is permanent and logged on-chain.`)) {
      onKillSwitch(intent.id);
      toast.success(`${intent.id} revoked`, { description: "Execution permanently blocked" });
      onClose();
    }
  };

  const handleCopyObjectId = () => {
    navigator.clipboard.writeText(intent.object_id);
    toast.success("Object ID copied");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
        data-testid="intent-detail-modal"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-strong rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 backdrop-blur-2xl bg-[#0A101D]/95 border-b border-white/5 p-6 md:p-8 flex items-start justify-between z-10 rounded-t-3xl">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Intent</span>
                <span className={`risk-dot ${riskLevel}`} />
              </div>
              <h2 className="font-heading text-3xl text-white font-medium tracking-tight" data-testid="modal-intent-id">
                {intent.id}
              </h2>
              <p className="text-slate-400 mt-1">{intent.action}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 flex items-center justify-center transition-all"
              data-testid="close-modal-button"
            >
              <X className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Object ID + Explorer */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1.5">
                    Object ID
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-cyan-300 truncate" data-testid="object-id">
                      {intent.object_id}
                    </code>
                    <button
                      onClick={handleCopyObjectId}
                      className="p-1.5 hover:bg-white/5 rounded-md transition-colors flex-shrink-0"
                      data-testid="copy-object-id"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`https://suiexplorer.com/object/${intent.object_id}?network=testnet`, '_blank')}
                  className="pill text-xs glass hover:bg-white/10 text-white flex items-center gap-2"
                  data-testid="explorer-link-button"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Sui Explorer
                </button>
              </div>
            </div>

            {/* Risk Timeline */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="font-heading text-lg text-white font-medium">Risk Timeline</h3>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Last 60 min
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`riskGradient-${intent.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={riskColor} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={riskColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748B" 
                    style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} 
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis 
                    stroke="#64748B" 
                    style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} 
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(11, 18, 33, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px'
                    }}
                    labelStyle={{ color: '#94A3B8' }}
                    itemStyle={{ color: riskColor }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={riskColor}
                    strokeWidth={2}
                    fill={`url(#riskGradient-${intent.id})`}
                    dot={{ fill: riskColor, strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Fields */}
            <div className="glass rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="font-heading text-lg text-white font-medium">Dynamic Fields</h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 ml-1">
                  · on-chain brain
                </span>
              </div>

              {/* risk.* */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-cyan-300">risk</span>
                  <span className={`font-mono text-sm ${riskLevel === 'danger' ? 'text-red-400' : riskLevel === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {intent.risk_score}/100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'volatility', value: intent.risk_breakdown.volatility },
                    { label: 'liquidity', value: intent.risk_breakdown.liquidity },
                    { label: 'concentration', value: intent.risk_breakdown.concentration },
                    { label: 'quantum', value: intent.risk_breakdown.quantum },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                        {item.label}
                      </div>
                      <div className="font-mono text-xl text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 my-5" />

              {/* market.* */}
              <div className="mb-6">
                <div className="font-mono text-xs text-cyan-300 mb-3">market</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'base_price', value: `$${intent.market_snapshot.price}` },
                    { label: '24h_change', value: `${intent.market_snapshot.change_24h}%`, color: intent.market_snapshot.change_24h < 0 ? 'text-red-400' : 'text-emerald-400' },
                    { label: 'volume', value: `$${(intent.market_snapshot.volume_24h / 1000).toFixed(1)}K` },
                    { label: 'liquidity_depth', value: `$${(intent.market_snapshot.liquidity_depth / 1000).toFixed(0)}K` },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                        {item.label}
                      </div>
                      <div className={`font-mono text-sm ${item.color || 'text-white'}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 my-5" />

              {/* policy.* */}
              <div className="mb-6">
                <div className="font-mono text-xs text-cyan-300 mb-3">policy</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                      max_risk
                    </div>
                    <div className="font-mono text-sm text-white">{intent.policy.max_risk}/100</div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                      auto_execute
                    </div>
                    <div className={`font-mono text-sm ${intent.policy.auto_execute ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {intent.policy.auto_execute ? "true" : "false"}
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                      min_liquidity
                    </div>
                    <div className="font-mono text-sm text-white">${(intent.policy.min_liquidity / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 my-5" />

              {/* notes */}
              <div>
                <div className="font-mono text-xs text-cyan-300 mb-3">notes</div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <p className="text-sm text-slate-300">{intent.note}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-2">
                    evaluated_at = {new Date(intent.evaluated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Execution Logs */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-heading text-lg text-white font-medium mb-4">Execution Log</h3>
              <div className="space-y-2">
                {intent.logs.map((log, index) => (
                  <div key={index} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        index === 0 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm text-white font-medium">{log.action}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{log.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kill Switch */}
            {canRevoke && (
              <div className="glass rounded-xl p-6 border border-red-500/20">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg text-white font-medium mb-1">Emergency Kill Switch</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Revoke this intent immediately. The on-chain log records this action permanently.
                    </p>
                    <button
                      onClick={handleKillSwitch}
                      className="pill bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 text-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                      data-testid="kill-switch-button"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Activate Kill Switch
                    </button>
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
