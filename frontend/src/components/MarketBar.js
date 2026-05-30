import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Activity, Droplets } from "lucide-react";

export function MarketBar({ data }) {
  const isPositive = data.change_24h > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
      data-testid="market-bar"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-1">Live Market ({data.pair} on DeepBook)</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white" data-testid="market-price">
              ${data.price.toFixed(2)} USD
            </span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
              data-testid="market-change"
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(data.change_24h)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Activity className="w-3 h-3" />
              24h Volume
            </div>
            <div className="text-lg font-semibold text-white" data-testid="market-volume">
              {data.volume_24h}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Droplets className="w-3 h-3" />
              Liquidity Depth
            </div>
            <div className="text-lg font-semibold text-white" data-testid="market-liquidity">
              {data.liquidity_depth}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
