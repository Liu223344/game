import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { BUILDINGS, getBuildingCost, getBuildingProduction } from '@/game/data/buildings';
import { RESOURCE_INFO } from '@/utils/constants';
import { formatNumber } from '@/utils/format';
import { motion } from 'framer-motion';
import type { BuildingDef, BuildingType, ResourceState } from '@/game/types';

export function BuildingsPanel() {
  const buildings = useGameStore((state) => state.buildings);
  const researchedTechs = useGameStore((state) => state.tech.researched);
  const upgradeBuilding = useGameStore((state) => state.upgradeBuilding);
  const toggleBuilding = useGameStore((state) => state.toggleBuilding);
  const hasResources = useGameStore((state) => state.hasResources);
  const addNotification = useUIStore((state) => state.addNotification);

  const handleUpgrade = (type: BuildingType) => {
    const building = BUILDINGS[type];
    const currentLevel = buildings[type].level;
    const cost = getBuildingCost(building, currentLevel);

    if (!hasResources(cost as Partial<ResourceState>)) {
      addNotification({ type: 'warning', message: '资源不足，无法升级' });
      return;
    }

    // 扣除资源
    for (const [res, amount] of Object.entries(cost)) {
      useGameStore.getState().spendResource(res as keyof ResourceState, amount as number);
    }

    upgradeBuilding(type);
    addNotification({ type: 'success', message: `${building.name} 升级到 ${currentLevel + 1} 级` });
  };

  const handleToggle = (type: BuildingType) => {
    toggleBuilding(type);
    const building = BUILDINGS[type];
    const isActive = buildings[type].isActive;
    addNotification({
      type: 'info',
      message: `${building.name} ${isActive ? '已暂停' : '已激活'}`,
    });
  };

  const isUnlocked = (building: BuildingDef) => {
    if (!building.unlockTech) return true;
    return researchedTechs.includes(building.unlockTech);
  };

  const resourceBuildings = Object.values(BUILDINGS).filter((b) => b.category === 'resource');
  const militaryBuildings = Object.values(BUILDINGS).filter((b) => b.category === 'military');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">建筑</h2>
        <p className="text-ancient-400 text-sm">建造和升级建筑，自动产出资源与兵种</p>
      </div>

      {/* 资源建筑 */}
      <div>
        <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
          <span>📦</span> 资源建筑
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {resourceBuildings.map((building) => {
            const state = buildings[building.id as BuildingType];
            const unlocked = isUnlocked(building);
            const cost = getBuildingCost(building, state.level);
            const canAfford = hasResources(cost as Partial<ResourceState>);
            const production = getBuildingProduction(building, state.level);

            if (!unlocked) {
              return (
                <div key={building.id} className="game-panel opacity-50">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl grayscale">🔒</span>
                    <div>
                      <div className="font-semibold text-ancient-300">{building.name}</div>
                      <div className="text-xs text-ancient-400">需要科技: {building.unlockTech}</div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <BuildingCard
                key={building.id}
                building={building}
                level={state.level}
                isActive={state.isActive}
                production={production}
                cost={cost}
                canAfford={canAfford}
                onUpgrade={() => handleUpgrade(building.id as BuildingType)}
                onToggle={() => handleToggle(building.id as BuildingType)}
              />
            );
          })}
        </div>
      </div>

      {/* 军事建筑 */}
      <div>
        <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
          <span>⚔️</span> 军事建筑
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {militaryBuildings.map((building) => {
            const state = buildings[building.id as BuildingType];
            const unlocked = isUnlocked(building);
            const cost = getBuildingCost(building, state.level);
            const canAfford = hasResources(cost as Partial<ResourceState>);

            if (!unlocked) {
              return (
                <div key={building.id} className="game-panel opacity-50">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl grayscale">🔒</span>
                    <div>
                      <div className="font-semibold text-ancient-300">{building.name}</div>
                      <div className="text-xs text-ancient-400">需要科技: {building.unlockTech}</div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <BuildingCard
                key={building.id}
                building={building}
                level={state.level}
                isActive={state.isActive}
                production={0}
                cost={cost}
                canAfford={canAfford}
                onUpgrade={() => handleUpgrade(building.id as BuildingType)}
                onToggle={() => handleToggle(building.id as BuildingType)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface BuildingCardProps {
  building: BuildingDef;
  level: number;
  isActive: boolean;
  production: number;
  cost: Partial<Record<string, number>>;
  canAfford: boolean;
  onUpgrade: () => void;
  onToggle: () => void;
}

function BuildingCard({
  building,
  level,
  isActive,
  production,
  cost,
  canAfford,
  onUpgrade,
  onToggle,
}: BuildingCardProps) {
  return (
    <motion.div
      className={`game-panel ${!isActive ? 'opacity-60' : ''}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{building.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{building.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-royal-300">Lv.{level}</span>
          </div>
          <p className="text-xs text-ancient-400 mt-1">{building.description}</p>
        </div>
      </div>

      {production > 0 && (
        <div className="mb-3 text-sm">
          <span className="text-ancient-400">产量: </span>
          <span className="text-green-400 font-mono">
            +{formatNumber(production)}/秒 {RESOURCE_INFO[building.produces!].icon}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="game-button game-button-primary flex-1 text-sm"
          onClick={onUpgrade}
          disabled={!canAfford}
        >
          <div className="flex flex-col items-center">
            <span>升级到 Lv.{level + 1}</span>
            <span className="text-xs opacity-80">
              {Object.entries(cost).map(([res, amount]) => (
                <span key={res} className="mr-1">
                  {RESOURCE_INFO[res as keyof typeof RESOURCE_INFO]?.icon}
                  {formatNumber(amount as number)}
                </span>
              ))}
            </span>
          </div>
        </button>
        <button
          className={`game-button text-sm ${isActive ? '' : 'game-button-primary'}`}
          onClick={onToggle}
          aria-label={isActive ? '暂停生产' : '开始生产'}
        >
          {isActive ? '⏸️' : '▶️'}
        </button>
      </div>
    </motion.div>
  );
}
