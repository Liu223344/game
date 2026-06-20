import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { BattleResult } from '@/game/types';

interface BattleAnimationProps {
  result: BattleResult | null;
  onComplete: () => void;
}

// 战斗动画组件 - 显示战斗结果动画
export function BattleAnimation({ result, onComplete }: BattleAnimationProps) {
  const [show, setShow] = useState(false);
  // 用 ref 保存最新的 onComplete，避免父组件重渲染导致定时器被重置
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (result) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onCompleteRef.current();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <AnimatePresence>
      {show && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => {
            setShow(false);
            onComplete();
          }}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`bg-gradient-to-br ${result.victory ? 'from-green-700 to-green-900' : 'from-red-700 to-red-900'} px-8 py-6 rounded-2xl shadow-2xl border-2 ${result.victory ? 'border-green-400' : 'border-red-400'} max-w-md`}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-3"
              >
                {result.victory ? '⚔️' : '💀'}
              </motion.div>
              <div className={`text-3xl font-display font-bold mb-4 ${result.victory ? 'text-green-300' : 'text-red-300'}`}>
                {result.victory ? '战斗胜利' : '战斗失败'}
              </div>

              {/* 损耗信息 */}
              {result.playerLosses.length > 0 && (
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <div className="text-white/70 text-xs mb-1">兵力损耗</div>
                  {result.playerLosses.map((loss) => (
                    <div key={loss.defId} className="text-white text-sm">
                      {loss.defId}: -{loss.lost}
                    </div>
                  ))}
                </div>
              )}

              {/* 奖励信息 */}
              {result.victory && (
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-white/70 text-xs mb-1">获得奖励</div>
                  {Object.entries(result.rewards.resources).map(([res, amount]) => (
                    <div key={res} className="text-yellow-300 text-sm">
                      {res}: +{amount}
                    </div>
                  ))}
                  {result.rewards.experience > 0 && (
                    <div className="text-blue-300 text-sm">经验: +{result.rewards.experience}</div>
                  )}
                  {result.rewards.drops.map((drop, i) => (
                    <div key={i} className="text-purple-300 text-sm">
                      {drop.name}: +{drop.amount}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
