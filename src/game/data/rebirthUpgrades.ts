import type { RebirthUpgradeDef } from '@/game/types';

// 转生升级数据 - 使用转生货币购买的永久加成，分四大类
export const REBIRTH_UPGRADES: Record<string, RebirthUpgradeDef> = {
  // ============ 军事类 (military) ============
  militaryMight: {
    id: 'militaryMight',
    name: '军事力量',
    description: '提升所有兵种的攻击力，让帝国的军队更加强大',
    cost: 10,
    effect: '所有兵种攻击+5%每级',
    category: 'military',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  ironDefense: {
    id: 'ironDefense',
    name: '钢铁防御',
    description: '强化所有兵种的防御力，使军队坚不可摧',
    cost: 10,
    effect: '所有兵种防御+5%每级',
    category: 'military',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  battleHardened: {
    id: 'battleHardened',
    name: '百战精锐',
    description: '军队身经百战，生命值大幅提升',
    cost: 15,
    effect: '所有兵种生命值+8%每级',
    category: 'military',
    maxLevel: 15,
    costMultiplier: 1.6,
  },
  rapidProduction: {
    id: 'rapidProduction',
    name: '快速生产',
    description: '优化兵种生产流程，加快军队组建速度',
    cost: 12,
    effect: '兵种生产速度+5%每级',
    category: 'military',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  legendaryCommander: {
    id: 'legendaryCommander',
    name: '传奇指挥',
    description: '培养传奇指挥官，提升指挥官兵种战力',
    cost: 25,
    effect: '指挥官兵种属性+10%每级',
    category: 'military',
    maxLevel: 10,
    costMultiplier: 1.8,
  },
  mythAwakening: {
    id: 'mythAwakening',
    name: '神话觉醒',
    description: '唤醒沉睡的神话之力，强化神话兵种',
    cost: 30,
    effect: '神话兵种属性+8%每级',
    category: 'military',
    maxLevel: 15,
    costMultiplier: 1.7,
  },

  // ============ 经济类 (economy) ============
  resourceAbundance: {
    id: 'resourceAbundance',
    name: '资源丰饶',
    description: '提升所有基础资源的产量，帝国更加富庶',
    cost: 10,
    effect: '所有资源产量+5%每级',
    category: 'economy',
    maxLevel: 25,
    costMultiplier: 1.5,
  },
  goldenAge: {
    id: 'goldenAge',
    name: '黄金时代',
    description: '帝国进入黄金时代，金币产量大幅提升',
    cost: 12,
    effect: '金币产量+8%每级',
    category: 'economy',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  populationBoom: {
    id: 'populationBoom',
    name: '人口繁荣',
    description: '人口快速增长，提供更多劳动力',
    cost: 10,
    effect: '人口上限+10%每级，人口增长+5%每级',
    category: 'economy',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  tradeNetwork: {
    id: 'tradeNetwork',
    name: '贸易网络',
    description: '建立广泛的贸易网络，提升贸易效率',
    cost: 15,
    effect: '市场建筑效果+8%每级，资源兑换+3%每级',
    category: 'economy',
    maxLevel: 15,
    costMultiplier: 1.6,
  },
  efficientConstruction: {
    id: 'efficientConstruction',
    name: '高效建造',
    description: '改进建造技术，降低建筑和奇观成本',
    cost: 12,
    effect: '建筑成本-3%每级，建造速度+5%每级',
    category: 'economy',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  relicHunter: {
    id: 'relicHunter',
    name: '遗物猎手',
    description: '提升遗物掉落概率，收集更多神器',
    cost: 20,
    effect: '遗物掉落概率+5%每级',
    category: 'economy',
    maxLevel: 15,
    costMultiplier: 1.7,
  },

  // ============ 科技类 (tech) ============
  researchSpeed: {
    id: 'researchSpeed',
    name: '研究加速',
    description: '提升科技研究速度，更快解锁新内容',
    cost: 12,
    effect: '研究速度+8%每级',
    category: 'tech',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  knowledgeFlow: {
    id: 'knowledgeFlow',
    name: '知识涌流',
    description: '知识产量大幅提升，科研更加高效',
    cost: 10,
    effect: '知识产量+8%每级',
    category: 'tech',
    maxLevel: 25,
    costMultiplier: 1.5,
  },
  techCostReduction: {
    id: 'techCostReduction',
    name: '科技精研',
    description: '优化研究方法，降低科技成本',
    cost: 15,
    effect: '科技研究成本-4%每级',
    category: 'tech',
    maxLevel: 15,
    costMultiplier: 1.6,
  },
  wonderMaster: {
    id: 'wonderMaster',
    name: '奇观大师',
    description: '提升奇观效果，让奇迹更加辉煌',
    cost: 20,
    effect: '奇观效果+6%每级，奇观建造速度+5%每级',
    category: 'tech',
    maxLevel: 15,
    costMultiplier: 1.7,
  },
  ancientKnowledge: {
    id: 'ancientKnowledge',
    name: '远古知识',
    description: '解锁远古文明的秘密知识，获得额外加成',
    cost: 25,
    effect: '开局额外解锁1个科技每级',
    category: 'tech',
    maxLevel: 10,
    costMultiplier: 1.8,
  },
  instantResearch: {
    id: 'instantResearch',
    name: '瞬间研究',
    description: '转生后立即完成部分研究',
    cost: 30,
    effect: '转生后立即完成1项科技每级',
    category: 'tech',
    maxLevel: 5,
    costMultiplier: 2.0,
  },

  // ============ 扩张类 (expansion) ============
  territoryConqueror: {
    id: 'territoryConqueror',
    name: '领土征服者',
    description: '提升领土征服后的奖励，扩张更加有利可图',
    cost: 12,
    effect: '领土奖励+8%每级',
    category: 'expansion',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  rapidExpansion: {
    id: 'rapidExpansion',
    name: '快速扩张',
    description: '加快领土探索和征服速度',
    cost: 15,
    effect: '领土探索速度+10%每级',
    category: 'expansion',
    maxLevel: 15,
    costMultiplier: 1.6,
  },
  territoryBonus: {
    id: 'territoryBonus',
    name: '领土加成',
    description: '提升领土提供的持续加成效果',
    cost: 12,
    effect: '领土持续加成+6%每级',
    category: 'expansion',
    maxLevel: 20,
    costMultiplier: 1.5,
  },
  multiDimension: {
    id: 'multiDimension',
    name: '多维扩张',
    description: '解锁更多维度的领土，向天空、地下、太空扩张',
    cost: 30,
    effect: '解锁1个新维度领土每级',
    category: 'expansion',
    maxLevel: 4,
    costMultiplier: 2.5,
  },
  civilizationLegacy: {
    id: 'civilizationLegacy',
    name: '文明遗产',
    description: '保留更多文明遗产，转生后获得更强加成',
    cost: 25,
    effect: '转生后保留1个文明加成每级',
    category: 'expansion',
    maxLevel: 5,
    costMultiplier: 2.0,
  },
  startingBoost: {
    id: 'startingBoost',
    name: '起步加速',
    description: '转生后获得更多初始资源和建筑',
    cost: 15,
    effect: '转生后初始资源+20%每级，初始建筑等级+1每级',
    category: 'expansion',
    maxLevel: 10,
    costMultiplier: 1.7,
  },

  // ============ 转生货币获取类 ============
  rebirthCurrency: {
    id: 'rebirthCurrency',
    name: '转生精通',
    description: '提升转生时获得的转生货币数量',
    cost: 20,
    effect: '转生货币获取+15%每级',
    category: 'economy',
    maxLevel: 15,
    costMultiplier: 1.8,
  },
  earlyRebirth: {
    id: 'earlyRebirth',
    name: '提前转生',
    description: '降低转生门槛，更灵活地进行转生',
    cost: 25,
    effect: '转生条件-10%每级',
    category: 'expansion',
    maxLevel: 5,
    costMultiplier: 2.0,
  },
};

// 获取转生升级定义
export function getRebirthUpgrade(id: string): RebirthUpgradeDef | undefined {
  return REBIRTH_UPGRADES[id];
}

// 获取所有转生升级
export function getAllRebirthUpgrades(): RebirthUpgradeDef[] {
  return Object.values(REBIRTH_UPGRADES);
}

// 按类别获取转生升级
export function getRebirthUpgradesByCategory(category: string): RebirthUpgradeDef[] {
  return Object.values(REBIRTH_UPGRADES).filter((u) => u.category === category);
}

// 计算升级到指定等级的总成本
export function getRebirthUpgradeTotalCost(upgrade: RebirthUpgradeDef, fromLevel: number, toLevel: number): number {
  let total = 0;
  for (let level = fromLevel; level < toLevel; level++) {
    total += Math.ceil(upgrade.cost * Math.pow(upgrade.costMultiplier, level));
  }
  return total;
}

// 计算指定等级的单次升级成本
export function getRebirthUpgradeCost(upgrade: RebirthUpgradeDef, currentLevel: number): number {
  return Math.ceil(upgrade.cost * Math.pow(upgrade.costMultiplier, currentLevel));
}
