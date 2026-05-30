import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Brain, Lock } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: DollarSign,
      title: "$20M+ Lost to Agent Exploits",
      description: "Euler Finance ($197M), Mango Markets ($114M), and numerous hallucinated agent decisions in 2024-25 resulted in catastrophic losses."
    },
    {
      icon: Brain,
      title: "Agents are Black Boxes",
      description: "You give autonomous agents treasury access and pray. No persistent memory, no audit trail, no human oversight before irreversible execution."
    },
    {
      icon: Lock,
      title: "No Enforceable Risk Gates",
      description: "Existing solutions lack real-time risk evaluation and emergency controls. When an agent goes rogue, it's already too late."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-red-900/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">The Problem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Web3 Agents Need Guardrails
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            In 2025, autonomous agents lost millions because of one bad trade. Without proper safeguards, your treasury is at risk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-colors"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                <p className="text-gray-400 leading-relaxed">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}