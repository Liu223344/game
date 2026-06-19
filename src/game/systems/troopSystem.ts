import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { TROOPS } from '@/game/data/troops';
import { SUPER_TROOPS } from '@/game/data/superTroops';
import type { TroopDef, TroopState, ResourceState } from '@/game/types';

// 获取所有兵种定义（普通+超级）
export function getAllTroopDefs(): TroopDef[] {
  return [...Object.values(TROOPS), ...Object.values(SUPER_TROOPS)];
}

// 获取兵种定义
export function getTroopDef(defId: string): TroopDef | undefined {
  return TROOPS[defId] || SUPER_TROOPS[defId];
}

// 检查兵种是否已解锁
export function isTroopUnlocked(defId: string): boolean {
  const def = getTroopDef(defId);
  if (!def) return false;
  if (!def.unlockTech) return true;
  return useGameStore.getState().tech.researched.includes(def.unlockTech);
}

// 开始生产兵种
export function startTroopProduction(defId: string, count: number): boolean {
  const state = useGameStore.getState();
  const def = getTroopDef(defId);
  if (!def) return false;

  // 检查是否解锁
  if (!isTroopUnlocked(defId)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '兵种未解锁' });
    return false;
  }

  // 检查资源
  const totalCost: Partial<ResourceState> = {};
  for (const [res, amount] of Object.entries(def.cost)) {
    totalCost[res as keyof ResourceState] = (amount as number) * count;
  }

  if (!state.hasResources(totalCost)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '资源不足' });
    return false;
  }

  // 扣除资源
  for (const [res, amount] of Object.entries(totalCost)) {
    state.spendResource(res as keyof ResourceState, amount as number);
  }

  // 添加到生产队列
  const existingTroop = state.troops.find((t) => t.defId === defId);
  if (existingTroop) {
    useGameStore.setState({
      troops: state.troops.map((t) =>
        t.defId === defId
          ? { ...t, inProduction: t.inProduction + count }
          : t
      ),
    });
  } else {
    const newTroop: TroopState = {
      defId,
      count: 0,
      inProduction: count,
      productionProgress: 0,
    };
    useGameStore.setState({ troops: [...state.troops, newTroop] });
  }

  useUIStore.getState().addNotification({
    type: 'info',
    message: `开始训练 ${count} 个 ${def.name}`,
  });
  return true;
}

// 更新兵种生产进度（每tick调用）
export function updateTroopProduction(deltaSeconds: number): void {
  const state = useGameStore.getState();
  if (state.troops.length === 0) return;

  let updated = false;
  const newTroops = state.troops.map((troop) => {
    if (troop.inProduction <= 0) return troop;

    const def = getTroopDef(troop.defId);
    if (!def) return troop;

    const progressPerTick = deltaSeconds / def.productionTime;
    let newProgress = troop.productionProgress + progressPerTick;
    let newCount = troop.count;
    let newInProduction = troop.inProduction;

    while (newProgress >= 1 && newInProduction > 0) {
      newProgress -= 1;
      newCount += 1;
      newInProduction -= 1;
      updated = true;
    }

    if (updated) {
      return {
        ...troop,
        count: newCount,
        inProduction: newInProduction,
        productionProgress: newInProduction > 0 ? newProgress : 0,
      };
    }
    return troop;
  });

  if (updated) {
    useGameStore.setState({ troops: newTroops });
  }
}

// 获取总兵力
export function getTotalTroops(): number {
  return useGameStore.getState().troops.reduce((sum, t) => sum + t.count, 0);
}

// 获取军队总战力
export function getArmyPower(): { attack: number; defense: number; hp: number } {
  const troops = useGameStore.getState().troops;
  let attack = 0;
  let defense = 0;
  let hp = 0;

  for (const troop of troops) {
    const def = getTroopDef(troop.defId);
    if (!def) continue;
    attack += def.attack * troop.count;
    defense += def.defense * troop.count;
    hp += def.hp * troop.count;
  }

  return { attack, defense, hp };
}
