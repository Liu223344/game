import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { TERRITORIES, getTerritory } from '@/game/data/territories';
import { getTroopDef } from '@/game/systems/troopSystem';
import type {
  TerritoryDef,
  TerritoryState,
  ResourceState,
  TroopClass,
} from '@/game/types';

// 兵种基础属性（用于计算守军战力，与 combatSystem 保持一致）
const DEFENDER_BASE_ATTACK = 10;
const DEFENDER_BASE_DEFENSE = 5;
const DEFENDER_BASE_HP = 20;

// 计算守军总战力
function calculateDefenderPower(defender: { class: TroopClass; count: number }[]): number {
  let power = 0;
  for (const troop of defender) {
    power +=
      (DEFENDER_BASE_ATTACK + DEFENDER_BASE_DEFENSE + DEFENDER_BASE_HP) * troop.count;
  }
  return power;
}

// 计算部署兵力的总战力
function calculateDeployedPower(
  deployedTroops: { defId: string; count: number }[]
): number {
  let power = 0;
  for (const deployed of deployedTroops) {
    const def = getTroopDef(deployed.defId);
    if (!def || deployed.count <= 0) continue;
    power += (def.attack + def.defense + def.hp) * deployed.count;
  }
  return power;
}

// 征服领地（使用兵力攻击守军）
export function conquerTerritory(
  territoryId: string,
  deployedTroops: { defId: string; count: number }[]
): boolean {
  const state = useGameStore.getState();
  const territory = getTerritory(territoryId);
  if (!territory) return false;

  // 检查是否已拥有
  const existing = state.territories.find((t) => t.defId === territoryId);
  if (existing?.owned) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该领地已属于帝国' });
    return false;
  }

  // 检查部署兵力是否足够
  if (deployedTroops.length === 0) {
    useUIStore.getState().addNotification({ type: 'warning', message: '未部署任何兵力' });
    return false;
  }

  // 校验兵力是否真实存在
  for (const deployed of deployedTroops) {
    const troopState = state.troops.find((t) => t.defId === deployed.defId);
    if (!troopState || troopState.count < deployed.count) {
      useUIStore.getState().addNotification({
        type: 'warning',
        message: '部署兵力超过现有数量',
      });
      return false;
    }
  }

  // 计算双方战力
  const playerPower = calculateDeployedPower(deployedTroops);
  const defenderPower = calculateDefenderPower(territory.defender);

  if (playerPower === 0) {
    useUIStore.getState().addNotification({ type: 'warning', message: '部署兵力无效' });
    return false;
  }

  // 胜利条件：玩家战力达到守军80%
  const victory = playerPower > defenderPower * 0.8;

  if (!victory) {
    // 失败：损失70%兵力
    const lossRatio = 0.7;
    const newTroops = state.troops.map((troop) => {
      const deployed = deployedTroops.find((d) => d.defId === troop.defId);
      if (deployed) {
        return { ...troop, count: Math.max(0, troop.count - Math.floor(deployed.count * lossRatio)) };
      }
      return troop;
    });
    useGameStore.setState({ troops: newTroops });

    useUIStore.getState().addNotification({
      type: 'error',
      message: `征服 ${territory.name} 失败！兵力损失惨重`,
    });
    return false;
  }

  // 胜利：损失10-50%兵力
  const lossRatio = Math.max(0.1, (defenderPower / playerPower) * 0.5);
  const newTroops = state.troops.map((troop) => {
    const deployed = deployedTroops.find((d) => d.defId === troop.defId);
    if (deployed) {
      return { ...troop, count: Math.max(0, troop.count - Math.floor(deployed.count * lossRatio)) };
    }
    return troop;
  });

  // 发放一次性资源奖励
  const newResources = { ...state.resources };
  if (territory.rewards.resources) {
    for (const [res, amount] of Object.entries(territory.rewards.resources)) {
      newResources[res as keyof ResourceState] += amount as number;
    }
  }

  // 更新领地状态
  const newTerritoryState: TerritoryState = {
    defId: territoryId,
    owned: true,
  };

  const otherTerritories = state.territories.filter((t) => t.defId !== territoryId);
  useGameStore.setState({
    troops: newTroops,
    resources: newResources,
    territories: [...otherTerritories, newTerritoryState],
    codex: {
      ...state.codex,
      discoveredCivilizations: territory.rewards.civilization
        ? [...new Set([...state.codex.discoveredCivilizations, territory.rewards.civilization])]
        : state.codex.discoveredCivilizations,
    },
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `成功征服 ${territory.name}！`,
  });

  // 记录编年史与合法性加成（开疆拓土是帝国伟业）
  useGameStore.getState().recordChronicle({
    category: 'military',
    title: '领土扩张',
    description: `征服${territory.name}，版图扩大`,
    impact: '合法性+5，获得新领地与资源',
  });
  useGameStore.getState().modifyLegitimacy(5, `征服${territory.name}`);

  // 提示文明遗产
  if (territory.rewards.civilization) {
    useUIStore.getState().addNotification({
      type: 'info',
      message: `发现文明遗产，可吸收传承`,
    });
  }

  return true;
}

// 改造领地
export function modifyTerritory(territoryId: string, modificationId: string): boolean {
  const state = useGameStore.getState();
  const territory = getTerritory(territoryId);
  if (!territory) return false;

  // 检查是否拥有该领地
  const territoryState = state.territories.find((t) => t.defId === territoryId);
  if (!territoryState?.owned) {
    useUIStore.getState().addNotification({ type: 'warning', message: '尚未拥有该领地' });
    return false;
  }

  // 检查是否已改造
  if (territoryState.modification) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该领地已改造过' });
    return false;
  }

  // 查找改造方案
  const modification = territory.modifications?.find((m) => m.id === modificationId);
  if (!modification) {
    useUIStore.getState().addNotification({ type: 'warning', message: '改造方案不存在' });
    return false;
  }

  // 检查资源
  if (!state.hasResources(modification.cost)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '资源不足，无法改造' });
    return false;
  }

  // 扣除资源
  for (const [res, amount] of Object.entries(modification.cost)) {
    state.spendResource(res as keyof ResourceState, amount as number);
  }

  // 更新领地改造状态
  const newTerritories = state.territories.map((t) =>
    t.defId === territoryId ? { ...t, modification: modificationId } : t
  );
  useGameStore.setState({ territories: newTerritories });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `${territory.name} 已完成改造：${modification.name}`,
  });

  return true;
}

// 获取已拥有领地
export function getOwnedTerritories(): TerritoryDef[] {
  const territories = useGameStore.getState().territories;
  return territories
    .filter((t) => t.owned)
    .map((t) => getTerritory(t.defId))
    .filter((t): t is TerritoryDef => t !== undefined);
}

// 获取领地加成总和（持续加成 + 改造加成）
export function getTerritoryBonus(): Partial<ResourceState> {
  const state = useGameStore.getState();
  const bonus: Partial<ResourceState> = {};

  for (const territoryState of state.territories) {
    if (!territoryState.owned) continue;
    const def = getTerritory(territoryState.defId);
    if (!def) continue;

    // 基础持续加成
    if (def.rewards.bonus) {
      for (const [res, amount] of Object.entries(def.rewards.bonus)) {
        const key = res as keyof ResourceState;
        bonus[key] = (bonus[key] || 0) + (amount as number);
      }
    }

    // 改造加成
    if (territoryState.modification) {
      const modification = def.modifications?.find((m) => m.id === territoryState.modification);
      if (modification) {
        for (const [res, amount] of Object.entries(modification.resultBonus)) {
          const key = res as keyof ResourceState;
          bonus[key] = (bonus[key] || 0) + (amount as number);
        }
      }
    }
  }

  return bonus;
}

// 吸收文明遗产
export function absorbCivilization(civilizationId: string): boolean {
  const state = useGameStore.getState();

  // 检查是否拥有含该文明遗产的领地
  const territoryWithCiv = state.territories.find((t) => {
    if (!t.owned) return false;
    const def = getTerritory(t.defId);
    return def?.rewards.civilization === civilizationId;
  });

  if (!territoryWithCiv) {
    useUIStore.getState().addNotification({
      type: 'warning',
      message: '尚未征服包含该文明遗产的领地',
    });
    return false;
  }

  // 检查是否已吸收（通过 eraImprints 记录）
  if (state.eraImprints.includes(civilizationId)) {
    useUIStore.getState().addNotification({
      type: 'warning',
      message: '该文明遗产已被吸收',
    });
    return false;
  }

  // 记录到时代印记
  useGameStore.setState({
    eraImprints: [...state.eraImprints, civilizationId],
    codex: {
      ...state.codex,
      discoveredCivilizations: [
        ...new Set([...state.codex.discoveredCivilizations, civilizationId]),
      ],
    },
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `成功吸收文明遗产，获得永久传承加成`,
  });

  return true;
}

// 获取所有领地定义
export function getAllTerritories(): TerritoryDef[] {
  return Object.values(TERRITORIES);
}
