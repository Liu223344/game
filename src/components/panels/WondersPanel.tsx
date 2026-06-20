import { useGameStore } from '@/store/gameStore';
import { WONDERS, getWonder, getSynergyPartner } from '@/game/data/wonders';
import { TECHS } from '@/game/data/techs';
import { startWonderConstruction, checkSynergy } from '@/game/systems/wonderSystem';
import { RESOURCE_INFO, RARE_RESOURCE_INFO } from '@/utils/constants';
import { formatNumber, formatTime } from '@/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  WonderDef,
  WonderState,
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

export function WondersPanel() {
  const wonders = useGameStore((state) => state.wonders);
  const researchedTechs = useGameStore((state) => state.tech.researched);
  const hasResources = useGameStore((state) => state.hasResources);

  const allWonders = Object.values(WONDERS);
  const builtCount = wonders.filter((w) => w.built).length;
  const totalCount = allWonders.length;

  // 获取奇观状态
  const getWonderState = (defId: string): WonderState | undefined =>
    wonders.find((w) => w.defId === defId);

  // 检查奇观是否已解锁（科技）
  const isUnlocked = (wonder: WonderDef): boolean =>
    researchedTechs.includes(wonder.unlockTech);

  // 已激活的协同效应
  const activeSynergies = checkSynergy();

  // 分组：已建造 / 建造中 / 可建造 / 未解锁
  const builtWonders = allWonders.filter((w) => getWonderState(w.id)?.built);
  const constructingWonders = allWonders.filter(
    (w) => {
      const state = getWonderState(w.id);
      return state && !state.built;
    }
  );
  const buildableWonders = allWonders.filter((w) => {
    const state = getWonderState(w.id);
    return !state && isUnlocked(w);
  });
  const lockedWonders = allWonders.filter((w) => !isUnlocked(w));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">奇观</h2>
        <p className="text-ancient-400 text-sm">建造世界奇观，获得永恒加成</p>
      </div>

      {/* 奇观总览 */}
      <div className="game-panel">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-ancient-400">已建造奇观</div>
            <div className="text-xl font-mono text-green-400">
              {builtCount} / {totalCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">建造中</div>
            <div className="text-xl font-mono text-blue-400">
              {constructingWonders.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">可建造</div>
            <div className="text-xl font-mono text-royal-300">
              {buildableWonders.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">激活协同</div>
            <div className="text-xl font-mono text-purple-300">
              {activeSynergies.length}
            </div>
          </div>
        </div>
      </div>

      {/* 协同效应展示 */}
      {activeSynergies.length > 0 && (
        <div className="game-panel border-purple-600/40">
          <h3 className="text-sm font-display text-purple-300 mb-2 flex items-center gap-2">
            <span>✨</span> 激活的协同效应
          </h3>
          <div className="space-y-2">
            {activeSynergies.map((synergy, i) => {
              const wonder = getWonder(synergy.wonderId);
              const partner = getWonder(synergy.partnerId);
              return (
                <div
                  key={i}
                  className="text-xs bg-purple-900/20 border border-purple-700/40 rounded px-3 py-2"
                >
                  <div className="text-purple-200 font-semibold">
                    {wonder?.icon} {wonder?.name} ⟷ {partner?.icon} {partner?.name}
                  </div>
                  <div className="text-purple-300 mt-1">{synergy.effect}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 建造中奇观 */}
      {constructingWonders.length > 0 && (
        <div>
          <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
            <span>🔨</span> 建造中
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {constructingWonders.map((wonder) => (
              <WonderCard
                key={wonder.id}
                wonder={wonder}
                state={getWonderState(wonder.id)}
                hasResources={hasResources}
                isUnlocked={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 已建造奇观 */}
      {builtWonders.length > 0 && (
        <div>
          <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
            <span>🏛️</span> 已建造
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {builtWonders.map((wonder) => (
              <WonderCard
                key={wonder.id}
                wonder={wonder}
                state={getWonderState(wonder.id)}
                hasResources={hasResources}
                isUnlocked={true}
                synergyActive={activeSynergies.some(
                  (s) => s.wonderId === wonder.id || s.partnerId === wonder.id
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* 可建造奇观 */}
      {buildableWonders.length > 0 && (
        <div>
          <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
            <span>📋</span> 可建造
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {buildableWonders.map((wonder) => (
              <WonderCard
                key={wonder.id}
                wonder={wonder}
                state={undefined}
                hasResources={hasResources}
                isUnlocked={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 未解锁奇观 */}
      {lockedWonders.length > 0 && (
        <div>
          <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
            <span>🔒</span> 未解锁
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedWonders.map((wonder) => (
              <WonderCard
                key={wonder.id}
                wonder={wonder}
                state={undefined}
                hasResources={hasResources}
                isUnlocked={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface WonderCardProps {
  wonder: WonderDef;
  state?: WonderState;
  hasResources: (cost: Partial<ResourceState>) => boolean;
  isUnlocked: boolean;
  synergyActive?: boolean;
}

function WonderCard({
  wonder,
  state,
  hasResources,
  isUnlocked,
  synergyActive,
}: WonderCardProps) {
  const isBuilt = state?.built ?? false;
  const isConstructing = state && !state.built;
  const canAfford = hasResources(wonder.cost);
  const synergyPartner = wonder.synergyWith ? getSynergyPartner(wonder.id) : undefined;
  const techName = TECHS[wonder.unlockTech]?.name || wonder.unlockTech;

  const handleBuild = () => {
    startWonderConstruction(wonder.id);
  };

  // 未解锁状态
  if (!isUnlocked) {
    return (
      <div className="game-panel opacity-50">
        <div className="flex items-center gap-3">
          <span className="text-3xl grayscale">🔒</span>
          <div className="flex-1">
            <div className="font-semibold text-ancient-300">{wonder.name}</div>
            <div className="text-xs text-ancient-500">需要科技: {techName}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`game-panel ${
        isBuilt
          ? 'border-green-600/40'
          : isConstructing
          ? 'border-blue-600/40'
          : ''
      } ${synergyActive ? 'ring-1 ring-purple-500/40' : ''}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* 头部 */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">{wonder.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{wonder.name}</span>
            {isBuilt && (
              <span className="text-xs px-2 py-0.5 rounded bg-green-900/40 text-green-300 border border-green-700/40">
                ✓ 已完成
              </span>
            )}
            {isConstructing && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40">
                建造中
              </span>
            )}
          </div>
          <p className="text-xs text-ancient-400 mt-1">{wonder.description}</p>
        </div>
      </div>

      {/* 效果 */}
      <div className="mb-2 text-xs">
        <span className="text-ancient-400">效果: </span>
        <span className="text-royal-300">{wonder.effect}</span>
      </div>

      {/* 协同效应提示 */}
      {synergyPartner && wonder.synergyEffect && (
        <div
          className={`mb-2 text-xs px-2 py-1 rounded border ${
            synergyActive
              ? 'bg-purple-900/30 border-purple-600/40 text-purple-200'
              : 'bg-ancient-900/40 border-ancient-700/40 text-ancient-400'
          }`}
        >
          <span>
            {synergyActive ? '✨ ' : '🔗 '}
            协同: {synergyPartner.icon} {synergyPartner.name}
          </span>
          <div className="mt-0.5 text-xs">{wonder.synergyEffect}</div>
        </div>
      )}

      {/* 建造进度 */}
      <AnimatePresence>
        {isConstructing && state && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ancient-400">建造进度</span>
              <span className="text-blue-400 font-mono">
                {formatTime(Math.max(0, wonder.buildTime * (1 - state.buildProgress)))} 剩余
              </span>
            </div>
            <ProgressBar
              value={state.buildProgress}
              color="blue"
              height="sm"
              showPercent
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成本与建造按钮（仅未建造时显示） */}
      {!isBuilt && !isConstructing && (
        <>
          <div className="text-xs text-ancient-400 mb-2 flex flex-wrap items-center gap-x-2">
            <span>成本:</span>
            {Object.entries(wonder.cost).map(([res, amount]) => (
              <span key={res}>
                {getResourceIcon(res)}
                {formatNumber(amount as number)}
              </span>
            ))}
            <span className="text-ancient-500">⏱ {formatTime(wonder.buildTime)}</span>
          </div>
          <motion.button
            className="game-button game-button-primary w-full text-sm"
            onClick={handleBuild}
            disabled={!canAfford}
            whileTap={{ scale: 0.95 }}
          >
            {canAfford ? '开始建造' : '资源不足'}
          </motion.button>
        </>
      )}

      {/* 已建造的效果加成展示 */}
      {isBuilt && typeof wonder.effectBonus === 'object' && (
        <div className="text-xs text-ancient-400">
          <span>当前加成: </span>
          {Object.entries(wonder.effectBonus).map(([res, amount]) => (
            <span key={res} className="text-green-400 mr-2">
              {getResourceIcon(res)}+{formatNumber(amount as number)}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
