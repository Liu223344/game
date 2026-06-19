import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TROOPS } from '@/game/data/troops';
import { SUPER_TROOPS } from '@/game/data/superTroops';
import { BUILDINGS } from '@/game/data/buildings';
import { TECHS } from '@/game/data/techs';
import { startTroopProduction } from '@/game/systems/troopSystem';
import { RESOURCE_INFO, RARE_RESOURCE_INFO } from '@/utils/constants';
import { formatNumber, formatTime } from '@/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  TroopDef,
  TroopState,
  BuildingType,
  ResourceState,
  ResourceType,
  RareResourceType,
} from '@/game/types';

// 获取资源图标（兼容普通与稀有资源）
function getResourceIcon(res: string): string {
  return (
    RESOURCE_INFO[res as ResourceType]?.icon ||
    RARE_RESOURCE_INFO[res as RareResourceType]?.icon ||
    '❓'
  );
}

// 稀有度样式
const RARITY_STYLES: Record<string, { label: string; className: string }> = {
  common: { label: '普通', className: 'text-gray-300' },
  rare: { label: '稀有', className: 'text-blue-300' },
  epic: { label: '史诗', className: 'text-purple-300' },
  legendary: { label: '传说', className: 'text-yellow-300' },
  mythic: { label: '神话', className: 'text-pink-300' },
};

// 兵种类别名称
const TROOP_CLASS_NAMES: Record<string, string> = {
  infantry: '步兵',
  archer: '弓兵',
  cavalry: '骑兵',
  siege: '攻城',
  myth: '神话',
  future: '未来',
  commander: '指挥官',
  hidden: '隐藏',
};

// 军事建筑显示顺序
const MILITARY_BUILDINGS: BuildingType[] = ['barracks', 'archeryRange', 'stable', 'workshop'];

export function TroopsPanel() {
  const troops = useGameStore((state) => state.troops);
  const researchedTechs = useGameStore((state) => state.tech.researched);

  const totalTroops = troops.reduce((sum, t) => sum + t.count, 0);
  const totalInProduction = troops.reduce((sum, t) => sum + t.inProduction, 0);

  const isUnlocked = (def: TroopDef): boolean => {
    if (!def.unlockTech) return true;
    return researchedTechs.includes(def.unlockTech);
  };

  const getTroopState = (defId: string): TroopState | undefined =>
    troops.find((t) => t.defId === defId);

  const allDefs = [...Object.values(TROOPS), ...Object.values(SUPER_TROOPS)];
  const unlockedCount = allDefs.filter(isUnlocked).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">兵营</h2>
        <p className="text-ancient-400 text-sm">训练和管理你的军队</p>
      </div>

      {/* 兵力总览 */}
      <div className="game-panel">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-ancient-400">现有兵力</div>
            <div className="text-xl font-mono text-green-400">{formatNumber(totalTroops)}</div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">生产中</div>
            <div className="text-xl font-mono text-blue-400">{formatNumber(totalInProduction)}</div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">已训兵种</div>
            <div className="text-xl font-mono text-royal-300">{troops.length}</div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">已解锁兵种</div>
            <div className="text-xl font-mono text-ancient-100">{unlockedCount}</div>
          </div>
        </div>
      </div>

      {/* 按建筑分组的普通兵种 */}
      {MILITARY_BUILDINGS.map((buildingType) => {
        const building = BUILDINGS[buildingType];
        const buildingTroops = Object.values(TROOPS).filter((t) => t.building === buildingType);
        if (buildingTroops.length === 0) return null;
        return (
          <div key={buildingType}>
            <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
              <span>{building.icon}</span> {building.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {buildingTroops.map((troop) => (
                <TroopCard
                  key={troop.id}
                  troop={troop}
                  unlocked={isUnlocked(troop)}
                  state={getTroopState(troop.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* 超级兵种 */}
      <div>
        <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
          <span>🌟</span> 超级兵种
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(SUPER_TROOPS).map((troop) => (
            <TroopCard
              key={troop.id}
              troop={troop}
              unlocked={isUnlocked(troop)}
              state={getTroopState(troop.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TroopCardProps {
  troop: TroopDef;
  unlocked: boolean;
  state?: TroopState;
}

function TroopCard({ troop, unlocked, state }: TroopCardProps) {
  const [quantity, setQuantity] = useState<1 | 10 | 100>(1);
  const resources = useGameStore((s) => s.resources);

  const canAfford = (() => {
    for (const [res, amount] of Object.entries(troop.cost)) {
      if (resources[res as keyof ResourceState] < (amount as number) * quantity) return false;
    }
    return true;
  })();

  const handleProduce = () => {
    startTroopProduction(troop.id, quantity);
  };

  if (!unlocked) {
    const techName = troop.unlockTech ? TECHS[troop.unlockTech]?.name : undefined;
    return (
      <div className="game-panel opacity-50">
        <div className="flex items-center gap-3">
          <span className="text-3xl grayscale">🔒</span>
          <div className="flex-1">
            <div className="font-semibold text-ancient-300">{troop.name}</div>
            <div className="text-xs text-ancient-500">
              需要科技: {techName || troop.unlockTech}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rarity = troop.rarity ? RARITY_STYLES[troop.rarity] : null;

  return (
    <motion.div
      className="game-panel"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">{troop.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{troop.name}</span>
            {rarity && (
              <span className={`text-xs px-2 py-0.5 rounded bg-ancient-700 ${rarity.className}`}>
                {rarity.label}
              </span>
            )}
          </div>
          <div className="text-xs text-ancient-500 mt-0.5">
            {TROOP_CLASS_NAMES[troop.class] || troop.class}
            {troop.isLegendary && <span className="ml-1 text-yellow-400">★传奇</span>}
          </div>
        </div>
      </div>

      <p className="text-xs text-ancient-400 mb-3">{troop.description}</p>

      {/* 属性 */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">攻击</div>
          <div className="text-red-400 font-mono">{formatNumber(troop.attack)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">防御</div>
          <div className="text-blue-400 font-mono">{formatNumber(troop.defense)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">生命</div>
          <div className="text-green-400 font-mono">{formatNumber(troop.hp)}</div>
        </div>
      </div>

      {/* 当前兵力与生产进度 */}
      <AnimatePresence>
        {state && (state.count > 0 || state.inProduction > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 text-xs space-y-1 overflow-hidden"
          >
            <div className="flex justify-between">
              <span className="text-ancient-400">已有数量</span>
              <span className="text-green-400 font-mono">{formatNumber(state.count)}</span>
            </div>
            {state.inProduction > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-ancient-400">
                    生产中: {formatNumber(state.inProduction)}
                  </span>
                  <span className="text-blue-400 font-mono">
                    {formatTime(troop.productionTime * (state.inProduction - state.productionProgress))}
                  </span>
                </div>
                <ProgressBar value={state.productionProgress} color="blue" height="sm" />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成本 */}
      <div className="text-xs text-ancient-400 mb-2 flex flex-wrap items-center gap-x-2">
        <span>成本:</span>
        {Object.entries(troop.cost).map(([res, amount]) => (
          <span key={res}>
            {getResourceIcon(res)}
            {formatNumber(amount as number)}
          </span>
        ))}
        <span className="text-ancient-500">⏱ {formatTime(troop.productionTime)}</span>
      </div>

      {/* 数量选择 + 生产按钮 */}
      <div className="flex gap-2">
        <div className="flex rounded overflow-hidden border border-ancient-700">
          {([1, 10, 100] as const).map((q) => (
            <button
              key={q}
              className={`px-3 py-1 text-xs ${
                quantity === q
                  ? 'bg-royal-600 text-white'
                  : 'bg-ancient-800 text-ancient-300 hover:bg-ancient-700'
              }`}
              onClick={() => setQuantity(q)}
            >
              ×{q}
            </button>
          ))}
        </div>
        <motion.button
          className="game-button game-button-primary flex-1 text-sm"
          onClick={handleProduce}
          disabled={!canAfford}
          whileTap={{ scale: 0.95 }}
        >
          训练 {quantity} 个
        </motion.button>
      </div>
    </motion.div>
  );
}
