import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { ENEMIES, getEnemy } from '@/game/data/enemies';
import { getTroopDef } from '@/game/systems/troopSystem';
import type { BattleResult, DropResult, TroopClass, ResourceState, EnemyDef } from '@/game/types';

// 兵种克制关系
const COUNTER_MAP: Record<TroopClass, TroopClass[]> = {
  infantry: ['cavalry'],     // 步兵克骑兵
  archer: ['infantry'],      // 弓兵克步兵
  cavalry: ['archer'],       // 骑兵克弓兵
  siege: [],                 // 攻城器械无克制
  myth: [],                  // 神话兵种无克制
  future: [],                // 未来兵种无克制
  commander: [],             // 指挥官无克制
  hidden: [],                // 隐藏兵种无克制
};

// 计算克制加成
function getCounterMultiplier(attackerClass: TroopClass, defenderClass: TroopClass): number {
  if (COUNTER_MAP[attackerClass]?.includes(defenderClass)) {
    return 1.5; // 克制+50%伤害
  }
  if (COUNTER_MAP[defenderClass]?.includes(attackerClass)) {
    return 0.67; // 被克-33%伤害
  }
  return 1.0;
}

// 执行战斗
export function executeBattle(
  enemyId: string,
  deployedTroops: { defId: string; count: number }[]
): BattleResult {
  const state = useGameStore.getState();
  const enemy = getEnemy(enemyId);
  if (!enemy) {
    return {
      victory: false,
      playerLosses: [],
      enemyLosses: [],
      rewards: { resources: {}, drops: [], experience: 0 },
    };
  }

  // 计算玩家战力
  let playerAttack = 0;
  let playerDefense = 0;
  let playerHp = 0;
  const playerTroopClasses: { class: TroopClass; count: number; defId: string }[] = [];

  for (const deployed of deployedTroops) {
    const def = getTroopDef(deployed.defId);
    if (!def || deployed.count <= 0) continue;
    playerAttack += def.attack * deployed.count;
    playerDefense += def.defense * deployed.count;
    playerHp += def.hp * deployed.count;
    playerTroopClasses.push({ class: def.class, count: deployed.count, defId: deployed.defId });
  }

  // 计算敌人战力
  let enemyAttack = 0;
  let enemyDefense = 0;
  let enemyHp = 0;
  for (const enemyTroop of enemy.troops) {
    enemyAttack += 10 * enemyTroop.count; // 基础攻击
    enemyDefense += 5 * enemyTroop.count;
    enemyHp += 20 * enemyTroop.count;
  }
  // 应用敌人定义的属性
  enemyAttack = Math.max(enemyAttack, enemy.attack);
  enemyDefense = Math.max(enemyDefense, enemy.defense);
  enemyHp = Math.max(enemyHp, enemy.hp);

  // 应用克制加成
  let counterBonus = 1.0;
  for (const pTroop of playerTroopClasses) {
    for (const eTroop of enemy.troops) {
      counterBonus *= getCounterMultiplier(pTroop.class, eTroop.class);
    }
  }
  playerAttack *= counterBonus;

  // 战斗结算（简化版：比较战力）
  const playerPower = playerAttack + playerDefense + playerHp;
  const enemyPower = enemyAttack + enemyDefense + enemyHp;

  const victory = playerPower > enemyPower * 0.8; // 玩家战力达到敌人80%即可获胜

  // 计算损耗
  const lossRatio = victory
    ? Math.max(0.1, (enemyPower / playerPower) * 0.5) // 胜利损失10-50%
    : 0.7; // 失败损失70%

  const playerLosses = deployedTroops.map((t) => ({
    defId: t.defId,
    lost: Math.floor(t.count * lossRatio),
  }));

  const enemyLosses = enemy.troops.map((t) => ({
    class: t.class,
    lost: victory ? t.count : Math.floor(t.count * 0.3),
  }));

  // 计算奖励
  const rewards = {
    resources: {} as Partial<ResourceState>,
    drops: [] as DropResult[],
    experience: 0,
  };

  if (victory) {
    // 资源奖励
    if (enemy.rewards.resources) {
      rewards.resources = { ...enemy.rewards.resources };
      const newResources = { ...state.resources };
      for (const [res, amount] of Object.entries(rewards.resources)) {
        newResources[res as keyof ResourceState] += amount as number;
      }
      useGameStore.setState({ resources: newResources });
    }

    // 经验奖励
    rewards.experience = enemy.rewards.experience;

    // 掉落
    if (enemy.rewards.drops) {
      for (const drop of enemy.rewards.drops.items) {
        if (Math.random() < drop.chance) {
          const amount = Math.floor(
            drop.minAmount + Math.random() * (drop.maxAmount - drop.minAmount + 1)
          );
          rewards.drops.push({
            type: drop.type,
            id: drop.id,
            amount,
            name: getDropName(drop.type, drop.id),
          });

          // 应用掉落
          applyDrop(drop.type, drop.id, amount);
        }
      }
    }

    useUIStore.getState().addNotification({
      type: 'success',
      message: `战斗胜利！获得经验 ${rewards.experience}`,
    });

    // 记录编年史与合法性加成
    useGameStore.getState().recordChronicle({
      category: 'military',
      title: '战役胜利',
      description: `击败${enemy.name}，凯旋而归`,
      impact: '合法性+3，获得战利品',
    });
    useGameStore.getState().modifyLegitimacy(3, `战胜${enemy.name}`);
  } else {
    // 失败：扣除损失的兵力
    useUIStore.getState().addNotification({
      type: 'error',
      message: '战斗失败！兵力损失严重',
    });

    // 记录编年史与合法性下降
    useGameStore.getState().recordChronicle({
      category: 'military',
      title: '战役失利',
      description: `不敌${enemy.name}，损兵折将`,
      impact: '合法性-10，兵力损失',
    });
    useGameStore.getState().modifyLegitimacy(-10, `战败于${enemy.name}`);

    // 检查是否触发死亡转生
    const remainingTroops = deployedTroops.reduce(
      (sum, t) => sum + Math.max(0, t.count - Math.floor(t.count * lossRatio)),
      0
    );
    if (remainingTroops === 0 && getTotalTroopsAfterLoss(playerLosses) === 0) {
      useUIStore.getState().addNotification({
        type: 'error',
        message: '军队全军覆没！可能触发转生...',
      });
    }
  }

  // 扣除损失的兵力
  const newTroops = state.troops.map((troop) => {
    const loss = playerLosses.find((l) => l.defId === troop.defId);
    if (loss) {
      return { ...troop, count: Math.max(0, troop.count - loss.lost) };
    }
    return troop;
  });
  useGameStore.setState({ troops: newTroops });

  return { victory, playerLosses, enemyLosses, rewards };
}

function getTotalTroopsAfterLoss(losses: { defId: string; lost: number }[]): number {
  const state = useGameStore.getState();
  let total = 0;
  for (const troop of state.troops) {
    const loss = losses.find((l) => l.defId === troop.defId);
    total += loss ? Math.max(0, troop.count - loss.lost) : troop.count;
  }
  return total;
}

function getDropName(type: string, id: string): string {
  switch (type) {
    case 'resource':
      return id;
    case 'techFragment':
      return '科技碎片';
    case 'relic':
      return '遗物';
    case 'troop':
      return '传奇兵种';
    case 'item':
      return '道具';
    default:
      return id;
  }
}

function applyDrop(type: string, id: string, amount: number): void {
  const state = useGameStore.getState();
  switch (type) {
    case 'resource':
      useGameStore.setState({
        resources: {
          ...state.resources,
          [id]: state.resources[id as keyof ResourceState] + amount,
        },
      });
      break;
    case 'techFragment':
      // 科技碎片暂存到知识
      useGameStore.setState({
        resources: {
          ...state.resources,
          knowledge: state.resources.knowledge + amount * 10,
        },
      });
      break;
    case 'relic':
      // 添加遗物
      const existingRelic = state.relics.find((r) => r.defId === id);
      if (existingRelic) {
        useGameStore.setState({
          relics: state.relics.map((r) =>
            r.defId === id ? { ...r, count: r.count + amount } : r
          ),
        });
      } else {
        useGameStore.setState({
          relics: [...state.relics, { defId: id, count: amount, equipped: false }],
        });
      }
      break;
    // 其他类型暂不处理
  }
}

// 获取可战斗的敌人列表
export function getAvailableEnemies(): EnemyDef[] {
  return Object.values(ENEMIES);
}
