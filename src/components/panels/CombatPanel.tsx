import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { ENEMIES } from '@/game/data/enemies';
import { getTroopDef } from '@/game/systems/troopSystem';
import { executeBattle } from '@/game/systems/combatSystem';
import { RESOURCE_INFO, RARE_RESOURCE_INFO } from '@/utils/constants';
import { formatNumber } from '@/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  EnemyDef,
  BattleResult,
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

// 兵种类别图标
const TROOP_CLASS_ICONS: Record<string, string> = {
  infantry: '⚔️',
  archer: '🏹',
  cavalry: '🐎',
  siege: '💥',
  myth: '🐉',
  future: '🤖',
  commander: '👑',
  hidden: '👁️',
};

export function CombatPanel() {
  const troops = useGameStore((state) => state.troops);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  const [deployCounts, setDeployCounts] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<BattleResult | null>(null);

  // 计算军队总战力
  const armyPower = (() => {
    let attack = 0;
    let defense = 0;
    let hp = 0;
    for (const t of troops) {
      const def = getTroopDef(t.defId);
      if (!def) continue;
      attack += def.attack * t.count;
      defense += def.defense * t.count;
      hp += def.hp * t.count;
    }
    return { attack, defense, hp };
  })();

  const totalPower = armyPower.attack + armyPower.defense + armyPower.hp;

  // 敌人列表按HP（难度）排序
  const enemyList = Object.values(ENEMIES).sort((a, b) => a.hp - b.hp);

  const selectedEnemy = selectedEnemyId ? ENEMIES[selectedEnemyId] : null;

  // 可派遣兵种（已有数量）
  const deployableTroops = troops.filter((t) => t.count > 0);

  const handleSelectEnemy = (id: string) => {
    setSelectedEnemyId(id);
    setLastResult(null);
    // 默认派遣全部兵力
    const initial: Record<string, number> = {};
    for (const t of troops) {
      if (t.count > 0) initial[t.defId] = t.count;
    }
    setDeployCounts(initial);
  };

  const handleDeployCountChange = (defId: string, count: number) => {
    const troop = troops.find((t) => t.defId === defId);
    if (!troop) return;
    const clamped = Math.max(0, Math.min(count, troop.count));
    setDeployCounts((prev) => ({ ...prev, [defId]: clamped }));
  };

  const handleBattle = () => {
    if (!selectedEnemy) return;
    const deployed = Object.entries(deployCounts)
      .map(([defId, count]) => ({ defId, count }))
      .filter((d) => d.count > 0);
    if (deployed.length === 0) {
      useUIStore.getState().addNotification({ type: 'warning', message: '请选择派遣的兵力' });
      return;
    }
    const result = executeBattle(selectedEnemy.id, deployed);
    setLastResult(result);
    // 战斗后重置派遣数量为剩余兵力
    const remaining: Record<string, number> = {};
    for (const t of useGameStore.getState().troops) {
      if (t.count > 0) remaining[t.defId] = t.count;
    }
    setDeployCounts(remaining);
  };

  // 派遣总战力
  const deployedPower = (() => {
    let power = 0;
    for (const [defId, count] of Object.entries(deployCounts)) {
      const def = getTroopDef(defId);
      if (def) power += (def.attack + def.defense + def.hp) * count;
    }
    return power;
  })();

  const enemyPower = selectedEnemy
    ? selectedEnemy.attack + selectedEnemy.defense + selectedEnemy.hp
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">战斗</h2>
        <p className="text-ancient-400 text-sm">派遣军队征服敌人，获取战利品</p>
      </div>

      {/* 军队总战力 */}
      <div className="game-panel">
        <h3 className="text-sm font-display text-ancient-200 mb-2">军队总战力</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-ancient-400">攻击</div>
            <div className="text-lg font-mono text-red-400">{formatNumber(armyPower.attack)}</div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">防御</div>
            <div className="text-lg font-mono text-blue-400">{formatNumber(armyPower.defense)}</div>
          </div>
          <div>
            <div className="text-xs text-ancient-400">生命</div>
            <div className="text-lg font-mono text-green-400">{formatNumber(armyPower.hp)}</div>
          </div>
        </div>
        <div className="mt-2 text-center text-sm">
          <span className="text-ancient-400">综合战力: </span>
          <span className="text-royal-300 font-mono font-bold">{formatNumber(totalPower)}</span>
        </div>
      </div>

      {/* 敌人列表 */}
      <div>
        <h3 className="text-lg font-display text-ancient-200 mb-3 flex items-center gap-2">
          <span>⚔️</span> 战役列表
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {enemyList.map((enemy) => (
            <EnemyCard
              key={enemy.id}
              enemy={enemy}
              isSelected={selectedEnemyId === enemy.id}
              onSelect={() => handleSelectEnemy(enemy.id)}
            />
          ))}
        </div>
      </div>

      {/* 派兵界面 */}
      <AnimatePresence>
        {selectedEnemy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="game-panel">
              <h3 className="text-lg font-display text-royal-300 mb-3">
                派兵迎战: {selectedEnemy.icon} {selectedEnemy.name}
              </h3>

              {deployableTroops.length === 0 ? (
                <p className="text-ancient-400 text-sm text-center py-4">
                  暂无可派遣的兵力，请先训练兵种
                </p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {deployableTroops.map((troop) => {
                      const def = getTroopDef(troop.defId);
                      if (!def) return null;
                      const deployCount = Math.min(deployCounts[troop.defId] ?? 0, troop.count);
                      return (
                        <div
                          key={troop.defId}
                          className="flex items-center gap-3 bg-ancient-900/40 rounded p-2"
                        >
                          <span className="text-2xl">{def.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-ancient-100">{def.name}</div>
                            <div className="text-xs text-ancient-500">
                              可用 {formatNumber(troop.count)} | 派遣战力{' '}
                              {formatNumber((def.attack + def.defense + def.hp) * deployCount)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="game-button text-xs px-2 py-1"
                              onClick={() => handleDeployCountChange(troop.defId, 0)}
                            >
                              清空
                            </button>
                            <input
                              type="number"
                              min={0}
                              max={troop.count}
                              value={deployCount}
                              onChange={(e) =>
                                handleDeployCountChange(troop.defId, parseInt(e.target.value) || 0)
                              }
                              className="w-20 bg-ancient-900 border border-ancient-700 rounded px-2 py-1 text-sm text-ancient-100 text-center"
                            />
                            <button
                              className="game-button text-xs px-2 py-1"
                              onClick={() => handleDeployCountChange(troop.defId, troop.count)}
                            >
                              全部
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 战力对比 */}
                  <div className="mb-3">
                    <ProgressBar
                      value={deployedPower}
                      max={enemyPower}
                      label="战力对比 (达到80%可获胜)"
                      showPercent
                      color={deployedPower >= enemyPower * 0.8 ? 'green' : 'red'}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-ancient-400">派遣总战力:</span>
                    <span className="text-royal-300 font-mono font-bold">
                      {formatNumber(deployedPower)}
                    </span>
                  </div>

                  <motion.button
                    className="game-button game-button-primary w-full"
                    onClick={handleBattle}
                    whileTap={{ scale: 0.98 }}
                  >
                    ⚔️ 派遣并战斗
                  </motion.button>
                </>
              )}

              {/* 战斗结果 */}
              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 border-t border-ancient-700 pt-4"
                  >
                    <BattleResultView result={lastResult} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 敌人卡片
interface EnemyCardProps {
  enemy: EnemyDef;
  isSelected: boolean;
  onSelect: () => void;
}

function EnemyCard({ enemy, isSelected, onSelect }: EnemyCardProps) {
  const enemyPower = enemy.attack + enemy.defense + enemy.hp;
  return (
    <motion.div
      className={`game-panel cursor-pointer ${
        isSelected ? 'border-royal-500 ring-1 ring-royal-500/50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">{enemy.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{enemy.name}</span>
            {enemy.isBoss && (
              <span className="text-xs px-2 py-0.5 rounded bg-war-700 text-war-200 font-bold">
                BOSS
              </span>
            )}
          </div>
          <p className="text-xs text-ancient-400 mt-0.5">{enemy.description}</p>
        </div>
      </div>

      {/* 属性 */}
      <div className="grid grid-cols-4 gap-1 mb-2 text-center text-xs">
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">攻击</div>
          <div className="text-red-400 font-mono">{formatNumber(enemy.attack)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">防御</div>
          <div className="text-blue-400 font-mono">{formatNumber(enemy.defense)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">生命</div>
          <div className="text-green-400 font-mono">{formatNumber(enemy.hp)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">战力</div>
          <div className="text-royal-300 font-mono">{formatNumber(enemyPower)}</div>
        </div>
      </div>

      {/* 兵力构成 */}
      <div className="text-xs text-ancient-400 mb-2">
        <span>兵力: </span>
        {enemy.troops.map((t, i) => (
          <span key={i} className="mr-2">
            {TROOP_CLASS_ICONS[t.class] || '⚔️'}
            {TROOP_CLASS_NAMES[t.class] || t.class}×{formatNumber(t.count)}
          </span>
        ))}
      </div>

      {/* 奖励 */}
      <div className="text-xs">
        <span className="text-ancient-500">奖励: </span>
        {enemy.rewards.resources &&
          Object.entries(enemy.rewards.resources).map(([res, amount]) => (
            <span key={res} className="mr-2 text-ancient-300">
              {getResourceIcon(res)}
              {formatNumber(amount as number)}
            </span>
          ))}
        <span className="ml-1 text-yellow-400">✦{formatNumber(enemy.rewards.experience)}</span>
      </div>

      {enemy.unlockCondition && (
        <div className="text-xs text-ancient-500 mt-1">解锁条件: {enemy.unlockCondition}</div>
      )}
    </motion.div>
  );
}

// 战斗结果展示
interface BattleResultViewProps {
  result: BattleResult;
}

function BattleResultView({ result }: BattleResultViewProps) {
  const losses = result.playerLosses.filter((l) => l.lost > 0);
  return (
    <div>
      <div
        className={`text-center text-lg font-display mb-3 ${
          result.victory ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {result.victory ? '🎉 战斗胜利！' : '💀 战斗失败'}
      </div>

      {/* 损耗 */}
      <div className="mb-3">
        <div className="text-xs text-ancient-400 mb-1">兵力损耗:</div>
        {losses.length === 0 ? (
          <div className="text-xs text-green-400">无损失</div>
        ) : (
          <div className="flex flex-wrap gap-2 text-xs">
            {losses.map((loss) => {
              const def = getTroopDef(loss.defId);
              return (
                <span key={loss.defId} className="text-red-400">
                  {def?.icon || '⚔️'} {def?.name || loss.defId} -{formatNumber(loss.lost)}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 奖励 */}
      {result.victory && (
        <div>
          <div className="text-xs text-ancient-400 mb-1">获得奖励:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(result.rewards.resources).map(([res, amount]) => (
              <span key={res} className="text-ancient-200">
                {getResourceIcon(res)}
                {formatNumber(amount as number)}
              </span>
            ))}
            <span className="text-yellow-400">✦经验 {formatNumber(result.rewards.experience)}</span>
            {result.rewards.drops.map((drop, i) => (
              <span key={i} className="text-pink-400">
                {drop.name} ×{formatNumber(drop.amount)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
