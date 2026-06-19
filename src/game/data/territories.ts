import type { TerritoryDef } from '@/game/types';

// 领地数据 - 不同维度的可征服领土，提供资源与战略加成
export const TERRITORIES: Record<string, TerritoryDef> = {
  // ============ 平原领地 ============
  fertilePlain: {
    id: 'fertilePlain',
    name: '肥沃平原',
    description: '广袤的冲积平原，土壤肥沃，适合大规模农业开发',
    type: 'plain',
    dimension: 'surface',
    x: 0,
    y: 0,
    defender: [{ class: 'infantry', count: 30 }],
    rewards: {
      resources: { food: 500, wood: 100 },
      bonus: { food: 5 },
    },
    modifications: [
      {
        id: 'irrigation',
        name: '灌溉系统',
        cost: { wood: 200, stone: 100 },
        resultBonus: { food: 10 },
      },
      {
        id: 'granary',
        name: '谷仓群',
        cost: { wood: 300, stone: 200 },
        resultBonus: { food: 15, population: 100 },
      },
    ],
  },
  goldenFields: {
    id: 'goldenFields',
    name: '金色麦田',
    description: '一望无际的金色麦浪，帝国的粮仓，养活万千子民',
    type: 'plain',
    dimension: 'surface',
    x: 1,
    y: 0,
    defender: [
      { class: 'infantry', count: 50 },
      { class: 'cavalry', count: 10 },
    ],
    rewards: {
      resources: { food: 1500, gold: 200 },
      bonus: { food: 20 },
      civilization: 'roman',
    },
    modifications: [
      {
        id: 'windmill',
        name: '风车磨坊',
        cost: { wood: 400, stone: 300, metal: 100 },
        resultBonus: { food: 30, gold: 5 },
      },
    ],
  },

  // ============ 森林领地 ============
  ancientForest: {
    id: 'ancientForest',
    name: '远古森林',
    description: '参天古木遮天蔽日，蕴藏丰富木材与神秘资源',
    type: 'forest',
    dimension: 'surface',
    x: -1,
    y: 0,
    defender: [{ class: 'archer', count: 25 }],
    rewards: {
      resources: { wood: 600, food: 200 },
      bonus: { wood: 6 },
    },
    modifications: [
      {
        id: 'sustainableLogging',
        name: '可持续伐木',
        cost: { stone: 150, metal: 50 },
        resultBonus: { wood: 12 },
      },
      {
        id: 'huntingGround',
        name: '狩猎场',
        cost: { wood: 100, stone: 100 },
        resultBonus: { food: 8, wood: 4 },
      },
    ],
  },
  mysticWoods: {
    id: 'mysticWoods',
    name: '秘境林地',
    description: '笼罩迷雾的神秘森林，传说精灵曾在此居住，藏有古老遗物',
    type: 'forest',
    dimension: 'surface',
    x: -2,
    y: 1,
    defender: [
      { class: 'archer', count: 40 },
      { class: 'infantry', count: 20 },
    ],
    rewards: {
      resources: { wood: 1000, knowledge: 100, relicFragment: 2 },
      bonus: { wood: 10, knowledge: 2 },
      civilization: 'mayan',
    },
    modifications: [
      {
        id: 'sacredGrove',
        name: '神圣树丛',
        cost: { wood: 300, gold: 200, knowledge: 50 },
        resultBonus: { knowledge: 5, relicFragment: 1 },
      },
    ],
  },

  // ============ 山地领地 ============
  ironMountains: {
    id: 'ironMountains',
    name: '铁血山脉',
    description: '富含铁矿的崇山峻岭，矿脉纵横，帝国的金属来源',
    type: 'mountain',
    dimension: 'surface',
    x: 0,
    y: -1,
    defender: [
      { class: 'infantry', count: 40 },
      { class: 'siege', count: 5 },
    ],
    rewards: {
      resources: { metal: 400, stone: 300 },
      bonus: { metal: 4, stone: 3 },
    },
    modifications: [
      {
        id: 'deepMine',
        name: '深井矿场',
        cost: { wood: 300, stone: 200, metal: 100 },
        resultBonus: { metal: 10 },
      },
      {
        id: 'fortress',
        name: '山巅要塞',
        cost: { stone: 500, metal: 200 },
        resultBonus: { stone: 5, population: 50 },
      },
    ],
  },
  dragonPeak: {
    id: 'dragonPeak',
    name: '巨龙之巅',
    description: '传说巨龙栖息的火山之巅，岩浆中蕴含稀有金属与星核碎片',
    type: 'mountain',
    dimension: 'surface',
    x: 1,
    y: -2,
    defender: [
      { class: 'myth', count: 1 },
      { class: 'infantry', count: 80 },
    ],
    rewards: {
      resources: { metal: 2000, gold: 1000, starCore: 1 },
      bonus: { metal: 20, gold: 10 },
      civilization: 'norse',
    },
    modifications: [
      {
        id: 'volcanoForge',
        name: '火山熔炉',
        cost: { stone: 1000, metal: 500, gold: 300 },
        resultBonus: { metal: 40, starCore: 1 },
      },
    ],
  },

  // ============ 沙漠领地 ============
  scorchingDesert: {
    id: 'scorchingDesert',
    name: '灼热沙漠',
    description: '黄沙漫天的死亡之地，地下却埋藏着石油与古老遗迹',
    type: 'desert',
    dimension: 'surface',
    x: 2,
    y: 1,
    defender: [
      { class: 'cavalry', count: 30 },
      { class: 'archer', count: 20 },
    ],
    rewards: {
      resources: { gold: 500, stone: 200 },
      bonus: { gold: 5 },
    },
    modifications: [
      {
        id: 'oasis',
        name: '绿洲开发',
        cost: { wood: 400, stone: 200 },
        resultBonus: { food: 8, gold: 3 },
      },
      {
        id: 'oilWell',
        name: '油井',
        cost: { metal: 500, stone: 300, gold: 200 },
        resultBonus: { gold: 20 },
      },
    ],
  },
  pharaohSands: {
    id: 'pharaohSands',
    name: '法老之沙',
    description: '金字塔矗立的古老沙漠，法老长眠之地，埋藏着文明的秘密',
    type: 'desert',
    dimension: 'surface',
    x: 3,
    y: 0,
    defender: [
      { class: 'infantry', count: 100 },
      { class: 'myth', count: 2 },
    ],
    rewards: {
      resources: { gold: 3000, knowledge: 500, relicFragment: 5 },
      bonus: { gold: 30, knowledge: 5 },
      civilization: 'egyptian',
    },
    modifications: [
      {
        id: 'tombExcavation',
        name: '陵墓发掘',
        cost: { stone: 1000, metal: 500, knowledge: 200 },
        resultBonus: { relicFragment: 3, gold: 50 },
      },
    ],
  },

  // ============ 海洋领地 ============
  coralSea: {
    id: 'coralSea',
    name: '珊瑚之海',
    description: '色彩斑斓的珊瑚海域，鱼群丰富，海底藏有珍珠与宝藏',
    type: 'ocean',
    dimension: 'ocean',
    x: 0,
    y: 2,
    defender: [{ class: 'infantry', count: 35 }],
    rewards: {
      resources: { food: 400, gold: 300 },
      bonus: { food: 4, gold: 3 },
    },
    modifications: [
      {
        id: 'pearlFarm',
        name: '珍珠养殖场',
        cost: { wood: 300, metal: 100 },
        resultBonus: { gold: 10 },
      },
      {
        id: 'fishingFleet',
        name: '捕鱼船队',
        cost: { wood: 400, metal: 200, gold: 100 },
        resultBonus: { food: 15 },
      },
    ],
  },
  abyssalTrench: {
    id: 'abyssalTrench',
    name: '深渊海沟',
    description: '阳光无法到达的深海沟壑，潜伏着远古海怪与未知文明遗迹',
    type: 'ocean',
    dimension: 'ocean',
    x: -1,
    y: 3,
    defender: [
      { class: 'myth', count: 2 },
      { class: 'infantry', count: 60 },
    ],
    rewards: {
      resources: { gold: 2000, knowledge: 300, geneSample: 3 },
      bonus: { gold: 15, knowledge: 3 },
      civilization: 'greek',
    },
    modifications: [
      {
        id: 'deepSeaLab',
        name: '深海实验室',
        cost: { metal: 800, gold: 500, knowledge: 300 },
        resultBonus: { geneSample: 2, knowledge: 10 },
      },
    ],
  },

  // ============ 天空领地 ============
  floatingIsles: {
    id: 'floatingIsles',
    name: '浮空群岛',
    description: '悬浮于云端的神秘岛屿，反重力矿石使其凌空，天空文明的摇篮',
    type: 'sky',
    dimension: 'sky',
    x: 0,
    y: 3,
    defender: [
      { class: 'archer', count: 50 },
      { class: 'cavalry', count: 20 },
    ],
    rewards: {
      resources: { knowledge: 500, gold: 800 },
      bonus: { knowledge: 5, gold: 5 },
    },
    modifications: [
      {
        id: 'skyHarbor',
        name: '天空港',
        cost: { metal: 600, wood: 400, gold: 300 },
        resultBonus: { gold: 15, knowledge: 3 },
      },
      {
        id: 'cloudForge',
        name: '云霄熔炉',
        cost: { metal: 800, stone: 400, knowledge: 200 },
        resultBonus: { metal: 15, knowledge: 5 },
      },
    ],
  },
  stormCitadel: {
    id: 'stormCitadel',
    name: '风暴城堡',
    description: '永恒雷暴中的空中堡垒，雷霆之力为其供能，雷神后裔的领地',
    type: 'sky',
    dimension: 'sky',
    x: 1,
    y: 4,
    defender: [
      { class: 'myth', count: 3 },
      { class: 'archer', count: 80 },
    ],
    rewards: {
      resources: { knowledge: 1000, gold: 1500, starCore: 2 },
      bonus: { knowledge: 10, gold: 10 },
      civilization: 'persian',
    },
    modifications: [
      {
        id: 'lightningReactor',
        name: '闪电反应堆',
        cost: { metal: 1500, gold: 1000, knowledge: 500 },
        resultBonus: { starCore: 1, knowledge: 20 },
      },
    ],
  },

  // ============ 地下领地 ============
  crystalCaverns: {
    id: 'crystalCaverns',
    name: '水晶洞窟',
    description: '闪烁着奇幻光芒的地下洞窟，能量水晶遍布，地下世界的瑰宝',
    type: 'underground',
    dimension: 'underground',
    x: 0,
    y: -3,
    defender: [
      { class: 'infantry', count: 45 },
      { class: 'archer', count: 15 },
    ],
    rewards: {
      resources: { metal: 500, stone: 400, knowledge: 200 },
      bonus: { metal: 5, knowledge: 2 },
    },
    modifications: [
      {
        id: 'crystalMine',
        name: '水晶矿场',
        cost: { wood: 300, metal: 200, stone: 200 },
        resultBonus: { metal: 10, knowledge: 3 },
      },
      {
        id: 'undergroundCity',
        name: '地下城',
        cost: { stone: 800, metal: 400, wood: 300 },
        resultBonus: { population: 200, stone: 5 },
      },
    ],
  },
  moltenCore: {
    id: 'moltenCore',
    name: '熔岩地核',
    description: '地心深处的熔岩世界，温度极高，蕴含无尽金属与地核能量',
    type: 'underground',
    dimension: 'underground',
    x: -1,
    y: -4,
    defender: [
      { class: 'myth', count: 2 },
      { class: 'siege', count: 30 },
    ],
    rewards: {
      resources: { metal: 3000, stone: 2000, starCore: 2 },
      bonus: { metal: 25, stone: 10 },
      civilization: 'chinese',
    },
    modifications: [
      {
        id: 'coreTap',
        name: '地核汲取',
        cost: { metal: 2000, stone: 1000, knowledge: 500 },
        resultBonus: { starCore: 2, metal: 30 },
      },
    ],
  },

  // ============ 太空领地 ============
  lunarBase: {
    id: 'lunarBase',
    name: '月球基地',
    description: '人类在月球的第一个永久定居点，氦-3资源丰富，星际跳板',
    type: 'space',
    dimension: 'space',
    x: 0,
    y: 5,
    defender: [
      { class: 'future', count: 10 },
      { class: 'infantry', count: 100 },
    ],
    rewards: {
      resources: { metal: 2000, knowledge: 1000, starCore: 3 },
      bonus: { knowledge: 10, starCore: 1 },
    },
    modifications: [
      {
        id: 'helium3Mine',
        name: '氦-3矿场',
        cost: { metal: 1500, gold: 1000, knowledge: 500 },
        resultBonus: { starCore: 2, knowledge: 15 },
      },
      {
        id: 'spaceport',
        name: '太空港',
        cost: { metal: 2000, stone: 1000, gold: 1500 },
        resultBonus: { gold: 30, knowledge: 10 },
      },
    ],
  },
  marsColony: {
    id: 'marsColony',
    name: '火星殖民地',
    description: '红色星球上的殖民城市，地球化改造进行中，人类第二家园',
    type: 'space',
    dimension: 'space',
    x: 1,
    y: 6,
    defender: [
      { class: 'future', count: 20 },
      { class: 'commander', count: 2 },
    ],
    rewards: {
      resources: { metal: 5000, knowledge: 3000, geneSample: 5, starCore: 5 },
      bonus: { knowledge: 20, geneSample: 1, starCore: 1 },
      civilization: 'mongol',
    },
    modifications: [
      {
        id: 'terraforming',
        name: '地球化改造',
        cost: { metal: 5000, gold: 3000, knowledge: 2000, geneSample: 10 },
        resultBonus: { food: 50, population: 500, knowledge: 30 },
      },
    ],
  },
  asteroidBelt: {
    id: 'asteroidBelt',
    name: '小行星带',
    description: '火星与木星之间的矿产宝库，无数金属小行星等待开采',
    type: 'space',
    dimension: 'space',
    x: 2,
    y: 7,
    defender: [
      { class: 'future', count: 30 },
      { class: 'siege', count: 50 },
    ],
    rewards: {
      resources: { metal: 10000, stone: 5000, gold: 3000, starCore: 3 },
      bonus: { metal: 50, stone: 20 },
    },
    modifications: [
      {
        id: 'automatedMiner',
        name: '自动化采矿站',
        cost: { metal: 3000, knowledge: 1000, gold: 2000 },
        resultBonus: { metal: 80, stone: 30 },
      },
    ],
  },
};

// 获取领地定义
export function getTerritory(id: string): TerritoryDef | undefined {
  return TERRITORIES[id];
}

// 获取所有领地
export function getAllTerritories(): TerritoryDef[] {
  return Object.values(TERRITORIES);
}

// 按类型获取领地
export function getTerritoriesByType(type: string): TerritoryDef[] {
  return Object.values(TERRITORIES).filter((t) => t.type === type);
}

// 按维度获取领地
export function getTerritoriesByDimension(dimension: string): TerritoryDef[] {
  return Object.values(TERRITORIES).filter((t) => t.dimension === dimension);
}

// 获取含文明遗产的领地
export function getTerritoriesWithCivilization(): TerritoryDef[] {
  return Object.values(TERRITORIES).filter((t) => t.rewards.civilization !== undefined);
}
