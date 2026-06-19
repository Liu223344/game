import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CIVILIZATIONS, getCivilization } from '@/game/data/civilizations';
import {
  REBIRTH_UPGRADES,
  getRebirthUpgradeCost,
} from '@/game/data/rebirthUpgrades';
import {
  performRebirth,
  purchaseRebirthUpgrade,
  getRebirthProgress,
  getRebirthBonus,
} from '@/game/systems/rebirthSystem';
import { RESOURCE_INFO } from '@/utils/constants';
import { formatNumber } from '@/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  CivilizationType,
  RebirthUpgradeDef,
  ResourceType,
} from '@/game/types';

// 升级类别信息
const CATEGORY_INFO: Record<
  RebirthUpgradeDef['category'],
  { label: string; icon: string }
> = {
  military: { label: '军事', icon: '⚔️' },
  economy: { label: '经济', icon: '💰' },
  tech: { label: '科技', icon: '🔬' },
  expansion: { label: '扩张', icon: '🗺️' },
};

// 类别显示顺序
const CATEGORY_ORDER: RebirthUpgradeDef['category'][] = [
  'military',
  'economy',
  'tech',
  'expansion',
];

export function RebirthPanel() {
  const rebirth = useGameStore((state) => state.rebirth);
  const [showCivSelect, setShowCivSelect] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<RebirthUpgradeDef['category']>('military');

  const progress = getRebirthProgress();
  const rebirthBonus = getRebirthBonus();
  const currentCiv = rebirth.civilization
    ? getCivilization(rebirth.civilization)
    : undefined;

  // 按类别获取升级
  const upgradesByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    info: CATEGORY_INFO[cat],
    upgrades: Object.values(REBIRTH_UPGRADES).filter((u) => u.category === cat),
  }));

  const handleRebirth = (civId: CivilizationType) => {
    const success = performRebirth(civId);
    if (success) {
      setShowCivSelect(false);
    }
  };

  // 当前类别的升级
  const currentCategoryUpgrades = upgradesByCategory.find(
    (g) => g.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">转生</h2>
        <p className="text-ancient-400 text-sm">转生重置进度，获得永久加成</p>
      </div>

      {/* 转生总览 */}
      <div className="game-panel">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-4">
          <div>
            <div className="text-xs text-ancient-400">转生货币</div>
            <div className="text-xl font-mono text-royal-300">
              💎 {formatNumber(rebirth.currency)}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">转生次数</div>
            <div className="text-xl font-mono text-blue-400">
              {rebirth.totalRebirths}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">当前文明</div>
            <div className="text-xl font-mono text-green-400">
              {currentCiv ? `${currentCiv.icon} ${currentCiv.name}` : '无'}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">已购升级</div>
            <div className="text-xl font-mono text-purple-300">
              {rebirth.upgrades.length}
            </div>
          </div>
        </div>

        {/* 转生进度条 */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ancient-400">转生进度</span>
            <span className="text-ancient-300">
              {formatNumber(progress.currentScore)} / {formatNumber(progress.threshold)}
            </span>
          </div>
          <ProgressBar
            value={progress.currentScore}
            max={progress.threshold}
            color={progress.canRebirth ? 'green' : 'gold'}
            height="md"
            showPercent
          />
        </div>

        {/* 转生按钮 */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-ancient-400">
            {progress.canRebirth
              ? `已满足转生条件，可获得 ${formatNumber(progress.potentialCurrency)} 转生货币`
              : `还需 ${formatNumber(progress.threshold - progress.currentScore)} 进度方可转生`}
          </div>
          <motion.button
            className={`game-button text-sm ${
              progress.canRebirth ? 'game-button-primary' : ''
            }`}
            onClick={() => setShowCivSelect(true)}
            disabled={!progress.canRebirth}
            whileTap={{ scale: 0.95 }}
          >
            ♻️ 执行转生
          </motion.button>
        </div>
      </div>

      {/* 当前文明加成 */}
      {currentCiv && (
        <div className="game-panel">
          <h3 className="text-sm font-display text-royal-300 mb-2 flex items-center gap-2">
            <span>{currentCiv.icon}</span> 当前文明加成 - {currentCiv.name}
          </h3>
          <p className="text-xs text-ancient-400 mb-2">{currentCiv.description}</p>
          <div className="space-y-1">
            {currentCiv.bonuses.map((bonus, i) => (
              <div key={i} className="text-xs text-ancient-200 flex items-start gap-2">
                <span className="text-royal-300">•</span>
                <span>{bonus.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 转生加成总和 */}
      {Object.keys(rebirthBonus).length > 0 && (
        <div className="game-panel">
          <h3 className="text-sm font-display text-green-300 mb-2 flex items-center gap-2">
            <span>📊</span> 转生加成总和
          </h3>
          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(rebirthBonus).map(([res, amount]) => (
              <span key={res} className="text-green-400">
                {RESOURCE_INFO[res as ResourceType]?.icon}{' '}
                {RESOURCE_INFO[res as ResourceType]?.name} +{formatNumber(amount)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 转生升级商店 */}
      <div>
        <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
          <span>🛒</span> 转生升级商店
        </h3>

        {/* 类别切换 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {CATEGORY_ORDER.map((cat) => {
            const info = CATEGORY_INFO[cat];
            const count = Object.values(REBIRTH_UPGRADES).filter(
              (u) => u.category === cat
            ).length;
            return (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-royal-600 text-royal-50 border border-royal-400/50'
                    : 'bg-ancient-700 text-ancient-200 hover:bg-ancient-600 border border-ancient-600/40'
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {info.icon} {info.label} ({count})
              </button>
            );
          })}
        </div>

        {/* 当前类别的升级列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentCategoryUpgrades?.upgrades.map((upgrade) => (
            <RebirthUpgradeCard key={upgrade.id} upgrade={upgrade} />
          ))}
        </div>
      </div>

      {/* 文明选择界面 */}
      <AnimatePresence>
        {showCivSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCivSelect(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-ancient-800 border border-royal-600/40 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-display text-royal-300 mb-2">
                选择文明特质
              </h3>
              <p className="text-xs text-ancient-400 mb-4">
                转生后将加入所选文明，获得其独特加成。此选择不可更改，直到下次转生。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(CIVILIZATIONS).map((civ) => (
                  <motion.div
                    key={civ.id}
                    className="game-panel cursor-pointer hover:border-royal-400/60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRebirth(civ.id as CivilizationType)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{civ.icon}</span>
                      <div>
                        <div className="font-semibold text-ancient-100">{civ.name}</div>
                      </div>
                    </div>
                    <p className="text-xs text-ancient-400 mb-2">{civ.description}</p>
                    <div className="space-y-1">
                      {civ.bonuses.map((bonus, i) => (
                        <div
                          key={i}
                          className="text-xs text-royal-300 flex items-start gap-1"
                        >
                          <span>•</span>
                          <span>{bonus.description}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                className="game-button w-full mt-4 text-sm"
                onClick={() => setShowCivSelect(false)}
              >
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RebirthUpgradeCardProps {
  upgrade: RebirthUpgradeDef;
}

function RebirthUpgradeCard({ upgrade }: RebirthUpgradeCardProps) {
  const rebirth = useGameStore((state) => state.rebirth);

  const existing = rebirth.upgrades.find((u) => u.id === upgrade.id);
  const currentLevel = existing?.level || 0;
  const isMaxed = currentLevel >= upgrade.maxLevel;
  const cost = getRebirthUpgradeCost(upgrade, currentLevel);
  const canAfford = rebirth.currency >= cost;

  const handlePurchase = () => {
    purchaseRebirthUpgrade(upgrade.id);
  };

  return (
    <motion.div
      className="game-panel"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-semibold text-ancient-100">{upgrade.name}</div>
          <p className="text-xs text-ancient-400 mt-1">{upgrade.description}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-royal-300 whitespace-nowrap">
          {currentLevel} / {upgrade.maxLevel}
        </span>
      </div>

      {/* 效果 */}
      <div className="text-xs text-royal-300 mb-2">{upgrade.effect}</div>

      {/* 等级进度条 */}
      <div className="mb-3">
        <ProgressBar
          value={currentLevel}
          max={upgrade.maxLevel}
          color={isMaxed ? 'green' : 'gold'}
          height="sm"
        />
      </div>

      {/* 购买按钮 */}
      <motion.button
        className={`game-button w-full text-sm ${
          isMaxed ? '' : canAfford ? 'game-button-primary' : ''
        }`}
        onClick={handlePurchase}
        disabled={isMaxed || !canAfford}
        whileTap={{ scale: 0.95 }}
      >
        {isMaxed ? (
          '已满级'
        ) : (
          <span className="flex items-center justify-center gap-1">
            升级到 Lv.{currentLevel + 1}
            <span className="text-xs opacity-80">💎 {formatNumber(cost)}</span>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
