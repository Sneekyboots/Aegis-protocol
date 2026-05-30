import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { MarketBar } from "./MarketBar";
import { IntentCard } from "./IntentCard";
import { IntentDetailModal } from "./IntentDetailModal";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { CodeSection } from "./CodeSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";
import { Radio, MousePointer2 } from "lucide-react";

export function Dashboard({ intents, marketData, loading, onSimulateRogue, onKillSwitch, onResetDemo }) {
  const [selectedIntent, setSelectedIntent] = useState(null);

  return (
    <div className="min-h-screen bg-[#040914] noise">
      <Header onResetDemo={onResetDemo} />

      {/* Hero */}
      <HeroSection />

      {/* Problem */}
      <ProblemSection />

      {/* Live Dashboard */}
      <section id="live-demo" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/8 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full mb-6">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                Live · Sui Testnet
              </span>
            </div>
            
            <h2 className="font-heading text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6 leading-[1.05]" data-testid="dashboard-title">
              Watch the firewall<br />
              <span className="text-gradient-blue">make decisions.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Three real AegisIntent objects on Sui Testnet. Click any card to inspect
              the Dynamic Fields, then verify on Sui Explorer.
            </p>
          </motion.div>

          {/* Market Bar */}
          {marketData && <MarketBar data={marketData} />}

          {/* Intent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-80 rounded-2xl" />
              ))
            ) : (
              intents.map((intent, index) => (
                <motion.div
                  key={intent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <IntentCard
                    intent={intent}
                    onClick={() => setSelectedIntent(intent)}
                    onSimulateRogue={onSimulateRogue}
                  />
                </motion.div>
              ))
            )}
          </div>

          {/* Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mt-10 text-xs font-mono uppercase tracking-[0.2em] text-slate-500"
          >
            <MousePointer2 className="w-3 h-3" />
            <span>Click any intent to view Dynamic Fields and on-chain history</span>
          </motion.div>
        </div>
      </section>

      {/* Code */}
      <CodeSection />

      {/* Features */}
      <FeaturesSection />

      {/* CTA */}
      <CTASection />

      {/* Modal */}
      {selectedIntent && (
        <IntentDetailModal
          intent={selectedIntent}
          open={!!selectedIntent}
          onClose={() => setSelectedIntent(null)}
          onKillSwitch={onKillSwitch}
        />
      )}
    </div>
  );
}
