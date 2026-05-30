import { motion } from "framer-motion";
import { Shield, Activity, Database, Zap, Clock, Lock, CheckCircle, GitBranch } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Risk Scoring",
      description: "Multi-factor risk evaluation based on volatility, liquidity depth, concentration, and quantum factors. Updates every block."
    },
    {
      icon: Database,
      title: "Persistent On-Chain Memory",
      description: "Every intent evaluation, risk score change, and execution is stored permanently in Dynamic Fields on Sui. Full auditability."
    },
    {
      icon: Zap,
      title: "Atomic Execution Control",
      description: "Intents auto-execute when safe, or block when risk exceeds threshold. All within a single Programmable Transaction Block."
    },
    {
      icon: Lock,
      title: "Emergency Kill Switch",
      description: "DAO or guardian can revoke any pending intent. Attempted executions revert on-chain with E_RISK_TOO_HIGH."
    },
    {
      icon: Clock,
      title: "Time-Bounded Intents",
      description: "Every intent has an expiration. Prevents stale trades from executing in changed market conditions."
    },
    {
      icon: GitBranch,
      title: "Composable by Design",
      description: "Aegis is infrastructure, not a product. Any protocol can wrap their agent actions in 3 lines of Move code."
    },
    {
      icon: CheckCircle,
      title: "Policy Enforcement",
      description: "Configure max risk thresholds, minimum liquidity requirements, and auto-execution policies per intent type."
    },
    {
      icon: Shield,
      title: "Quantum Risk Assessment",
      description: "Hybrid quantum-classical risk scoring for next-generation threat detection and market manipulation prevention."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Infrastructure Layer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for Production Scale
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to safely deploy autonomous agents with real treasury access
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}