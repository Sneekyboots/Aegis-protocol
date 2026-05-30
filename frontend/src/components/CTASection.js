import { motion } from "framer-motion";
import { ArrowUpRight, Github, BookOpen, MessageCircle, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-strong rounded-3xl p-10 md:p-16 text-center mb-12 overflow-hidden border border-white/10"
        >
          {/* Inner glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/30 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(59,130,246,0.5)]"
            >
              <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
            </motion.div>

            <h2 className="font-heading text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6 leading-[1.05]" data-testid="cta-title">
              Secure your agents.
              <br />
              <span className="text-gradient-blue">Deploy the firewall.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Join the protocols building safe, auditable agentic Web3 on Sui. Ship to testnet today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="group pill bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center gap-2 text-sm md:text-base hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all"
                data-testid="cta-start-building"
              >
                Deploy Firewall
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                className="pill glass text-white hover:bg-white/[0.06] text-sm md:text-base transition-all"
                data-testid="cta-schedule-demo"
              >
                Talk to the team
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { 
              icon: Github, 
              title: "GitHub", 
              desc: "Open-source Move contracts and integration examples.",
              testid: "resource-github",
              iconColor: "text-blue-400"
            },
            { 
              icon: BookOpen, 
              title: "Documentation", 
              desc: "Complete guides, API references, and integration tutorials.",
              testid: "resource-docs",
              iconColor: "text-cyan-400"
            },
            { 
              icon: MessageCircle, 
              title: "Community", 
              desc: "Connect with builders and get support from the core team.",
              testid: "resource-discord",
              iconColor: "text-emerald-400"
            },
          ].map((r, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-2xl p-6 hover:border-white/20 transition-all"
              data-testid={r.testid}
            >
              <div className="flex items-start justify-between mb-4">
                <r.icon className={`w-6 h-6 ${r.iconColor}`} />
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="font-heading text-lg text-white font-medium mb-1">{r.title}</h3>
              <p className="text-sm text-slate-400">{r.desc}</p>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/5 pt-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-mono text-sm text-white">AEGIS</span>
              <span className="text-xs text-slate-500 hidden sm:inline">· Execution Firewall for Agentic Web3</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              <span>Built on Sui</span>
              <span>·</span>
              <span>Powered by Move</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-600 text-center mt-6">
            © 2026 Aegis Protocol · Making Web3 agents safe for production
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
