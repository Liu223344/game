// 放置帝国 - 生态系统平衡系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { GameState, BuildingType } from '@/game/types';

// 建筑对生态的影响（每级）
const BUILDING_ECOLOGY_IMPACT: Partial<Record<BuildingType, number>> = {
  lumberyard: -2,  // 伐木场
  quarry: -2,      // 采石场
  mine: -3,        // 矿场
  farm: -1,        // 农场
  workshop: -2,    // 工坊
  barracks: -1,    // 兵营
  archeryRange: -1,
  stable: -1,
  academy: 0,      // 学院无影响
  market: 0,       // 市场无影响
};

// 计算当前生态影响
export function calculateEcologyImpact(state: GameState): number {
  let impact = 0;
  Object.entries(state.buildings).forEach(([type, buildingState]) => {
    if (!buildingState.isActive || buildingState.level === 0) return;
    const ecoImpact = BUILDING_ECOLOGY_IMPACT[type as BuildingType];
    if (ecoImpact) {
      impact += ecoImpact * buildingState.level;
    }
  });

  // 奇观加成：神圣树林等恢复生态
  const ecoWonders = ['hanging_gardens', 'sacred_grove'];
  state.wonders.forEach((w) => {
    if (w.built && ecoWonders.includes(w.defId)) {
      impact += 5; // 每个生态奇观+5
    }
  });

  // 科技加成：生态学科技减少负面影响
  if (state.tech.researched.includes('ecology')) {
    impact *= 0.5; // 负面影响减半
  }

  return impact;
}

// 更新生态值（每tick调用）
export function updateEcology(deltaSeconds: number): void {
  const state = useGameStore.getState();
  const impact = calculateEcologyImpact(state);
  // 生态值每秒变化（impact为负数时下降）
  const change = impact * 0.001 * deltaSeconds; // 缓慢变化
  if (Math.abs(change) > 0.0001) {
    useGameStore.getState().modifyEcology(change);
  }

  // 检查生态事件
  checkEcologyEvents(useGameStore.getState());
}

// 获取生态等级
export function getEcologyLevel(state: GameState): { name: string; color: string } {
  const value = state.ecology.value;
  if (value >= 80) return { name: '生机盎然', color: 'text-green-400' };
  if (value >= 50) return { name: '生态平衡', color: 'text-green-300' };
  if (value >= 30) return { name: '生态受损', color: 'text-orange-400' };
  return { name: '荒漠化', color: 'text-red-400' };
}

// 获取生态对食物产出的影响倍数
export function getEcologyFoodMultiplier(state: GameState): number {
  const value = state.ecology.value;
  if (value >= 80) return 1.1;  // +10%
  if (value >= 50) return 1.0;  // 正常
  if (value >= 30) return 0.8;  // -20%
  return 0.5;                   // -50%
}

// 获取生态对人口增长的影响倍数
export function getEcologyPopulationMultiplier(state: GameState): number {
  const value = state.ecology.value;
  if (value >= 80) return 1.2;
  if (value >= 50) return 1.0;
  if (value >= 30) return 0.7;
  return 0.3;
}

// 检查生态事件
export function checkEcologyEvents(state: GameState): void {
  const value = state.ecology.value;

  // 生态良好触发野生动物增益
  if (value >= 80 && Math.random() < 0.002) {
    useGameStore.getState().addResource('food', 50);
    useUIStore.getState().addNotification({
      type: 'success',
      message: '生态环境优良，野生动物繁衍，食物+50',
    });
    useGameStore.getState().recordChronicle({
      category: 'culture',
      title: '生态繁荣',
      description: '生态环境优良，野生动物繁衍，获得额外食物',
      impact: '食物+50',
    });
  }

  // 生态恶劣触发荒漠化
  if (value < 30 && Math.random() < 0.003) {
    const owned = state.territories.filter((t) => t.owned && !state.ecology.degradedTerritories.includes(t.defId));
    if (owned.length > 0) {
      const target = owned[Math.floor(Math.random() * owned.length)];
      useGameStore.getState().addDegradedTerritory(target.defId);
      useUIStore.getState().addNotification({
        type: 'error',
        message: `${target.defId}发生荒漠化，产出永久下降！`,
      });
      useGameStore.getState().recordChronicle({
        category: 'disaster',
        title: '荒漠化',
        description: `${target.defId}因生态恶化发生荒漠化`,
        impact: '该领地产出永久-10%',
      });
    }
  }
}

// 恢复生态（通过科技或奇观）
export function restoreEcology(amount: number): void {
  useGameStore.getState().modifyEcology(amount);
  useUIStore.getState().addNotification({
    type: 'info',
    message: `生态恢复+${amount}`,
  });
}
