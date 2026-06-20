// 放置帝国 - 帝国编年史面板
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getChronicleStats, exportChronicle } from '@/game/systems/chronicleSystem';
import { motion } from 'framer-motion';
import type { ChronicleCategory } from '@/game/types';

const CATEGORY_INFO: Record<ChronicleCategory, { name: string; icon: string; color: string }> = {
  politics: { name: '政治', icon: '👑', color: 'text-yellow-400' },
  military: { name: '军事', icon: '⚔️', color: 'text-red-400' },
  tech: { name: '科技', icon: '🔬', color: 'text-blue-400' },
  culture: { name: '文化', icon: '🎨', color: 'text-purple-400' },
  disaster: { name: '灾难', icon: '💀', color: 'text-gray-400' },
  diplomacy: { name: '外交', icon: '🤝', color: 'text-green-400' },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_INFO) as ChronicleCategory[];

export function ChroniclePanel() {
  const chronicle = useGameStore((state) => state.chronicle);
  const gameState = useGameStore.getState();
  const [filter, setFilter] = useState<ChronicleCategory | 'all'>('all');

  const stats = getChronicleStats(gameState);
  const filtered = filter === 'all' ? chronicle : chronicle.filter((e) => e.category === filter);
  // 倒序显示（最新在前）
  const sorted = [...filtered].reverse().slice(0, 200);

  const handleExport = () => {
    const text = exportChronicle(gameState);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `放置帝国-编年史-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
          <span>📜</span> 帝国编年史
        </h2>
        <button className="game-button text-sm" onClick={handleExport}>
          📥 导出
        </button>
      </div>

      {/* 统计概览 */}
      <div className="game-panel p-4">
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3 text-center">
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-2xl font-display text-royal-300">{stats.total}</div>
            <div className="text-xs text-ancient-400">总记录</div>
          </div>
          {ALL_CATEGORIES.map((cat) => {
            const info = CATEGORY_INFO[cat];
            return (
              <div key={cat} className="bg-ancient-800/50 p-2 rounded">
                <div className={`text-2xl font-display ${info.color}`}>{stats.byCategory[cat]}</div>
                <div className="text-xs text-ancient-400">{info.icon} {info.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`game-button text-sm ${filter === 'all' ? 'nav-item-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const info = CATEGORY_INFO[cat];
          return (
            <button
              key={cat}
              className={`game-button text-sm ${filter === cat ? 'nav-item-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {info.icon} {info.name}
            </button>
          );
        })}
      </div>

      {/* 编年史列表 */}
      <div className="game-panel p-4">
        {sorted.length === 0 ? (
          <p className="text-ancient-300 text-center py-8">尚无编年史记录，继续游戏创造历史吧</p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {sorted.map((entry, idx) => {
              const info = CATEGORY_INFO[entry.category];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  className="border-l-2 border-ancient-600 pl-3 py-1"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-ancient-400">第{entry.year}年</span>
                    <span className={`text-xs ${info.color}`}>{info.icon} {info.name}</span>
                    <span className="text-xs text-ancient-400">· 第{entry.reign + 1}代</span>
                  </div>
                  <div className="font-medium text-royal-200 text-sm">{entry.title}</div>
                  <div className="text-sm text-ancient-300">{entry.description}</div>
                  {entry.impact && (
                    <div className="text-xs text-ancient-400 mt-0.5">影响：{entry.impact}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
