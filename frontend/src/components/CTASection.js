import { motion } from "framer-motion";
import { ArrowRight, Github, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-500/30 rounded-2xl p-12 text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Agents?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join protocols using Aegis to protect billions in autonomous agent transactions
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
              data-testid="cta-start-building"
            >
              Start Building
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 hover:border-gray-600 bg-gray-900/50 text-lg px-8"
              data-testid="cta-schedule-demo"
            >
              Schedule a Demo
            </Button>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.a
            href="https://github.com/aegis-protocol"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
            data-testid="resource-github"
          >
            <Github className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">View on GitHub</h3>
            <p className="text-sm text-gray-400">Explore the open-source Move contracts and integration examples</p>
          </motion.a>

          <motion.a
            href="https://docs.aegis-protocol.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
            data-testid="resource-docs"
          >
            <BookOpen className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
            <p className="text-sm text-gray-400">Complete guides, API references, and integration tutorials</p>
          </motion.a>

          <motion.a
            href="https://discord.gg/aegis"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
            data-testid="resource-discord"
          >
            <MessageCircle className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Join Community</h3>
            <p className="text-sm text-gray-400">Connect with builders and get support from the core team</p>
          </motion.a>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-20 pt-12 border-t border-gray-800"
      >
        <p className="text-gray-500 text-sm mb-4">
          Built on Sui • Powered by Move • Secured by Aegis
        </p>
        <p className="text-gray-600 text-xs">
          © 2025 Aegis Protocol. Making Web3 agents safe for production.
        </p>
      </motion.footer>
    </section>
  );
}