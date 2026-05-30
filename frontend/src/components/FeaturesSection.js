import { motion } from "framer-motion";
import { Activity, Database, Zap, Lock, Clock, GitBranch, CheckCircle2, Shield } from "lucide-react";

const FEATURES_BG = "https://static.prod-images.emergentagent.com/jobs/6a8f6157-9c1c-4c4f-9002-c2d092cb1751/images/9ac6825ad45f3a6de61b5e67d36508bf54bc22b60c24b1b08bff827bd952ecb8.png";

export function FeaturesSection() {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Risk Scoring",
      description: "Multi-factor evaluation across volatility, liquidity depth, concentration, and quantum signals. Updates every block.",
      span: "md:col-span-2",
      accent: "from-blue-500/20 to-transparent"
    },
    {
      icon: Database,
      title: "Persistent On-Chain Memory",
      description: "Every evaluation lives in Dynamic Fields. Auditable forever.",
      accent: "from-cyan-500/20 to-transparent"
    },
    {
      icon: Zap,
      title: "Atomic Execution Control",
      description: "Risk check + execute in a single PTB. No race conditions.",
      accent: "from-emerald-500/20 to-transparent"
    },
    {
      icon: Lock,
      title: "Emergency Kill Switch",
      description: "Guardian or DAO revoke. Reverts on-chain with E_RISK_TOO_HIGH.",
      accent: "from-red-500/20 to-transparent"
    },
    {
      icon: Clock,
      title: "Time-Bounded Intents",
      description: "Every intent expires. Stale prices never execute.",
      accent: "from-amber-500/20 to-transparent"
    },
    {
      icon: GitBranch,
      title: "Composable by Design",
      description: "Three lines of Move. Any protocol can wrap their agent flows.",
      span: "md:col-span-2",
      accent: "from-blue-500/20 to-transparent"
    },
    {
      icon: CheckCircle2,
      title: "Policy Enforcement",
      description: "Configure max_risk, min_liquidity, auto_execute per intent type.",
      accent: "from-cyan-500/20 to-transparent"
    },
    {
      icon: Shield,
      title: "Quantum Risk Assessment",
      description: "Hybrid quantum-classical detection for adversarial conditions.",
      accent: "from-purple-500/20 to-transparent"
    }
  ];

  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <img src={FEATURES_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#040914]/70" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full mb-6"
          >
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400">
              Infrastructure Layer
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6"
          >
            Built for production scale.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Everything you need to safely deploy autonomous agents with real treasury access.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden ${feature.span || ""}`}
                data-testid={`feature-card-${i}`}
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-blue-400" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading text-lg text-white font-medium mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
