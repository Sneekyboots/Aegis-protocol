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

export function Dashboard({ intents, marketData, loading, onSimulateRogue, onKillSwitch, onResetDemo }) {
  const [selectedIntent, setSelectedIntent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0b] via-[#0f0f12] to-[#0a0a0b]">
      {/* Header */}
      <Header onResetDemo={onResetDemo} />

      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Live Dashboard Section */}
      <section className="py-20 px-4" id="live-demo">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Live Intent Execution Firewall
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Watch real-time risk evaluation and execution control in action
            </p>
          </motion.div>

          {/* Market Bar */}
          {marketData && <MarketBar data={marketData} />}

          {/* Intent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {loading ? (
              // Loading skeletons
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="skeleton h-80 rounded-xl"
                  />
                ))}
              </>
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

          {/* Demo Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm mb-4">
              Click on any intent card to view detailed risk analysis and dynamic fields
            </p>
          </motion.div>
        </div>
      </section>

      {/* Code Section */}
      <CodeSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Intent Detail Modal */}
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
