import { motion } from "framer-motion";
import { Code2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CodeSection() {
  const [copied, setCopied] = useState(false);

  const codeText = `let intent = aegis::create_intent(ctx, agent_action);
aegis::evaluate_risk(&mut intent, market_data, ctx);
aegis::execute_intent(&mut intent, ctx);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full mb-6"
          >
            <Code2 className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">
              Composable Primitive
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6"
            data-testid="code-section-title"
          >
            Three lines of <span className="text-gradient-blue">Move</span>.
            <br />
            That's the entire integration.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Aegis is a primitive, not a monolith. Wrap any agent action in the
            same PTB and inherit memory, risk scoring, and kill switch for free.
          </motion.p>
        </div>

        {/* Code Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-blue-500/30 rounded-2xl blur-xl opacity-50" />

          <div className="relative glass-strong rounded-2xl overflow-hidden border border-white/10">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="ml-4 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  aegis_integration.move
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-colors"
                data-testid="copy-code-button"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code */}
            <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-loose">
              <div className="flex">
                <span className="text-slate-600 select-none mr-6 w-4 text-right">1</span>
                <span>
                  <span className="text-purple-400">let</span>{" "}
                  <span className="text-white">intent</span>{" "}
                  <span className="text-slate-500">=</span>{" "}
                  <span className="text-cyan-300">aegis</span>
                  <span className="text-slate-500">::</span>
                  <span className="text-blue-400">create_intent</span>
                  <span className="text-slate-400">(</span>
                  <span className="text-orange-300">ctx</span>
                  <span className="text-slate-400">,</span>{" "}
                  <span className="text-orange-300">agent_action</span>
                  <span className="text-slate-400">);</span>
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-600 select-none mr-6 w-4 text-right">2</span>
                <span>
                  <span className="text-cyan-300">aegis</span>
                  <span className="text-slate-500">::</span>
                  <span className="text-blue-400">evaluate_risk</span>
                  <span className="text-slate-400">(</span>
                  <span className="text-purple-400">&mut</span>{" "}
                  <span className="text-orange-300">intent</span>
                  <span className="text-slate-400">,</span>{" "}
                  <span className="text-orange-300">market_data</span>
                  <span className="text-slate-400">,</span>{" "}
                  <span className="text-orange-300">ctx</span>
                  <span className="text-slate-400">);</span>
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-600 select-none mr-6 w-4 text-right">3</span>
                <span>
                  <span className="text-cyan-300">aegis</span>
                  <span className="text-slate-500">::</span>
                  <span className="text-blue-400">execute_intent</span>
                  <span className="text-slate-400">(</span>
                  <span className="text-purple-400">&mut</span>{" "}
                  <span className="text-orange-300">intent</span>
                  <span className="text-slate-400">,</span>{" "}
                  <span className="text-orange-300">ctx</span>
                  <span className="text-slate-400">);</span>{" "}
                  <span className="text-slate-600">// auto-reverts if risk &gt; threshold</span>
                </span>
              </div>
            </div>

            {/* Bottom annotations */}
            <div className="border-t border-white/5 bg-white/[0.02] px-6 py-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono">
              <span className="text-slate-500">
                <span className="text-emerald-400">✓</span> No proxy contract
              </span>
              <span className="text-slate-500">
                <span className="text-emerald-400">✓</span> No off-chain bot
              </span>
              <span className="text-slate-500">
                <span className="text-emerald-400">✓</span> Same PTB as your action
              </span>
              <span className="text-slate-500">
                <span className="text-emerald-400">✓</span> Reverts on risk breach
              </span>
            </div>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-8"
        >
          {[
            { label: "Persistent Memory", desc: "Dynamic Fields" },
            { label: "Risk Scoring", desc: "Multi-factor" },
            { label: "Kill Switch", desc: "DAO/Guardian" },
            { label: "On-Chain Audit", desc: "Forever logged" },
          ].map((f) => (
            <div key={f.label} className="glass rounded-xl p-4 text-center hover:border-white/20 transition-colors">
              <div className="text-sm text-white font-medium">{f.label}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-1">{f.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
