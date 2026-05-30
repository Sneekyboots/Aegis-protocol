import { motion } from "framer-motion";
import { ArrowRight, Zap, ChevronDown } from "lucide-react";

const HERO_3D = "https://static.prod-images.emergentagent.com/jobs/6a8f6157-9c1c-4c4f-9002-c2d092cb1751/images/e786d3e44bc4062a9079091cd2a1fa0df52980530f13181abe526bbbb481c2f9.png";

export function HeroSection() {
  const scrollToDemo = () => {
    document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Ambient glows */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-8"
              data-testid="hero-badge"
            >
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-300">
                Web3 Infrastructure · Built on Sui
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-5xl md:text-7xl font-medium tracking-tighter text-white leading-[1.05] mb-6"
              data-testid="hero-title"
            >
              The execution
              <br />
              firewall for{" "}
              <span className="text-gradient-cyber">
                agentic
                <br />
                Web3
              </span>
              .
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed"
              data-testid="hero-subtitle"
            >
              Aegis stops autonomous agents from making catastrophic on-chain decisions.
              Real-time risk scoring, persistent on-chain memory, and a guardian
              kill switch — composable in three lines of Move.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <button
                onClick={scrollToDemo}
                className="group relative pill bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center gap-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all"
                data-testid="hero-cta-demo"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
                <Zap className="w-4 h-4" />
                See the firewall live
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="pill glass text-white hover:bg-white/[0.05] transition-all"
                data-testid="hero-cta-docs"
              >
                Read the docs
              </button>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-6 text-xs font-mono uppercase tracking-[0.2em] text-slate-500"
            >
              <span data-testid="trust-on-chain">100% On-Chain</span>
              <span className="w-px h-3 bg-slate-700" />
              <span data-testid="trust-latency">&lt;100ms Eval</span>
              <span className="w-px h-3 bg-slate-700" />
              <span data-testid="trust-open-source">Open Source</span>
            </motion.div>
          </div>

          {/* Right - 3D Hero image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative w-full max-w-md"
            >
              {/* Animated glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-3xl rounded-full animate-glow" />
              
              <motion.img
                src={HERO_3D}
                alt="Aegis 3D Shield"
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-full h-auto drop-shadow-[0_0_60px_rgba(59,130,246,0.4)]"
                data-testid="hero-3d-shield"
              />
              
              {/* Floating data points */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-10 -left-4 glass-strong rounded-xl px-3 py-2 hidden sm:block"
                data-testid="floating-stat-1"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Risk Score</div>
                <div className="font-mono text-emerald-400 text-lg">21<span className="text-slate-500 text-xs">/100</span></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 -right-4 glass-strong rounded-xl px-3 py-2 hidden sm:block"
                data-testid="floating-stat-2"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Status</div>
                <div className="font-mono text-cyan-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  Live
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
