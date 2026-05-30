import { motion } from "framer-motion";
import { Code, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function CodeSection() {
  const codeExample = `// Wrap any agent action in Aegis protection
let intent = aegis::create_intent(ctx, action);
aegis::execute_intent(&mut intent, ctx);  // Auto-blocks if risk > threshold`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    toast.success("Code copied to clipboard!");
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Composable Primitive</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Three Lines of Code
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Aegis is a composable primitive, not a monolith. Any protocol can wrap their agent actions in Aegis for instant protection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="code-block relative group">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid="copy-code-button"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <pre className="text-sm md:text-base">
              <code>
                <span className="code-comment">// Wrap any agent action in Aegis protection</span>
                {"\n"}
                <span className="code-keyword">let</span> intent = <span className="code-function">aegis::create_intent</span>(ctx, action);
                {"\n"}
                <span className="code-function">aegis::execute_intent</span>(&mut intent, ctx);  <span className="code-comment">// Auto-blocks if risk &gt; threshold</span>
              </code>
            </pre>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Persistent Memory", icon: "🧠" },
              { label: "Risk Scoring", icon: "📊" },
              { label: "Kill Switch", icon: "🛑" },
              { label: "On-Chain Audit", icon: "✅" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-sm font-semibold text-white">{feature.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}