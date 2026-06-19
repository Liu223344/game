import type { BuildingDef } from '@/game/types';

export const BUILDINGS: Record<string, BuildingDef> = {
  farm: {
    id: 'farm',
    name: '农场',
    description: '生产食物，养活你的人口和军队',
    icon: '🌾',
    produces: 'food',
    baseProduction: 0.5, // 每秒
    baseCost: { wood: 10 },
    costMultiplier: 1.5,
    category: 'resource',
  },
  lumberyard: {
    id: 'lumberyard',
    name: '伐木场',
    description: '采伐木材，建筑的基础材料',
    icon: '🪵',
    produces: 'wood',
    baseProduction: 0.5,
    baseCost: { food: 10 },
    costMultiplier: 1.5,
    category: 'resource',
  },
  quarry: {
    id: 'quarry',
    name: '采石场',
    description: '开采石头，用于高级建筑',
    icon: '🪨',
    produces: 'stone',
    baseProduction: 0.3,
    baseCost: { wood: 20, food: 10 },
    costMultiplier: 1.6,
    category: 'resource',
  },
  mine: {
    id: 'mine',
    name: '矿场',
    description: '挖掘金属，制造武器装备',
    icon: '⛏️',
    produces: 'metal',
    baseProduction: 0.2,
    baseCost: { wood: 30, stone: 15 },
    costMultiplier: 1.7,
    unlockTech: 'mining',
    category: 'resource',
  },
  barracks: {
    id: 'barracks',
    name: '兵营',
    description: '训练步兵，帝国的军事基础',
    icon: '🏰',
    baseProduction: 0,
    baseCost: { wood: 50, stone: 20 },
    costMultiplier: 1.8,
    category: 'military',
  },
  archeryRange: {
    id: 'archeryRange',
    name: '靶场',
    description: '训练弓箭手，远程打击力量',
    icon: '🏹',
    baseProduction: 0,
    baseCost: { wood: 80, stone: 30, metal: 10 },
    costMultiplier: 1.8,
    unlockTech: 'archery',
    category: 'military',
  },
  stable: {
    id: 'stable',
    name: '马厩',
    description: '训练骑兵，高机动突击力量',
    icon: '🐎',
    baseProduction: 0,
    baseCost: { wood: 100, stone: 40, metal: 20, food: 50 },
    costMultiplier: 1.9,
    unlockTech: 'riding',
    category: 'military',
  },
  academy: {
    id: 'academy',
    name: '学院',
    description: '生产知识，推动科技发展',
    icon: '📚',
    produces: 'knowledge',
    baseProduction: 0.1,
    baseCost: { wood: 60, stone: 40, gold: 20 },
    costMultiplier: 2.0,
    unlockTech: 'writing',
    category: 'resource',
  },
  market: {
    id: 'market',
    name: '市场',
    description: '产生金币，促进经济繁荣',
    icon: '🏪',
    produces: 'gold',
    baseProduction: 0.3,
    baseCost: { wood: 50, stone: 30, food: 30 },
    costMultiplier: 1.8,
    unlockTech: 'trade',
    category: 'resource',
  },
  workshop: {
    id: 'workshop',
    name: '工坊',
    description: '制造高级兵种和装备',
    icon: '🔧',
    baseProduction: 0,
    baseCost: { wood: 200, stone: 100, metal: 80, gold: 50 },
    costMultiplier: 2.0,
    unlockTech: 'industry',
    category: 'military',
  },
};

// 计算建筑升级成本
export function getBuildingCost(building: BuildingDef, currentLevel: number): Partial<Record<string, number>> {
  const cost: Partial<Record<string, number>> = {};
  const multiplier = Math.pow(building.costMultiplier, currentLevel);
  for (const [resource, amount] of Object.entries(building.baseCost)) {
    cost[resource] = Math.ceil((amount as number) * multiplier);
  }
  return cost;
}

// 计算建筑产量
export function getBuildingProduction(building: BuildingDef, level: number): number {
  if (!building.produces) return 0;
  return building.baseProduction * level * (1 + (level - 1) * 0.1);
}
