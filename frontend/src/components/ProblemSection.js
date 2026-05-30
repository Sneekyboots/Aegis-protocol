import { motion } from "framer-motion";
import { TrendingDown, AlertOctagon } from "lucide-react";

const ROGUE_NODE = "https://static.prod-images.emergentagent.com/jobs/6a8f6157-9c1c-4c4f-9002-c2d092cb1751/images/622643229793ffa6ef9d477c8211f91b5796dcae0fc16d803711eeae85fbcbd2.png";

export function ProblemSection() {
  const exploits = [
    { name: "Euler Finance", amount: "$197M", year: "2023", type: "Flash loan exploit" },
    { name: "Mango Markets", amount: "$114M", year: "2022", type: "Oracle manipulation" },
    { name: "Wintermute", amount: "$160M", year: "2022", type: "Hot wallet compromise" },
    { name: "Hallucinated agent", amount: "$20M+", year: "2024-25", type: "Treasury misuse" },
  ];

  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left - 3D Rogue node */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1"
          >
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/15 blur-3xl rounded-full" />
              <motion.img
                src={ROGUE_NODE}
                alt="Rogue agent visualization"
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="relative w-full drop-shadow-[0_0_60px_rgba(239,68,68,0.3)]"
                data-testid="problem-3d-rogue"
              />
            </div>
          </motion.div>

          {/* Right - Content */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full mb-6">
                <AlertOctagon className="w-3 h-3 text-red-400" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-red-400">
                  The Problem
                </span>
              </div>

              <h2 className="font-heading text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6 leading-[1.05]" data-testid="problem-title">
                Agents have treasury access.
                <br />
                <span className="text-red-400">No one has the brakes.</span>
              </h2>

              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl">
                In 2024-25 alone, autonomous agents have triggered <span className="font-mono text-white">$20M+</span> in
                avoidable losses — one hallucinated swap, one manipulated oracle, one stale price feed at a time.
                Today's "agent dashboards" are postmortems. Aegis is the firewall.
              </p>

              {/* Exploit grid */}
              <div className="grid grid-cols-2 gap-3" data-testid="exploit-grid">
                {exploits.map((exploit, i) => (
                  <motion.div
                    key={exploit.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="glass rounded-xl p-4 hover:border-red-500/30 transition-colors group"
                    data-testid={`exploit-${i}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[10px] font-mono text-slate-500">{exploit.year}</span>
                    </div>
                    <div className="font-mono text-2xl md:text-3xl text-white font-medium mb-1 group-hover:text-red-300 transition-colors">
                      {exploit.amount}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 truncate">
                      {exploit.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">
                      {exploit.type}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
