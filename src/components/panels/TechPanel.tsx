import { useGameStore } from '@/store/gameStore';
import { TECHS } from '@/game/data/techs';
import { BUILDINGS } from '@/game/data/buildings';
import { TROOPS } from '@/game/data/troops';
import { SUPER_TROOPS } from '@/game/data/superTroops';
import { startResearch, cancelResearch, getCurrentEra } from '@/game/systems/techSystem';
import { formatNumber } from '@/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type { TechDef } from '@/game/types';

// 时代显示顺序
const ERA_ORDER = [
  '石器时代',
  '青铜时代',
  '铁器时代',
  '火药时代',
  '蒸汽时代',
  '电力时代',
  '核能时代',
  '信息时代',
  '太空时代',
  '未来时代',
  '因果律时代',
];

export function TechPanel() {
  const researchedTechs = useGameStore((state) => state.tech.researched);
  const currentResearch = useGameStore((state) => state.tech.current);
  const researchProgress = useGameStore((state) => state.tech.progress);
  const knowledge = useGameStore((state) => state.resources.knowledge);

  const currentEra = getCurrentEra();

  // 按时代分组
  const techsByEra = ERA_ORDER.map((era) => ({
    era,
    techs: Object.values(TECHS).filter((t) => t.era === era),
  })).filter((group) => group.techs.length > 0);

  const isResearched = (techId: string) => researchedTechs.includes(techId);
  const isAvailable = (tech: TechDef) =>
    !isResearched(tech.id) && tech.prerequisites.every((p) => isResearched(p));

  const handleResearch = (techId: string) => {
    startResearch(techId);
  };

  const handleCancel = () => {
    cancelResearch();
  };

  const currentTech = currentResearch ? TECHS[currentResearch] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">科技</h2>
        <p className="text-ancient-400 text-sm">研究科技，推动文明演变</p>
      </div>

      {/* 当前时代 + 知识 */}
      <div className="game-panel">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-ancient-400">当前时代</div>
            <div className="text-xl font-display text-royal-300">{currentEra}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-ancient-400">知识</div>
            <div className="text-xl font-mono text-blue-400">📜 {formatNumber(knowledge)}</div>
          </div>
        </div>
      </div>

      {/* 当前研究 */}
      <AnimatePresence>
        {currentTech && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="game-panel border-royal-500/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{currentTech.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-royal-300">研究中: {currentTech.name}</div>
                <div className="text-xs text-ancient-400">{currentTech.description}</div>
              </div>
              <button className="game-button text-xs" onClick={handleCancel}>
                取消
              </button>
            </div>
            <ProgressBar value={researchProgress} color="blue" showPercent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 科技树按时代分组 */}
      {techsByEra.map((group) => (
        <div key={group.era}>
          <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
            <span>{group.era}</span>
            {group.era === currentEra && (
              <span className="text-xs px-2 py-0.5 rounded bg-royal-600 text-white">当前</span>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.techs.map((tech) => (
              <TechCard
                key={tech.id}
                tech={tech}
                researched={isResearched(tech.id)}
                available={isAvailable(tech)}
                isCurrent={currentResearch === tech.id}
                canAfford={knowledge >= tech.cost}
                researchedTechs={researchedTechs}
                onResearch={() => handleResearch(tech.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TechCardProps {
  tech: TechDef;
  researched: boolean;
  available: boolean;
  isCurrent: boolean;
  canAfford: boolean;
  researchedTechs: string[];
  onResearch: () => void;
}

function TechCard({
  tech,
  researched,
  available,
  isCurrent,
  canAfford,
  researchedTechs,
  onResearch,
}: TechCardProps) {
  const locked = !researched && !available && !isCurrent;

  // 解锁内容预览
  const unlockPreview: string[] = [];
  if (tech.unlocks.buildings) {
    for (const b of tech.unlocks.buildings) {
      const bdef = BUILDINGS[b];
      if (bdef) unlockPreview.push(`${bdef.icon}${bdef.name}`);
    }
  }
  if (tech.unlocks.troops) {
    for (const tId of tech.unlocks.troops) {
      const tdef = TROOPS[tId] || SUPER_TROOPS[tId];
      if (tdef) unlockPreview.push(`${tdef.icon}${tdef.name}`);
    }
  }
  if (tech.unlocks.wonders) {
    unlockPreview.push(`🌟奇观×${tech.unlocks.wonders.length}`);
  }

  return (
    <motion.div
      className={`game-panel ${
        researched
          ? 'border-green-500/40'
          : available
            ? 'border-royal-500/50'
            : 'opacity-60'
      }`}
      whileHover={available ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className={`text-3xl ${locked ? 'grayscale' : ''}`}>{tech.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{tech.name}</span>
            {researched && <span className="text-green-400 text-sm">✓ 已研究</span>}
            {isCurrent && <span className="text-blue-400 text-sm">研究中</span>}
          </div>
          <p className="text-xs text-ancient-400 mt-1">{tech.description}</p>
        </div>
      </div>

      {/* 成本与前置 */}
      <div className="text-xs space-y-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-ancient-400">成本:</span>
          <span className={canAfford ? 'text-blue-400' : 'text-red-400'}>
            📜 {formatNumber(tech.cost)}
          </span>
        </div>
        {tech.prerequisites.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-ancient-400">前置:</span>
            {tech.prerequisites.map((p) => {
              const ptech = TECHS[p];
              const done = researchedTechs.includes(p);
              return (
                <span key={p} className={done ? 'text-green-400' : 'text-red-400'}>
                  {ptech?.name || p}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 解锁预览 */}
      {unlockPreview.length > 0 && (
        <div className="text-xs mb-3">
          <span className="text-ancient-400">解锁: </span>
          <span className="text-royal-300">{unlockPreview.join(' ')}</span>
        </div>
      )}

      {/* 研究按钮 */}
      {!researched && !isCurrent && (
        <motion.button
          className="game-button game-button-primary w-full text-sm"
          onClick={onResearch}
          disabled={!available || !canAfford}
          whileTap={{ scale: 0.95 }}
        >
          {locked ? '前置未满足' : canAfford ? '开始研究' : '知识不足'}
        </motion.button>
      )}
    </motion.div>
  );
}
