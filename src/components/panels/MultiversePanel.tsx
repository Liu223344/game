// 放置帝国 - 多元宇宙面板
import { useGameStore } from '@/store/gameStore';
import {
  checkMultiverseUnlock,
  enterUniverse,
  leaveUniverse,
  getMultiverseProgress,
  checkMultiverseVictory,
} from '@/game/systems/multiverseSystem';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'framer-motion';
import type { UniverseType } from '@/game/types';

const UNIVERSE_ICONS: Record<UniverseType, string> = {
  mirror: '🪞',
  frozen: '❄️',
  inferno: '🔥',
  quantum: '⚛️',
  void: '🌌',
};

export function MultiversePanel() {
  const multiverse = useGameStore((state) => state.multiverse);
  const tech = useGameStore((state) => state.tech);
  const gameState = useGameStore.getState();

  const isUnlocked = checkMultiverseUnlock(gameState);
  const progress = getMultiverseProgress(gameState);
  const isVictory = checkMultiverseVictory(gameState);

  // 未解锁状态
  if (!isUnlocked) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
          <span>🌌</span> 多元宇宙
        </h2>
        <div className="game-panel p-8 text-center">
          <div className="text-6xl mb-4 opacity-30">🔒</div>
          <h3 className="text-xl font-display text-ancient-300 mb-2">尚未解锁</h3>
          <p className="text-ancient-400 text-sm">
            需要研究"因果律武器"科技才能开启多元宇宙探索
          </p>
          <p className="text-ancient-400 text-xs mt-2">
            当前已研究 {tech.researched.length} 项科技
          </p>
        </div>
      </div>
    );
  }

  // 多元宇宙主宰结局
  if (isVictory) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
          <span>🌌</span> 多元宇宙
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-panel p-8 text-center border-2 border-yellow-500/50"
        >
          <div className="text-6xl mb-4">👑</div>
          <h3 className="text-2xl font-display text-yellow-300 mb-2">多元宇宙主宰</h3>
          <p className="text-ancient-300">
            恭喜！您已成功探索所有平行宇宙，成为多元宇宙的主宰者
          </p>
          <p className="text-ancient-400 text-sm mt-2">
            这是放置帝国的终极结局之一
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
        <span>🌌</span> 多元宇宙
      </h2>

      {/* 进度概览 */}
      <div className="game-panel p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-2xl font-display text-royal-300">{progress.completed}</div>
            <div className="text-xs text-ancient-400">已探索</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-2xl font-display text-blue-400">{progress.total}</div>
            <div className="text-xs text-ancient-400">总宇宙数</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-2xl font-display text-yellow-400">
              {progress.isExploring ? '探索中' : '待命'}
            </div>
            <div className="text-xs text-ancient-400">当前状态</div>
          </div>
        </div>
      </div>

      {/* 当前探索进度 */}
      {progress.isExploring && multiverse.currentUniverse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-panel p-4 border-2 border-purple-500/50"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-display text-purple-300">
              {UNIVERSE_ICONS[multiverse.currentUniverse]} 正在探索
            </h3>
            <button
              className="game-button text-sm"
              onClick={() => leaveUniverse()}
            >
              🚪 离开
            </button>
          </div>
          <ProgressBar
            label="探索进度"
            value={progress.currentProgress}
            max={1}
            showPercent
            color="purple"
          />
        </motion.div>
      )}

      {/* 宇宙列表 */}
      <div className="space-y-3">
        {multiverse.universes.map((universe) => {
          const isCurrent = multiverse.currentUniverse === universe.id;
          return (
            <motion.div
              key={universe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`game-panel p-4 ${universe.isCompleted ? 'opacity-60' : ''} ${
                isCurrent ? 'border-2 border-purple-500/50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{UNIVERSE_ICONS[universe.id]}</span>
                  <div>
                    <h3 className="text-lg font-display text-royal-200 flex items-center gap-2">
                      {universe.name}
                      {universe.isCompleted && <span className="text-xs text-green-400">✓ 已完成</span>}
                    </h3>
                    <p className="text-xs text-ancient-400">{universe.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-ancient-800/50 p-2 rounded">
                  <span className="text-ancient-400">规则：</span>
                  <span className="text-ancient-200 ml-1">{universe.rule}</span>
                </div>
                <div className="bg-ancient-800/50 p-2 rounded">
                  <span className="text-ancient-400">奖励：</span>
                  <span className="text-yellow-300 ml-1">{universe.reward}</span>
                </div>
              </div>

              {!universe.isCompleted && !isCurrent && (
                <button
                  className="game-button w-full text-sm"
                  onClick={() => enterUniverse(universe.id)}
                  disabled={progress.isExploring}
                >
                  {progress.isExploring ? '正在探索其他宇宙' : '🚀 进入探索'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
