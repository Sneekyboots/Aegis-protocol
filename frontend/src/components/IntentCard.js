import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Clock, Zap } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const getRiskLevel = (score) => {
  if (score < 40) return { level: "safe", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" };
  if (score < 70) return { level: "warning", color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30" };
  return { level: "danger", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30" };
};

const getStatusConfig = (status) => {
  const configs = {
    APPROVED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "APPROVED ✓" },
    EXECUTED: { icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "EXECUTED" },
    BLOCKED: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "BLOCKED 🛑" },
    REVOKED: { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "REVOKED" },
  };
  return configs[status] || configs.APPROVED;
};

export function IntentCard({ intent, onClick, onSimulateRogue }) {
  const riskConfig = getRiskLevel(intent.risk_score);
  const statusConfig = getStatusConfig(intent.status);
  const StatusIcon = statusConfig.icon;

  const isRogueDemo = intent.id === "INTENT-003" && intent.status !== "BLOCKED";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`intent-card cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 border ${riskConfig.borderColor} rounded-xl p-6 backdrop-blur-sm transition-all ${
        riskConfig.level === "danger" ? "glow-red" : riskConfig.level === "warning" ? "glow-yellow" : "glow-green"
      }`}
      onClick={onClick}
      data-testid={`intent-card-${intent.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1" data-testid="intent-id">
            {intent.id}
          </h3>
          <p className="text-sm text-gray-400">
            {intent.action}
          </p>
        </div>
        <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Risk Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Risk Score:</span>
          <span className={`text-2xl font-bold ${riskConfig.color}`} data-testid="risk-score">
            {intent.risk_score}/100
          </span>
        </div>
        <Progress 
          value={intent.risk_score} 
          className={`h-2 ${riskConfig.bgColor}`}
          indicatorClassName={riskConfig.level === "danger" ? "bg-red-500" : riskConfig.level === "warning" ? "bg-yellow-500" : "bg-green-500"}
        />
      </div>

      {/* Status & Quantum */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className="text-xs text-gray-400">Status</span>
          </div>
          <div className={`text-sm font-semibold ${statusConfig.color}`}>
            {intent.status}
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Quantum</span>
          </div>
          <div className="text-sm font-semibold text-purple-400">
            {intent.quantum}
          </div>
        </div>
      </div>

      {/* Expires In */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Expires in:</span>
        </div>
        <span className="font-semibold text-white">{intent.expires_in}</span>
      </div>

      {/* Simulate Rogue Button (only for INTENT-003 demo) */}
      {isRogueDemo && (
        <Button
          variant="destructive"
          size="sm"
          className="w-full mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onSimulateRogue(intent.id);
          }}
          data-testid="simulate-rogue-button"
        >
          🔥 Simulate Rogue Market
        </Button>
      )}
    </motion.div>
  );
}
