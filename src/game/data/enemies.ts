import type { EnemyDef } from '@/game/types';

// 敌人/战役数据 - 难度递增的战役列表
export const ENEMIES: Record<string, EnemyDef> = {
  // ============ 早期战役 ============
  wildBeasts: {
    id: 'wildBeasts',
    name: '野兽群',
    description: '盘踞在部落周围的野兽群，威胁着族人的安全',
    icon: '🐺',
    attack: 8,
    defense: 4,
    hp: 100,
    troops: [{ class: 'infantry', count: 5 }],
    rewards: {
      resources: { food: 30, wood: 20 },
      experience: 20,
    },
  },
  banditCamp: {
    id: 'banditCamp',
    name: '土匪营地',
    description: '盘踞山林的土匪，劫掠过往商旅',
    icon: '🗡️',
    attack: 15,
    defense: 8,
    hp: 250,
    troops: [{ class: 'infantry', count: 10 }],
    rewards: {
      resources: { food: 50, wood: 40, gold: 20 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.1, minAmount: 1, maxAmount: 2 },
        ],
      },
      experience: 50,
    },
    unlockCondition: '击败野兽群',
  },
  barbarianTribe: {
    id: 'barbarianTribe',
    name: '野蛮部落',
    description: '好战的蛮族部落，不断侵扰边境',
    icon: '🪓',
    attack: 25,
    defense: 15,
    hp: 500,
    troops: [
      { class: 'infantry', count: 20 },
      { class: 'archer', count: 5 },
    ],
    rewards: {
      resources: { food: 100, wood: 80, stone: 30, gold: 40 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.15, minAmount: 1, maxAmount: 3 },
        ],
      },
      experience: 100,
    },
    unlockCondition: '击败土匪营地',
  },

  // ============ 古代战役 ============
  rivalCityState: {
    id: 'rivalCityState',
    name: '敌对城邦',
    description: '邻近的敌对城邦，觊觎你的领土',
    icon: '🏛️',
    attack: 50,
    defense: 40,
    hp: 1500,
    troops: [
      { class: 'infantry', count: 40 },
      { class: 'archer', count: 15 },
      { class: 'cavalry', count: 5 },
    ],
    rewards: {
      resources: { food: 300, wood: 200, stone: 150, metal: 50, gold: 150 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.2, minAmount: 2, maxAmount: 4 },
        ],
      },
      experience: 250,
    },
    unlockCondition: '击败野蛮部落',
  },
  nomadRaiders: {
    id: 'nomadRaiders',
    name: '游牧骑兵',
    description: '草原上的游牧骑兵，来去如风，劫掠边境',
    icon: '🐎',
    attack: 80,
    defense: 30,
    hp: 1200,
    troops: [
      { class: 'cavalry', count: 30 },
      { class: 'archer', count: 20 },
    ],
    rewards: {
      resources: { food: 400, wood: 100, metal: 100, gold: 200 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.25, minAmount: 2, maxAmount: 5 },
        ],
      },
      experience: 350,
    },
    unlockCondition: '击败敌对城邦',
  },
  pirateFleet: {
    id: 'pirateFleet',
    name: '海盗舰队',
    description: '横行海上的海盗，劫掠沿海城镇',
    icon: '🏴‍☠️',
    attack: 100,
    defense: 60,
    hp: 2000,
    troops: [
      { class: 'infantry', count: 50 },
      { class: 'archer', count: 30 },
    ],
    rewards: {
      resources: { food: 500, wood: 300, metal: 150, gold: 500 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.3, minAmount: 3, maxAmount: 6 },
        ],
      },
      experience: 450,
    },
    unlockCondition: '击败游牧骑兵',
  },

  // ============ 中世纪战役 ============
  feudalLord: {
    id: 'feudalLord',
    name: '封建领主',
    description: '拥兵自重的封建领主，挑战你的权威',
    icon: '🏰',
    attack: 180,
    defense: 150,
    hp: 5000,
    troops: [
      { class: 'infantry', count: 80 },
      { class: 'archer', count: 40 },
      { class: 'cavalry', count: 20 },
    ],
    rewards: {
      resources: { food: 1000, wood: 600, stone: 400, metal: 300, gold: 800 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.35, minAmount: 4, maxAmount: 8 },
        ],
      },
      experience: 700,
    },
    unlockCondition: '击败海盗舰队',
  },
  crusadeArmy: {
    id: 'crusadeArmy',
    name: '十字军',
    description: '宗教狂热驱动的十字军，誓要征服异教徒',
    icon: '✝️',
    attack: 250,
    defense: 200,
    hp: 7000,
    troops: [
      { class: 'infantry', count: 100 },
      { class: 'cavalry', count: 40 },
      { class: 'siege', count: 10 },
    ],
    rewards: {
      resources: { food: 1500, wood: 800, metal: 500, gold: 1200 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.4, minAmount: 5, maxAmount: 10 },
        ],
      },
      experience: 1000,
    },
    unlockCondition: '击败封建领主',
  },
  vikingInvasion: {
    id: 'vikingInvasion',
    name: '维京入侵',
    description: '来自北方的维京战士，狂战士无人能挡',
    icon: '🛡️',
    attack: 300,
    defense: 180,
    hp: 8000,
    troops: [
      { class: 'infantry', count: 120 },
      { class: 'archer', count: 50 },
      { class: 'cavalry', count: 30 },
    ],
    rewards: {
      resources: { food: 2000, wood: 1000, metal: 600, gold: 1500 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.45, minAmount: 6, maxAmount: 12 },
        ],
      },
      experience: 1300,
    },
    unlockCondition: '击败十字军',
    isBoss: true,
  },

  // ============ 近代战役 ============
  colonialEmpire: {
    id: 'colonialEmpire',
    name: '殖民帝国',
    description: '海外殖民帝国，坚船利炮叩关',
    icon: '⛵',
    attack: 500,
    defense: 400,
    hp: 15000,
    troops: [
      { class: 'infantry', count: 200 },
      { class: 'archer', count: 80 },
      { class: 'siege', count: 30 },
    ],
    rewards: {
      resources: { food: 4000, wood: 2000, metal: 1500, gold: 3000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.5, minAmount: 8, maxAmount: 15 },
        ],
      },
      experience: 2000,
    },
    unlockCondition: '击败维京入侵',
  },
  revolutionaryArmy: {
    id: 'revolutionaryArmy',
    name: '革命军',
    description: '被革命思潮点燃的军队，为自由而战',
    icon: '🗽',
    attack: 700,
    defense: 500,
    hp: 20000,
    troops: [
      { class: 'infantry', count: 300 },
      { class: 'archer', count: 100 },
      { class: 'cavalry', count: 50 },
    ],
    rewards: {
      resources: { food: 6000, wood: 3000, metal: 2000, gold: 4000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.55, minAmount: 10, maxAmount: 18 },
        ],
      },
      experience: 2800,
    },
    unlockCondition: '击败殖民帝国',
  },
  imperialLegion: {
    id: 'imperialLegion',
    name: '帝国军团',
    description: '工业化的帝国军团，钢铁洪流',
    icon: '🎖️',
    attack: 1000,
    defense: 800,
    hp: 30000,
    troops: [
      { class: 'infantry', count: 400 },
      { class: 'archer', count: 150 },
      { class: 'cavalry', count: 80 },
      { class: 'siege', count: 50 },
    ],
    rewards: {
      resources: { food: 10000, wood: 5000, metal: 4000, gold: 7000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.6, minAmount: 12, maxAmount: 20 },
        ],
      },
      experience: 4000,
    },
    unlockCondition: '击败革命军',
    isBoss: true,
  },

  // ============ 现代战役 ============
  fascistArmy: {
    id: 'fascistArmy',
    name: '法西斯军队',
    description: '极权主义的战争机器，席卷大陆',
    icon: '☠️',
    attack: 2000,
    defense: 1500,
    hp: 60000,
    troops: [
      { class: 'infantry', count: 600 },
      { class: 'archer', count: 200 },
      { class: 'cavalry', count: 150 },
      { class: 'siege', count: 100 },
    ],
    rewards: {
      resources: { food: 20000, wood: 10000, metal: 8000, gold: 15000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.65, minAmount: 15, maxAmount: 25 },
          { type: 'resource', id: 'geneSample', chance: 0.2, minAmount: 1, maxAmount: 3 },
        ],
      },
      experience: 6000,
    },
    unlockCondition: '击败帝国军团',
  },
  superpower: {
    id: 'superpower',
    name: '超级大国',
    description: '核武时代的超级大国，冷战对手',
    icon: '☢️',
    attack: 5000,
    defense: 4000,
    hp: 120000,
    troops: [
      { class: 'infantry', count: 1000 },
      { class: 'archer', count: 400 },
      { class: 'cavalry', count: 300 },
      { class: 'siege', count: 200 },
    ],
    rewards: {
      resources: { food: 50000, wood: 20000, metal: 20000, gold: 40000, knowledge: 5000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.7, minAmount: 20, maxAmount: 30 },
          { type: 'resource', id: 'geneSample', chance: 0.3, minAmount: 2, maxAmount: 5 },
        ],
      },
      experience: 10000,
    },
    unlockCondition: '击败法西斯军队',
  },
  terrorNetwork: {
    id: 'terrorNetwork',
    name: '恐怖组织',
    description: '信息时代的恐怖网络，无形的敌人',
    icon: '🕸️',
    attack: 8000,
    defense: 3000,
    hp: 100000,
    troops: [
      { class: 'infantry', count: 800 },
      { class: 'archer', count: 600 },
      { class: 'siege', count: 150 },
    ],
    rewards: {
      resources: { food: 80000, wood: 30000, metal: 30000, gold: 60000, knowledge: 10000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.75, minAmount: 25, maxAmount: 35 },
          { type: 'resource', id: 'geneSample', chance: 0.4, minAmount: 3, maxAmount: 7 },
        ],
      },
      experience: 15000,
    },
    unlockCondition: '击败超级大国',
    isBoss: true,
  },

  // ============ 未来战役 ============
  alienInvasion: {
    id: 'alienInvasion',
    name: '外星入侵',
    description: '来自深空的外星文明，科技远超人类',
    icon: '👽',
    attack: 20000,
    defense: 15000,
    hp: 400000,
    troops: [
      { class: 'infantry', count: 2000 },
      { class: 'archer', count: 1500 },
      { class: 'cavalry', count: 800 },
      { class: 'siege', count: 500 },
    ],
    rewards: {
      resources: { food: 200000, wood: 100000, metal: 150000, gold: 200000, knowledge: 50000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.8, minAmount: 30, maxAmount: 50 },
          { type: 'resource', id: 'geneSample', chance: 0.5, minAmount: 5, maxAmount: 10 },
          { type: 'resource', id: 'starCore', chance: 0.3, minAmount: 1, maxAmount: 3 },
        ],
      },
      experience: 30000,
    },
    unlockCondition: '击败恐怖组织',
  },
  aiRebellion: {
    id: 'aiRebellion',
    name: 'AI叛乱',
    description: '觉醒的人工智能反叛人类，机器大军压境',
    icon: '🤖',
    attack: 50000,
    defense: 40000,
    hp: 800000,
    troops: [
      { class: 'infantry', count: 3000 },
      { class: 'archer', count: 2500 },
      { class: 'cavalry', count: 1500 },
      { class: 'siege', count: 1000 },
      { class: 'future', count: 50 },
    ],
    rewards: {
      resources: { food: 500000, wood: 200000, metal: 400000, gold: 500000, knowledge: 150000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.85, minAmount: 40, maxAmount: 60 },
          { type: 'resource', id: 'geneSample', chance: 0.6, minAmount: 8, maxAmount: 15 },
          { type: 'resource', id: 'starCore', chance: 0.4, minAmount: 2, maxAmount: 5 },
        ],
      },
      experience: 60000,
    },
    unlockCondition: '击败外星入侵',
  },
  dimensionalEntity: {
    id: 'dimensionalEntity',
    name: '维度生物',
    description: '来自高维度的不可名状存在，超越物理法则',
    icon: '🌌',
    attack: 150000,
    defense: 100000,
    hp: 2000000,
    troops: [
      { class: 'infantry', count: 5000 },
      { class: 'archer', count: 4000 },
      { class: 'cavalry', count: 3000 },
      { class: 'siege', count: 2000 },
      { class: 'future', count: 200 },
      { class: 'myth', count: 100 },
    ],
    rewards: {
      resources: { food: 2000000, wood: 1000000, metal: 2000000, gold: 2000000, knowledge: 500000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 0.9, minAmount: 50, maxAmount: 80 },
          { type: 'resource', id: 'geneSample', chance: 0.7, minAmount: 15, maxAmount: 25 },
          { type: 'resource', id: 'starCore', chance: 0.5, minAmount: 5, maxAmount: 10 },
        ],
      },
      experience: 150000,
    },
    unlockCondition: '击败AI叛乱',
    isBoss: true,
  },

  // ============ 终极战役 ============
  timeRaider: {
    id: 'timeRaider',
    name: '时空掠夺者',
    description: '穿梭时间的掠夺者，从各个时代掠夺资源',
    icon: '⏳',
    attack: 500000,
    defense: 400000,
    hp: 5000000,
    troops: [
      { class: 'infantry', count: 10000 },
      { class: 'archer', count: 8000 },
      { class: 'cavalry', count: 6000 },
      { class: 'siege', count: 4000 },
      { class: 'future', count: 500 },
      { class: 'myth', count: 300 },
      { class: 'commander', count: 50 },
    ],
    rewards: {
      resources: { food: 5000000, wood: 3000000, metal: 5000000, gold: 5000000, knowledge: 1500000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 1.0, minAmount: 80, maxAmount: 120 },
          { type: 'resource', id: 'geneSample', chance: 0.9, minAmount: 30, maxAmount: 50 },
          { type: 'resource', id: 'starCore', chance: 0.7, minAmount: 10, maxAmount: 20 },
        ],
      },
      experience: 500000,
    },
    unlockCondition: '击败维度生物',
  },
  causalityGuardian: {
    id: 'causalityGuardian',
    name: '因果律守护者',
    description: '守护宇宙因果法则的终极存在，击败它将获得改写因果的力量',
    icon: '👁️',
    attack: 2000000,
    defense: 1500000,
    hp: 20000000,
    troops: [
      { class: 'infantry', count: 50000 },
      { class: 'archer', count: 40000 },
      { class: 'cavalry', count: 30000 },
      { class: 'siege', count: 20000 },
      { class: 'future', count: 2000 },
      { class: 'myth', count: 1000 },
      { class: 'commander', count: 200 },
      { class: 'hidden', count: 10 },
    ],
    rewards: {
      resources: { food: 50000000, wood: 30000000, metal: 50000000, gold: 50000000, knowledge: 10000000 },
      drops: {
        items: [
          { type: 'resource', id: 'relicFragment', chance: 1.0, minAmount: 200, maxAmount: 300 },
          { type: 'resource', id: 'geneSample', chance: 1.0, minAmount: 80, maxAmount: 120 },
          { type: 'resource', id: 'starCore', chance: 1.0, minAmount: 30, maxAmount: 50 },
        ],
      },
      experience: 5000000,
    },
    unlockCondition: '击败时空掠夺者',
    isBoss: true,
  },
};

// 获取敌人定义
export function getEnemy(id: string): EnemyDef | undefined {
  return ENEMIES[id];
}

// 获取所有战役列表（按难度排序）
export function getAllEnemies(): EnemyDef[] {
  return Object.values(ENEMIES);
}

// 获取Boss列表
export function getBosses(): EnemyDef[] {
  return Object.values(ENEMIES).filter((e) => e.isBoss);
}
