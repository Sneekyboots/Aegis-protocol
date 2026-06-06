import { motion } from "framer-motion";
import { Activity, Droplets, TrendingDown, TrendingUp, Cpu } from "lucide-react";

export function MarketBar({ data }) {
  const isPositive = data.change_24h > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-5 md:p-6 mb-8"
      data-testid="market-bar"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-center">
        {/* Pair label */}
        <div className="col-span-2 md:col-span-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">
            Live Market
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg text-white font-medium" data-testid="market-pair">
              {data.pair}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Live
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="border-l border-white/5 pl-4 md:pl-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">
            Price
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl text-white font-medium" data-testid="market-price">
              ${data.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 24h Change */}
        <div className="border-l border-white/5 pl-4 md:pl-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">
            24h Change
          </div>
          <div className={`flex items-center gap-1 font-mono text-lg font-medium ${
            isPositive ? "text-emerald-400" : "text-red-400"
          }`} data-testid="market-change">
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(data.change_24h)}%
          </div>
        </div>

        {/* Volume */}
        <div className="border-l border-white/5 pl-4 md:pl-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            24h Volume
          </div>
          <div className="font-mono text-lg text-white" data-testid="market-volume">
            {data.volume_24h}
          </div>
        </div>

        {/* Liquidity */}
        <div className="border-l border-white/5 pl-4 md:pl-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1 flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            Liquidity
          </div>
          <div className="font-mono text-lg text-white" data-testid="market-liquidity">
            {data.liquidity_depth}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
