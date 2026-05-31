/**
 * QuantumBadge — displays the post-quantum cryptography readiness level of an intent.
 * Statuses: "pqc-ready" | "hybrid" | "classical"
 */
export function QuantumBadge({ status }) {
  const configs = {
    'pqc-ready': {
      label: 'PQC-Ready',
      dot: 'bg-violet-400',
      text: 'text-violet-300',
      border: 'border-violet-500/30',
      bg: 'bg-violet-500/10',
    },
    hybrid: {
      label: 'Hybrid',
      dot: 'bg-cyan-400',
      text: 'text-cyan-300',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    classical: {
      label: 'Classical',
      dot: 'bg-slate-500',
      text: 'text-slate-400',
      border: 'border-slate-600/30',
      bg: 'bg-slate-700/20',
    },
  };

  const cfg = configs[status] || configs.classical;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border}`}
      title={`Quantum security: ${cfg.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      <span className={`text-[9px] font-mono uppercase tracking-widest ${cfg.text}`}>{cfg.label}</span>
    </span>
  );
}
