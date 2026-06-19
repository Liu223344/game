// 放置帝国 - 灾害链式反应系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { Disaster, DisasterType } from '@/game/types';

// 灾害定义
const DISASTER_DEFS: Record<DisasterType, { name: string; icon: string; maxStage: number; chain: string[] }> = {
  earthquake: {
    name: '地震',
    icon: '🌋',
    maxStage: 3,
    chain: ['建筑损坏', '人口流离', '产出下降'],
  },
  tsunami: {
    name: '海啸',
    icon: '🌊',
    maxStage: 3,
    chain: ['沿海淹没', '渔业破坏', '食物短缺'],
  },
  plague: {
    name: '瘟疫',
    icon: '🦠',
    maxStage: 4,
    chain: ['人口减少', '劳动力不足', '产出下降', '经济崩溃'],
  },
  famine: {
    name: '饥荒',
    icon: '🍽️',
    maxStage: 2,
    chain: ['食物短缺', '人口流失'],
  },
  volcano: {
    name: '火山爆发',
    icon: '🌋',
    maxStage: 3,
    chain: ['岩浆吞噬', '大气遮蔽', '全球降温'],
  },
  meteor: {
    name: '陨石撞击',
    icon: '☄️',
    maxStage: 4,
    chain: ['撞击毁灭', '大气遮蔽', '全球降温', '农业减产'],
  },
  ai_rebellion: {
    name: 'AI叛乱',
    icon: '🤖',
    maxStage: 3,
    chain: ['系统失控', '自动设施瘫痪', '兵力叛变'],
  },
};

// 触发灾害
export function triggerDisaster(type: DisasterType, intensity: number): void {
  const def = DISASTER_DEFS[type];
  const disaster: Disaster = {
    id: `disaster_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    name: def.name,
    intensity: Math.min(10, Math.max(1, intensity)),
    stage: 0,
    maxStage: def.maxStage,
    daysLeft: 30, // 每阶段30天
    isActive: true,
  };
  useGameStore.getState().addDisaster(disaster);

  useUIStore.getState().addNotification({
    type: 'error',
    message: `${def.icon} ${def.name}爆发！强度${intensity}/10`,
  });
  useGameStore.getState().recordChronicle({
    category: 'disaster',
    title: `${def.name}爆发`,
    description: `一场强度${intensity}的${def.name}袭击了帝国`,
    impact: `链式反应：${def.chain.join('→')}`,
  });
}

// 随机触发灾害（每tick调用）
export function checkRandomDisaster(deltaSeconds: number): void {
  const state = useGameStore.getState();
  // 已有活跃灾害时不触发新的
  if (state.disasters.some((d) => d.isActive)) return;

  // 基础概率，随时代提升
  const baseChance = 0.0001 * deltaSeconds;
  const eraBonus = Math.floor(state.tech.researched.length / 10) * 0.00005;
  const chance = baseChance + eraBonus;

  if (Math.random() > chance) return;

  // 根据条件选择灾害类型
  const types: DisasterType[] = ['earthquake', 'famine', 'plague'];
  if (state.tech.researched.includes('ai_computing')) {
    types.push('ai_rebellion');
  }
  if (state.territories.some((t) => t.owned)) {
    types.push('tsunami');
    types.push('volcano');
  }
  if (state.tech.researched.includes('astronomy')) {
    types.push('meteor');
  }

  const type = types[Math.floor(Math.random() * types.length)];
  const intensity = 1 + Math.floor(Math.random() * 5) + Math.floor(state.tech.researched.length / 5);
  triggerDisaster(type, intensity);
}

// 更新灾害（每tick调用）
export function updateDisasters(deltaSeconds: number): void {
  const state = useGameStore.getState();
  state.disasters.forEach((disaster) => {
    if (!disaster.isActive) return;

    const newDaysLeft = disaster.daysLeft - deltaSeconds;
    if (newDaysLeft > 0) {
      useGameStore.getState().updateDisaster(disaster.id, { daysLeft: newDaysLeft });
      return;
    }

    // 阶段推进
    const def = DISASTER_DEFS[disaster.type];
    const newStage = disaster.stage + 1;

    if (newStage >= disaster.maxStage) {
      // 灾害结束
      useGameStore.getState().updateDisaster(disaster.id, { isActive: false, stage: newStage });
      useGameStore.getState().removeDisaster(disaster.id);
      useUIStore.getState().addNotification({
        type: 'info',
        message: `${def.icon} ${def.name}的影响逐渐消退`,
      });
      return;
    }

    // 应用当前阶段效果
    applyDisasterStageEffect(disaster, newStage);
    useGameStore.getState().updateDisaster(disaster.id, {
      stage: newStage,
      daysLeft: 30,
    });
  });
}

// 应用灾害阶段效果
function applyDisasterStageEffect(disaster: Disaster, stage: number): void {
  const state = useGameStore.getState();
  const intensityFactor = disaster.intensity / 10;
  const def = DISASTER_DEFS[disaster.type];
  const stageName = def.chain[stage] || '影响';

  useUIStore.getState().addNotification({
    type: 'warning',
    message: `${def.icon} ${def.name}链式反应：${stageName}`,
  });

  switch (disaster.type) {
    case 'earthquake':
      if (stage === 1) {
        // 建筑损坏：随机降低一些建筑等级
        const buildingTypes = Object.keys(state.buildings) as Array<keyof typeof state.buildings>;
        const target = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        const building = state.buildings[target];
        if (building.level > 0) {
          useGameStore.setState((s) => ({
            buildings: {
              ...s.buildings,
              [target]: { ...building, level: Math.max(0, building.level - 1) },
            },
          }));
        }
      } else if (stage === 2) {
        // 人口流离
        const loss = Math.floor(state.resources.population * 0.1 * intensityFactor);
        useGameStore.getState().addResource('population', -loss);
      }
      break;

    case 'tsunami':
      if (stage === 1) {
        // 沿海淹没：失去一个领地
        const owned = state.territories.filter((t) => t.owned);
        if (owned.length > 0) {
          const target = owned[0];
          useGameStore.setState((s) => ({
            territories: s.territories.map((t) =>
              t.defId === target.defId ? { ...t, owned: false } : t
            ),
          }));
        }
      } else if (stage === 2) {
        // 渔业破坏：食物大减
        const loss = Math.floor(state.resources.food * 0.2 * intensityFactor);
        useGameStore.getState().addResource('food', -loss);
      }
      break;

    case 'plague':
      if (stage === 1) {
        // 人口减少
        const loss = Math.floor(state.resources.population * 0.15 * intensityFactor);
        useGameStore.getState().addResource('population', -loss);
      } else if (stage === 2) {
        // 产出下降：合法性下降
        useGameStore.getState().modifyLegitimacy(-5 * intensityFactor, '瘟疫');
      }
      break;

    case 'famine':
      if (stage === 1) {
        // 食物短缺
        const loss = Math.floor(state.resources.food * 0.3 * intensityFactor);
        useGameStore.getState().addResource('food', -loss);
      } else if (stage === 2) {
        // 人口流失
        const loss = Math.floor(state.resources.population * 0.1 * intensityFactor);
        useGameStore.getState().addResource('population', -loss);
      }
      break;

    case 'ai_rebellion':
      if (stage === 1) {
        // 自动设施瘫痪
        useGameStore.setState((s) => {
          const buildings = { ...s.buildings };
          Object.keys(buildings).forEach((key) => {
            const k = key as keyof typeof buildings;
            if (buildings[k].isActive) {
              buildings[k] = { ...buildings[k], isActive: false };
            }
          });
          return { buildings };
        });
      } else if (stage === 2) {
        // 兵力叛变
        const loss = Math.floor(state.troops.reduce((sum, t) => sum + t.count, 0) * 0.2 * intensityFactor);
        useGameStore.setState((s) => ({
          troops: s.troops.map((t) => ({
            ...t,
            count: Math.max(0, t.count - Math.floor(t.count * 0.2 * intensityFactor)),
          })),
        }));
        void loss; // 避免未使用变量
      }
      break;

    default:
      // 通用效果：资源损失
      const foodLoss = Math.floor(state.resources.food * 0.1 * intensityFactor);
      useGameStore.getState().addResource('food', -foodLoss);
      break;
  }
}

// 应急响应（消耗资源立即止血）
export function emergencyResponse(disasterId: string): boolean {
  const state = useGameStore.getState();
  const disaster = state.disasters.find((d) => d.id === disasterId);
  if (!disaster || !disaster.isActive) return false;

  const cost = disaster.intensity * 100;
  if (state.resources.gold < cost) return false;

  useGameStore.getState().spendResource('gold', cost);
  useGameStore.getState().removeDisaster(disasterId);
  useGameStore.getState().modifyLegitimacy(3, '有效应对灾害');

  useUIStore.getState().addNotification({
    type: 'success',
    message: `应急响应成功！${disaster.name}影响被遏制`,
  });
  useGameStore.getState().recordChronicle({
    category: 'disaster',
    title: '灾害应对',
    description: `投入${cost}金币有效应对${disaster.name}`,
    impact: '灾害结束，合法性+3',
  });
  return true;
}

// 获取灾害信息
export function getDisasterInfo(type: DisasterType): { name: string; icon: string; chain: string[] } {
  const def = DISASTER_DEFS[type];
  return { name: def.name, icon: def.icon, chain: def.chain };
}
