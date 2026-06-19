// 放置帝国 - 天命合法性系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { GameState } from '@/game/types';

// 根据合法性值返回产出倍数
export function getLegitimacyMultiplier(state: GameState): number {
  const value = state.legitimacy.value;
  if (value >= 80) return 1.2;   // 天命所归 +20%
  if (value >= 50) return 1.0;   // 正常
  if (value >= 30) return 0.9;   // -10%
  return 0.7;                    // -30%
}

// 人口增长倍数
export function getLegitimacyPopulationMultiplier(state: GameState): number {
  const value = state.legitimacy.value;
  if (value >= 80) return 1.5;   // +50%
  if (value >= 50) return 1.0;   // 正常
  if (value >= 30) return 0.7;   // -30%
  return 0.3;                    // -70%
}

// 检查合法性事件
export function checkLegitimacyEvents(state: GameState): void {
  const value = state.legitimacy.value;
  const uiStore = useUIStore.getState();

  // 低合法性触发叛乱
  if (value < 30 && Math.random() < 0.01) {
    uiStore.addNotification({
      type: 'error',
      message: '合法性过低，民众叛乱！失去部分兵力与资源',
    });
    // 损失5%兵力和资源
    const newTroops = state.troops.map((t) => ({
      ...t,
      count: Math.floor(t.count * 0.95),
    }));
    useGameStore.setState((s) => ({
      troops: newTroops,
      resources: {
        ...s.resources,
        food: Math.floor(s.resources.food * 0.95),
        gold: Math.floor(s.resources.gold * 0.95),
      },
    }));
    useGameStore.getState().recordChronicle({
      category: 'disaster',
      title: '民众叛乱',
      description: '合法性过低引发大规模叛乱，帝国损失惨重',
      impact: '兵力 -5%，食物与金币 -5%',
    });
  }

  // 高合法性触发庆典
  if (value >= 80 && Math.random() < 0.005) {
    uiStore.addNotification({
      type: 'success',
      message: '天命所归！民众自发举办庆典，人口增长加速',
    });
    useGameStore.getState().addResource('population', Math.floor(state.resources.population * 0.05));
    useGameStore.getState().recordChronicle({
      category: 'culture',
      title: '万民庆典',
      description: '天命所归，万民欢庆，帝国繁荣昌盛',
      impact: '人口 +5%',
    });
  }
}

// 获取合法性等级名称和颜色
export function getLegitimacyLevel(state: GameState): { name: string; color: string } {
  const value = state.legitimacy.value;
  if (value >= 80) return { name: '天命所归', color: 'text-yellow-400' };
  if (value >= 50) return { name: '人心安定', color: 'text-green-400' };
  if (value >= 30) return { name: '民心不稳', color: 'text-orange-400' };
  return { name: '风雨飘摇', color: 'text-red-400' };
}

// 合法性自然恢复（每tick调用）
export function updateLegitimacy(deltaSeconds: number): void {
  const state = useGameStore.getState();
  const value = state.legitimacy.value;

  // 治理技能提供自然恢复
  const governanceLevel = state.ruler.skills.governance;
  const recovery = governanceLevel * 0.002 * deltaSeconds; // 每级每秒+0.002

  // 中间值（50）为平衡点，低于50缓慢回升，高于50缓慢下降（趋向50）
  let change = 0;
  if (value < 50) {
    change = recovery * 1.5; // 低于50加速恢复
  } else if (value > 50) {
    change = -recovery * 0.5; // 高于50缓慢衰减
  }

  if (Math.abs(change) > 0.001) {
    useGameStore.getState().modifyLegitimacy(change, '自然变化');
  }
}
