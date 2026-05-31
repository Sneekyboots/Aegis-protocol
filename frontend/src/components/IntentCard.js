import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Cpu, Zap } from "lucide-react";
import { QuantumBadge } from "./QuantumBadge";

const SAFE_NODE = "https://static.prod-images.emergentagent.com/jobs/6a8f6157-9c1c-4c4f-9002-c2d092cb1751/images/d50d5fb2a1727897660f0e5ef3e7e2b7e21914a0a8afbe8878e292b8ab8f3bb5.png";
const ROGUE_NODE = "https://static.prod-images.emergentagent.com/jobs/6a8f6157-9c1c-4c4f-9002-c2d092cb1751/images/622643229793ffa6ef9d477c8211f91b5796dcae0fc16d803711eeae85fbcbd2.png";

const getRiskConfig = (score) => {
  if (score < 40) return { 
    level: "safe", 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/30",
    barFrom: "from-emerald-500",
    barTo: "to-cyan-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]"
  };
  if (score < 70) return { 
    level: "warning", 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30",
    barFrom: "from-amber-500",
    barTo: "to-orange-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]"
  };
  return { 
    level: "danger", 
    color: "text-red-400", 
    bg: "bg-red-500/10", 
    border: "border-red-500/40",
    barFrom: "from-red-500",
    barTo: "to-orange-500",
    glow: "shadow-[0_0_40px_rgba(239,68,68,0.3)]"
  };
};

const getStatusConfig = (status) => {
  const configs = {
    APPROVED: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", label: "Approved" },
    EXECUTED: { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", label: "Executed" },
    BLOCKED: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "Blocked" },
    REVOKED: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Revoked" },
  };
  return configs[status] || configs.APPROVED;
};

export function IntentCard({ intent, onClick, onSimulateRogue }) {
  const riskConfig = getRiskConfig(intent.risk_score);
  const statusConfig = getStatusConfig(intent.status);
  const StatusIcon = statusConfig.icon;
  const nodeImage = riskConfig.level === "danger" ? ROGUE_NODE : SAFE_NODE;
  const isRogueDemo = intent.id === "INTENT-003" && intent.status !== "BLOCKED" && intent.status !== "REVOKED";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`group relative cursor-pointer glass-strong rounded-2xl p-6 border ${riskConfig.border} ${riskConfig.glow} hover:border-white/30 transition-all duration-300 overflow-hidden`}
      data-testid={`intent-card-${intent.id}`}
    >
      {/* Background 3D node image */}
      <div className="absolute -top-8 -right-8 w-36 h-36 opacity-25 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
        <img src={nodeImage} alt="" className="w-full h-full object-contain" />
      </div>

      {/* Top: ID and Status */}
      <div className="relative flex items-start justify-between mb-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">
            Intent
          </div>
          <h3 className="font-mono text-lg text-white font-medium" data-testid={`intent-id-${intent.id}`}>
            {intent.id}
          </h3>
        </div>
        
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.border}`}>
          <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="relative mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">
          Action
        </div>
        <p className="text-white text-sm font-medium">
          {intent.action}
        </p>
      </div>

      {/* Risk Score - Big */}
      <div className="relative mb-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
            Risk Score
          </span>
          <span className="text-[10px] font-mono text-slate-500">/ 100</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className={`font-mono text-5xl font-medium ${riskConfig.color} leading-none`} data-testid={`risk-score-${intent.id}`}>
            {intent.risk_score}
          </span>
          <span className={`risk-dot ${riskConfig.level} mb-1`} />
        </div>
        
        {/* Risk bar */}
        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${intent.risk_score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${riskConfig.barFrom} ${riskConfig.barTo} rounded-full`}
          />
        </div>
      </div>

      {/* Footer meta */}
      <div className="relative grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-0.5 flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5" />
            Quantum
          </div>
          <QuantumBadge status={intent.quantum} />
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-0.5 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Expires
          </div>
          <div className="text-xs font-mono text-white">{intent.expires_in}</div>
        </div>
      </div>

      {/* Simulate Rogue Button */}
      {isRogueDemo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSimulateRogue(intent.id);
          }}
          className="relative w-full mt-4 py-2 text-xs font-mono uppercase tracking-wider text-red-300 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 rounded-lg transition-all"
          data-testid="simulate-rogue-button"
        >
          Simulate Rogue Market
        </button>
      )}

      {/* Click indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-white/40" />
      </div>
    </motion.div>
  );
}
