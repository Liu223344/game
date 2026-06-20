// 放置帝国 - 多元宇宙探索系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { GameState, UniverseType } from '@/game/types';

// 检查多元宇宙解锁条件
export function checkMultiverseUnlock(state: GameState): boolean {
  // 需要研究因果律时代终极科技
  const hasCausalityTech = state.tech.researched.includes('causalityWeapon');
  return hasCausalityTech;
}

// 进入宇宙
export function enterUniverse(universe: UniverseType): boolean {
  const state = useGameStore.getState();
  if (!checkMultiverseUnlock(state)) return false;
  const target = state.multiverse.universes.find((u) => u.id === universe);
  if (!target || target.isCompleted) return false;

  useGameStore.getState().setCurrentUniverse(universe);
  useUIStore.getState().addNotification({
    type: 'info',
    message: `进入${target.name}，规则：${target.rule}`,
  });
  useGameStore.getState().recordChronicle({
    category: 'tech',
    title: '探索平行宇宙',
    description: `进入${target.name}，规则：${target.rule}`,
    impact: '探索完成可获得专属奖励',
  });
  return true;
}

// 离开宇宙
export function leaveUniverse(): void {
  useGameStore.getState().setCurrentUniverse(null);
  useUIStore.getState().addNotification({
    type: 'info',
    message: '返回主宇宙',
  });
}

// 更新探索进度（每tick调用）
export function updateMultiverseExploration(deltaSeconds: number): void {
  const state = useGameStore.getState();
  if (!state.multiverse.currentUniverse) return;

  // 每秒探索进度+0.001（约1000秒=16分钟完成一个宇宙）
  const progressGain = 0.001 * deltaSeconds;
  const newProgress = state.multiverse.explorationProgress + progressGain;

  if (newProgress >= 1) {
    // 探索完成
    const universe = state.multiverse.currentUniverse;
    useGameStore.getState().completeUniverse(universe);
    useUIStore.getState().addNotification({
      type: 'success',
      message: `${getUniverseName(universe)}探索完成！获得专属奖励`,
    });
    useGameStore.getState().recordChronicle({
      category: 'tech',
      title: '宇宙探索完成',
      description: `成功探索${getUniverseName(universe)}，获得专属奖励`,
      impact: '解锁专属遗物/兵种',
    });
  } else {
    useGameStore.getState().updateExplorationProgress(newProgress);
  }
}

// 获取宇宙名称
export function getUniverseName(universe: UniverseType): string {
  const names: Record<UniverseType, string> = {
    mirror: '镜像宇宙',
    frozen: '冰封宇宙',
    inferno: '火焰宇宙',
    quantum: '量子宇宙',
    void: '虚空宇宙',
  };
  return names[universe];
}

// 获取当前宇宙的规则加成
export function getCurrentUniverseModifiers(state: GameState): {
  productionMult: number;
  combatMult: number;
} {
  if (!state.multiverse.currentUniverse) {
    return { productionMult: 1, combatMult: 1 };
  }

  switch (state.multiverse.currentUniverse) {
    case 'mirror':
      return { productionMult: 1, combatMult: 1 }; // 镜像：数值反转（复杂逻辑，简化处理）
    case 'frozen':
      return { productionMult: 0.2, combatMult: 3.0 }; // 产出-80%，兵力+200%
    case 'inferno':
      return { productionMult: 3.0, combatMult: 0.2 }; // 产出+200%，兵力-80%
    case 'quantum':
      return { productionMult: 1.5, combatMult: 1.5 }; // 量子：全+50%
    case 'void':
      return { productionMult: 0, combatMult: 1.0 }; // 虚空：无产出
    default:
      return { productionMult: 1, combatMult: 1 };
  }
}

// 检查多元宇宙主宰结局
export function checkMultiverseVictory(state: GameState): boolean {
  return state.multiverse.universes.every((u) => u.isCompleted);
}

// 获取多元宇宙进度
export function getMultiverseProgress(state: GameState): {
  total: number;
  completed: number;
  isExploring: boolean;
  currentProgress: number;
} {
  return {
    total: state.multiverse.universes.length,
    completed: state.multiverse.universes.filter((u) => u.isCompleted).length,
    isExploring: state.multiverse.currentUniverse !== null,
    currentProgress: state.multiverse.explorationProgress,
  };
}
