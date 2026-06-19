import { useGameStore } from '@/store/gameStore';
import { getCurrentEra } from '@/game/systems/techSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ERA_NAMES } from '@/utils/constants';

// 时代过渡动画组件 - 当时代变化时显示过渡动画
export function EraTransition() {
  const researchedTechs = useGameStore((state) => state.tech.researched);
  const era = getCurrentEra();
  const [showTransition, setShowTransition] = useState(false);
  const [lastEra, setLastEra] = useState(era);

  useEffect(() => {
    if (era !== lastEra) {
      setShowTransition(true);
      setLastEra(era);
      const timer = setTimeout(() => setShowTransition(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [era, lastEra]);

  const eraIndex = ERA_NAMES.indexOf(era);
  const eraColors = [
    'from-stone-600 to-stone-800',   // 石器
    'from-amber-600 to-amber-800',   // 青铜
    'from-gray-500 to-gray-700',     // 铁器
    'from-red-600 to-red-800',       // 火药
    'from-orange-600 to-orange-800', // 蒸汽
    'from-yellow-500 to-yellow-700', // 电力
    'from-green-500 to-green-700',   // 核能
    'from-blue-500 to-blue-700',     // 信息
    'from-purple-500 to-purple-700', // 太空
    'from-cyan-400 to-cyan-600',     // 未来
    'from-pink-400 to-purple-600',   // 因果
  ];

  const colorClass = eraColors[Math.max(0, Math.min(eraIndex, eraColors.length - 1))];

  return (
    <AnimatePresence>
      {showTransition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className={`bg-gradient-to-br ${colorClass} bg-opacity-90 px-12 py-8 rounded-2xl shadow-2xl border-2 border-white/30`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-white/80 text-sm mb-2">时代演变</div>
              <div className="text-white text-4xl font-display font-bold">{era}</div>
              <div className="text-white/60 text-xs mt-2">已研究 {researchedTechs.length} 项科技</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
