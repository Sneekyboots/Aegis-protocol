import { motion } from "framer-motion";
import { Shield, RefreshCw } from "lucide-react";

const HERO_3D = "https://static.prod-images.emergentagent.com/jobs/6a8f6157-9c1c-4c4f-9002-c2d092cb1751/images/e786d3e44bc4062a9079091cd2a1fa0df52980530f13181abe526bbbb481c2f9.png";

export function Header({ onResetDemo }) {
  const scrollToDemo = () => {
    document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#040914]/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
            data-testid="brand-logo"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/40 blur-xl rounded-full" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-white tracking-wider">AEGIS</h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hidden sm:block">
                Execution Firewall
              </p>
            </div>
          </motion.div>

          {/* Nav Links - center */}
          <nav className="hidden md:flex items-center gap-8" data-testid="main-nav">
            <button
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-300 hover:text-white transition-colors"
              data-testid="nav-problem"
            >
              Problem
            </button>
            <button
              onClick={scrollToDemo}
              className="text-sm text-slate-300 hover:text-white transition-colors"
              data-testid="nav-demo"
            >
              Live Demo
            </button>
            <button
              onClick={() => document.getElementById('code')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-300 hover:text-white transition-colors"
              data-testid="nav-integrate"
            >
              Integrate
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-300 hover:text-white transition-colors"
              data-testid="nav-features"
            >
              Features
            </button>
          </nav>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono uppercase tracking-wider rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Testnet Live
            </span>
            
            <button
              onClick={onResetDemo}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all"
              data-testid="reset-demo-button"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>

            <button
              className="pill bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              data-testid="launch-app-button"
            >
              Launch App
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export { HERO_3D };
