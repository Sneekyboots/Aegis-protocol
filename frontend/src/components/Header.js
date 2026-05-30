import { motion } from "framer-motion";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function Header({ onResetDemo }) {
  return (
    <header className="border-b border-gray-800 bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                AEGIS
              </h1>
              <p className="text-xs text-gray-500">Execution Firewall for Agentic Web3</p>
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <span className="hidden sm:inline-flex px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
              Testnet
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onResetDemo}
              className="hidden sm:flex items-center gap-2 border-gray-700 hover:border-gray-600 bg-gray-900/50"
              data-testid="reset-demo-button"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Demo
            </Button>

            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              data-testid="connect-wallet-button"
            >
              Connect Wallet
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
