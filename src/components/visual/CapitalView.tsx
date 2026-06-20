import { useGameStore } from '@/store/gameStore';
import { getCurrentEra } from '@/game/systems/techSystem';
import { motion } from 'framer-motion';
import { ERA_NAMES } from '@/utils/constants';

// 首都可视化组件 - 根据时代显示不同的首都外观
export function CapitalView() {
  const researchedTechs = useGameStore((state) => state.tech.researched);
  const era = getCurrentEra();
  const eraIndex = ERA_NAMES.indexOf(era);

  // 根据时代选择首都图标和描述
  const capitalStages = [
    { icon: '🛖', name: '茅草部落', desc: '简陋的石器时代聚落' },
    { icon: '🏘️', name: '青铜村落', desc: '青铜工具带来的进步' },
    { icon: '🏰', name: '铁器城堡', desc: '铁器时代的防御要塞' },
    { icon: '🏯', name: '火药要塞', desc: '火药改变战争形态' },
    { icon: '🏭', name: '工业城市', desc: '蒸汽驱动的工业中心' },
    { icon: '🏙️', name: '现代都市', desc: '电力照亮的城市' },
    { icon: '🌆', name: '核能大都会', desc: '核能驱动的超级都市' },
    { icon: '🌃', name: '信息都市', desc: '数字化的智慧城市' },
    { icon: '🚀', name: '太空港', desc: '通往星辰的门户' },
    { icon: '🌌', name: '未来都市', desc: '超越想象的未来文明' },
    { icon: '✨', name: '因果圣殿', desc: '操控因果的终极文明' },
  ];

  const stage = capitalStages[Math.max(0, Math.min(eraIndex, capitalStages.length - 1))];

  return (
    <div className="game-panel flex items-center gap-4">
      <motion.div
        key={stage.icon}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl"
      >
        {stage.icon}
      </motion.div>
      <div>
        <div className="text-royal-300 font-display text-lg">{stage.name}</div>
        <div className="text-ancient-400 text-sm">{stage.desc}</div>
        <div className="text-ancient-400 text-xs mt-1">时代: {era} | 科技: {researchedTechs.length}</div>
      </div>
    </div>
  );
}
