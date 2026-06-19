import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TERRITORIES } from '@/game/data/territories';
import { getCivilization } from '@/game/data/civilizations';
import {
  conquerTerritory,
  modifyTerritory,
  absorbCivilization,
} from '@/game/systems/territorySystem';
import { getTroopDef } from '@/game/systems/troopSystem';
import { RESOURCE_INFO, RARE_RESOURCE_INFO } from '@/utils/constants';
import { formatNumber } from '@/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  TerritoryDef,
  TerritoryDimension,
  TroopClass,
  ResourceState,
  ResourceType,
  RareResourceType,
} from '@/game/types';

// 维度信息
const DIMENSION_INFO: Record<TerritoryDimension, { label: string; icon: string }> = {
  surface: { label: '地表', icon: '🌍' },
  underground: { label: '地下', icon: '🕳️' },
  sky: { label: '天空', icon: '☁️' },
  ocean: { label: '海洋', icon: '🌊' },
  space: { label: '太空', icon: '🪐' },
};

// 维度显示顺序
const DIMENSION_ORDER: TerritoryDimension[] = ['surface', 'ocean', 'underground', 'sky', 'space'];

// 领地类型名称
const TERRITORY_TYPE_NAMES: Record<string, string> = {
  plain: '平原',
  forest: '森林',
  mountain: '山地',
  desert: '沙漠',
  ocean: '海洋',
  sky: '天空',
  underground: '地下',
  space: '太空',
};

// 兵种类别名称
const TROOP_CLASS_NAMES: Record<TroopClass, string> = {
  infantry: '步兵',
  archer: '弓兵',
  cavalry: '骑兵',
  siege: '攻城',
  myth: '神话',
  future: '未来',
  commander: '指挥官',
  hidden: '隐藏',
};

// 获取资源图标（兼容普通与稀有资源）
function getResourceIcon(res: string): string {
  return (
    RESOURCE_INFO[res as ResourceType]?.icon ||
    RARE_RESOURCE_INFO[res as RareResourceType]?.icon ||
    '❓'
  );
}

export function WorldMapPanel() {
  const territories = useGameStore((state) => state.territories);
  const troops = useGameStore((state) => state.troops);
  const eraImprints = useGameStore((state) => state.eraImprints);
  const hasResources = useGameStore((state) => state.hasResources);

  const allTerritories = Object.values(TERRITORIES);
  const ownedCount = territories.filter((t) => t.owned).length;
  const totalCount = allTerritories.length;

  // 获取领地状态
  const getTerritoryState = (defId: string) =>
    territories.find((t) => t.defId === defId);

  // 按维度分组
  const territoriesByDimension = DIMENSION_ORDER.map((dim) => ({
    dimension: dim,
    info: DIMENSION_INFO[dim],
    territories: allTerritories.filter((t) => t.dimension === dim),
  })).filter((group) => group.territories.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">世界地图</h2>
        <p className="text-ancient-400 text-sm">征服领地，扩张你的帝国版图</p>
      </div>

      {/* 领地总览 */}
      <div className="game-panel">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-ancient-400">已拥有领地</div>
            <div className="text-xl font-mono text-green-400">
              {ownedCount} / {totalCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">可征服领地</div>
            <div className="text-xl font-mono text-war-300">
              {totalCount - ownedCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">文明遗产</div>
            <div className="text-xl font-mono text-royal-300">
              {eraImprints.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">可用兵力</div>
            <div className="text-xl font-mono text-blue-400">
              {formatNumber(troops.reduce((sum, t) => sum + t.count, 0))}
            </div>
          </div>
        </div>
      </div>

      {/* 按维度分组显示领地 */}
      {territoriesByDimension.map((group) => (
        <div key={group.dimension}>
          <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
            <span>{group.info.icon}</span> {group.info.label}维度
            <span className="text-xs text-ancient-500">
              ({group.territories.filter((t) => getTerritoryState(t.id)?.owned).length}/
              {group.territories.length})
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.territories.map((territory) => {
              const state = getTerritoryState(territory.id);
              const owned = state?.owned ?? false;
              return (
                <TerritoryCard
                  key={territory.id}
                  territory={territory}
                  owned={owned}
                  modification={state?.modification}
                  hasResources={hasResources}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TerritoryCardProps {
  territory: TerritoryDef;
  owned: boolean;
  modification?: string;
  hasResources: (cost: Partial<ResourceState>) => boolean;
}

function TerritoryCard({
  territory,
  owned,
  modification,
  hasResources,
}: TerritoryCardProps) {
  const troops = useGameStore((state) => state.troops);
  const eraImprints = useGameStore((state) => state.eraImprints);
  const [showConquer, setShowConquer] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [deployed, setDeployed] = useState<Record<string, number>>({});

  const civDef = territory.rewards.civilization
    ? getCivilization(territory.rewards.civilization)
    : undefined;
  const civAbsorbed = territory.rewards.civilization
    ? eraImprints.includes(territory.rewards.civilization)
    : false;

  // 当前改造
  const currentModification = modification
    ? territory.modifications?.find((m) => m.id === modification)
    : undefined;

  const handleConquer = () => {
    const deployedTroops = Object.entries(deployed)
      .filter(([_, count]) => count > 0)
      .map(([defId, count]) => ({ defId, count }));
    const success = conquerTerritory(territory.id, deployedTroops);
    if (success) {
      setShowConquer(false);
      setDeployed({});
    }
  };

  const handleAbsorb = () => {
    if (territory.rewards.civilization) {
      absorbCivilization(territory.rewards.civilization);
    }
  };

  const handleModify = (modificationId: string) => {
    const success = modifyTerritory(territory.id, modificationId);
    if (success) {
      setShowModify(false);
    }
  };

  // 设置派遣数量
  const setDeployCount = (defId: string, count: number) => {
    const troopState = troops.find((t) => t.defId === defId);
    const max = troopState?.count ?? 0;
    setDeployed((prev) => ({
      ...prev,
      [defId]: Math.max(0, Math.min(max, count)),
    }));
  };

  return (
    <motion.div
      className={`game-panel ${owned ? 'border-green-600/40' : ''}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* 头部 */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">
          {owned ? '🏰' : '🗺️'}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{territory.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-ancient-300">
              {TERRITORY_TYPE_NAMES[territory.type] || territory.type}
            </span>
          </div>
          <p className="text-xs text-ancient-400 mt-1">{territory.description}</p>
        </div>
      </div>

      {/* 守军 */}
      <div className="mb-2 text-xs">
        <span className="text-ancient-400">守军: </span>
        {territory.defender.map((d, i) => (
          <span key={i} className="text-war-300 mr-2">
            {TROOP_CLASS_NAMES[d.class]} ×{formatNumber(d.count)}
          </span>
        ))}
      </div>

      {/* 奖励 */}
      <div className="mb-2 text-xs">
        <span className="text-ancient-400">征服奖励: </span>
        {territory.rewards.resources &&
          Object.entries(territory.rewards.resources).map(([res, amount]) => (
            <span key={res} className="text-green-400 mr-2">
              {getResourceIcon(res)}
              {formatNumber(amount as number)}
            </span>
          ))}
      </div>

      {/* 持续加成 */}
      {territory.rewards.bonus && (
        <div className="mb-2 text-xs">
          <span className="text-ancient-400">持续加成: </span>
          {Object.entries(territory.rewards.bonus).map(([res, amount]) => (
            <span key={res} className="text-royal-300 mr-2">
              {getResourceIcon(res)}+{formatNumber(amount as number)}/秒
            </span>
          ))}
        </div>
      )}

      {/* 文明遗产提示 */}
      {civDef && (
        <div
          className={`mb-2 text-xs px-2 py-1 rounded border ${
            civAbsorbed
              ? 'bg-green-900/30 border-green-600/40 text-green-300'
              : 'bg-royal-900/30 border-royal-600/40 text-royal-300'
          }`}
        >
          <span>
            {civDef.icon} 文明遗产: {civDef.name}
            {civAbsorbed ? ' ✓已吸收' : ' - 可吸收传承'}
          </span>
        </div>
      )}

      {/* 当前改造显示 */}
      {currentModification && (
        <div className="mb-2 text-xs px-2 py-1 rounded bg-ancient-900/40 border border-ancient-700/40">
          <span className="text-ancient-400">已改造: </span>
          <span className="text-blue-300">{currentModification.name}</span>
          {Object.entries(currentModification.resultBonus).map(([res, amount]) => (
            <span key={res} className="text-royal-300 ml-2">
              {getResourceIcon(res)}+{formatNumber(amount as number)}
            </span>
          ))}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2 mt-3">
        {!owned ? (
          <motion.button
            className="game-button game-button-danger flex-1 text-sm"
            onClick={() => setShowConquer((v) => !v)}
            whileTap={{ scale: 0.95 }}
          >
            ⚔️ 征服
          </motion.button>
        ) : (
          <>
            {!currentModification && territory.modifications && territory.modifications.length > 0 && (
              <motion.button
                className="game-button flex-1 text-sm"
                onClick={() => setShowModify((v) => !v)}
                whileTap={{ scale: 0.95 }}
              >
                🔧 改造
              </motion.button>
            )}
            {civDef && !civAbsorbed && (
              <motion.button
                className="game-button game-button-primary flex-1 text-sm"
                onClick={handleAbsorb}
                whileTap={{ scale: 0.95 }}
              >
                {civDef.icon} 吸收遗产
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* 征服界面 */}
      <AnimatePresence>
        {showConquer && !owned && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden border-t border-ancient-700/40 pt-3"
          >
            <div className="text-xs text-ancient-400 mb-2">派遣兵力（战力需达守军80%）:</div>
            {troops.length === 0 ? (
              <div className="text-xs text-war-300 py-2">暂无可用兵力，请先训练兵种</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {troops
                  .filter((t) => t.count > 0)
                  .map((troop) => {
                    const def = getTroopDef(troop.defId);
                    if (!def) return null;
                    const deployCount = deployed[troop.defId] || 0;
                    return (
                      <div
                        key={troop.defId}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="text-lg">{def.icon}</span>
                        <span className="flex-1 text-ancient-200">{def.name}</span>
                        <span className="text-ancient-500">
                          ({formatNumber(troop.count)})
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={troop.count}
                          value={deployCount}
                          onChange={(e) =>
                            setDeployCount(troop.defId, parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 bg-ancient-900 border border-ancient-700 rounded text-ancient-100 text-center"
                        />
                        <button
                          className="px-2 py-1 text-xs bg-ancient-700 hover:bg-ancient-600 rounded text-ancient-200"
                          onClick={() => setDeployCount(troop.defId, troop.count)}
                        >
                          全选
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button
                className="game-button flex-1 text-sm"
                onClick={() => {
                  setShowConquer(false);
                  setDeployed({});
                }}
              >
                取消
              </button>
              <motion.button
                className="game-button game-button-danger flex-1 text-sm"
                onClick={handleConquer}
                disabled={
                  Object.values(deployed).reduce((a, b) => a + b, 0) === 0
                }
                whileTap={{ scale: 0.95 }}
              >
                发起征服
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 改造界面 */}
      <AnimatePresence>
        {showModify && owned && !currentModification && territory.modifications && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden border-t border-ancient-700/40 pt-3 space-y-2"
          >
            {territory.modifications.map((mod) => {
              const canAfford = hasResources(mod.cost);
              return (
                <div
                  key={mod.id}
                  className="bg-ancient-900/40 rounded p-2 border border-ancient-700/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-ancient-100">{mod.name}</span>
                    <button
                      className="game-button game-button-primary text-xs px-2 py-1"
                      onClick={() => handleModify(mod.id)}
                      disabled={!canAfford}
                    >
                      改造
                    </button>
                  </div>
                  <div className="text-xs text-ancient-400 mb-1">
                    成本:{' '}
                    {Object.entries(mod.cost).map(([res, amount]) => (
                      <span key={res} className="mr-1">
                        {getResourceIcon(res)}
                        {formatNumber(amount as number)}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-royal-300">
                    加成:{' '}
                    {Object.entries(mod.resultBonus).map(([res, amount]) => (
                      <span key={res} className="mr-1">
                        {getResourceIcon(res)}+{formatNumber(amount as number)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
