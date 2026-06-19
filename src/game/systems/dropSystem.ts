import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { getEnemy } from '@/game/data/enemies';
import { getRelic, getRelicsBySet, getAllSetIds } from '@/game/data/relics';
import { getTroopDef } from '@/game/systems/troopSystem';
import type {
  DropResult,
  DropEntry,
  ResourceState,
  RelicState,
} from '@/game/types';

// 获取掉落物名称
function getDropName(type: DropEntry['type'], id: string): string {
  switch (type) {
    case 'resource':
      return id;
    case 'techFragment':
      return '科技碎片';
    case 'relic': {
      const relic = getRelic(id);
      return relic ? relic.name : '未知遗物';
    }
    case 'troop': {
      const troop = getTroopDef(id);
      return troop ? troop.name : '传奇兵种';
    }
    case 'item':
      return '道具';
    default:
      return id;
  }
}

// 生成掉落（基于敌人掉落表）
export function generateDrops(enemyId: string): DropResult[] {
  const enemy = getEnemy(enemyId);
  if (!enemy || !enemy.rewards.drops) return [];

  const results: DropResult[] = [];
  const state = useGameStore.getState();

  // 计算遗物掉落加成（来自转生升级 relicHunter）
  let relicDropBonus = 0;
  const relicHunterUpgrade = state.rebirth.upgrades.find((u) => u.id === 'relicHunter');
  if (relicHunterUpgrade) {
    relicDropBonus = 0.05 * relicHunterUpgrade.level;
  }

  // 文明加成：埃及遗物掉落+20%
  if (state.rebirth.civilization === 'egyptian') {
    relicDropBonus += 0.2;
  }

  for (const drop of enemy.rewards.drops.items) {
    // 遗物类型应用掉落加成
    const effectiveChance =
      drop.type === 'relic'
        ? Math.min(1, drop.chance + relicDropBonus)
        : drop.chance;

    if (Math.random() < effectiveChance) {
      const amount =
        drop.minAmount +
        Math.floor(Math.random() * (drop.maxAmount - drop.minAmount + 1));
      if (amount > 0) {
        results.push({
          type: drop.type,
          id: drop.id,
          amount,
          name: getDropName(drop.type, drop.id),
        });
      }
    }
  }

  return results;
}

// 应用掉落到游戏状态
export function applyDrop(drop: DropResult): void {
  const state = useGameStore.getState();

  switch (drop.type) {
    case 'resource': {
      const newResources = {
        ...state.resources,
        [drop.id]: state.resources[drop.id as keyof ResourceState] + drop.amount,
      };
      useGameStore.setState({ resources: newResources });
      useUIStore.getState().addNotification({
        type: 'success',
        message: `获得资源：${drop.name} ×${drop.amount}`,
      });
      break;
    }
    case 'techFragment': {
      // 科技碎片转换为知识（1碎片=10知识）
      useGameStore.setState({
        resources: {
          ...state.resources,
          knowledge: state.resources.knowledge + drop.amount * 10,
        },
      });
      useUIStore.getState().addNotification({
        type: 'success',
        message: `获得科技碎片 ×${drop.amount}（转化为知识）`,
      });
      break;
    }
    case 'relic': {
      const existingRelic = state.relics.find((r) => r.defId === drop.id);
      let newRelics: RelicState[];
      if (existingRelic) {
        newRelics = state.relics.map((r) =>
          r.defId === drop.id ? { ...r, count: r.count + drop.amount } : r
        );
      } else {
        newRelics = [
          ...state.relics,
          { defId: drop.id, count: drop.amount, equipped: false },
        ];
      }
      useGameStore.setState({
        relics: newRelics,
        codex: {
          ...state.codex,
          discoveredRelics: [
            ...new Set([...state.codex.discoveredRelics, drop.id]),
          ],
        },
      });
      useUIStore.getState().addNotification({
        type: 'success',
        message: `获得遗物：${drop.name} ×${drop.amount}`,
      });
      break;
    }
    case 'troop': {
      // 传奇兵种掉落：直接加入军队
      const existingTroop = state.troops.find((t) => t.defId === drop.id);
      if (existingTroop) {
        useGameStore.setState({
          troops: state.troops.map((t) =>
            t.defId === drop.id ? { ...t, count: t.count + drop.amount } : t
          ),
        });
      } else {
        useGameStore.setState({
          troops: [
            ...state.troops,
            {
              defId: drop.id,
              count: drop.amount,
              inProduction: 0,
              productionProgress: 0,
            },
          ],
        });
      }
      useUIStore.getState().addNotification({
        type: 'success',
        message: `获得传奇兵种：${drop.name} ×${drop.amount}`,
      });
      break;
    }
    case 'item':
      useUIStore.getState().addNotification({
        type: 'info',
        message: `获得道具：${drop.name} ×${drop.amount}`,
      });
      break;
  }
}

// 检查指定套装是否集齐（所有遗物都拥有至少1个）
function isSetComplete(setId: string): boolean {
  const setRelics = getRelicsBySet(setId);
  if (setRelics.length === 0) return false;
  const ownedRelicIds = new Set(
    useGameStore.getState().relics.filter((r) => r.count > 0).map((r) => r.defId)
  );
  return setRelics.every((r) => ownedRelicIds.has(r.id));
}

// 获取遗物套装加成
export function getRelicSetBonus(): {
  setId: string;
  bonus: string;
  relics: string[];
}[] {
  const activeBonuses: { setId: string; bonus: string; relics: string[] }[] = [];
  const setIds = getAllSetIds();

  for (const setId of setIds) {
    if (!isSetComplete(setId)) continue;
    const setRelics = getRelicsBySet(setId);
    // 取第一个遗物的 setBonus 描述（同一套装描述一致）
    const bonusDesc = setRelics[0]?.setBonus;
    if (bonusDesc) {
      activeBonuses.push({
        setId,
        bonus: bonusDesc,
        relics: setRelics.map((r) => r.id),
      });
    }
  }

  return activeBonuses;
}

// 获取已拥有的遗物列表（含定义）
export function getOwnedRelics(): { defId: string; count: number; equipped: boolean }[] {
  return useGameStore
    .getState()
    .relics.filter((r) => r.count > 0)
    .map((r) => ({ defId: r.defId, count: r.count, equipped: r.equipped }));
}

// 装备/卸下遗物
export function toggleRelicEquipped(relicId: string): boolean {
  const state = useGameStore.getState();
  const relic = state.relics.find((r) => r.defId === relicId);
  if (!relic || relic.count <= 0) {
    useUIStore.getState().addNotification({ type: 'warning', message: '未拥有该遗物' });
    return false;
  }

  useGameStore.setState({
    relics: state.relics.map((r) =>
      r.defId === relicId ? { ...r, equipped: !r.equipped } : r
    ),
  });

  return true;
}
