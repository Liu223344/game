import type { WonderDef } from '@/game/types';

// 奇观数据 - 跨越时代的宏伟建筑，提供强大加成
export const WONDERS: Record<string, WonderDef> = {
  // ============ 古代奇观 ============
  pyramid: {
    id: 'pyramid',
    name: '金字塔',
    description: '法老的永恒陵墓，数百万巨石堆砌的不朽奇迹，象征文明的永恒',
    icon: '🔺',
    cost: { stone: 5000, metal: 1000, gold: 2000, food: 5000 },
    buildTime: 3600,
    effect: '所有资源建筑产量+10%，人口上限+200',
    effectBonus: { food: 2, wood: 2, stone: 2, metal: 2, gold: 2, population: 200 },
    synergyWith: 'greatWall',
    synergyEffect: '永恒防御：金字塔与长城共鸣，所有兵种防御+25%',
    unlockTech: 'bronzeWorking',
  },
  greatWall: {
    id: 'greatWall',
    name: '长城',
    description: '蜿蜒万里的防御工事，抵御北方游牧民族的钢铁屏障',
    icon: '🧱',
    cost: { stone: 8000, wood: 3000, metal: 1500, food: 4000 },
    buildTime: 5400,
    effect: '所有兵种防御+20%，领土防御力+50%',
    effectBonus: { population: 300, stone: 1 },
    synergyWith: 'pyramid',
    synergyEffect: '永恒防御：长城与金字塔共鸣，所有兵种防御+25%',
    unlockTech: 'ironWorking',
  },
  hangingGardens: {
    id: 'hangingGardens',
    name: '空中花园',
    description: '巴比伦的悬空绿洲，层层叠翠的奇迹花园，沙漠中的生命绿洲',
    icon: '🌿',
    cost: { wood: 4000, stone: 3000, gold: 1500, food: 3000 },
    buildTime: 3600,
    effect: '食物产量+25%，人口上限+500',
    effectBonus: { food: 8, population: 500 },
    synergyWith: 'greatLibrary',
    synergyEffect: '文明摇篮：空中花园与大图书馆共鸣，知识产量+40%',
    unlockTech: 'bronzeWorking',
  },
  greatLibrary: {
    id: 'greatLibrary',
    name: '大图书馆',
    description: '亚历山大港的知识圣殿，汇聚天下典籍，文明的智慧灯塔',
    icon: '📚',
    cost: { wood: 5000, stone: 4000, gold: 3000, knowledge: 500 },
    buildTime: 4500,
    effect: '知识产量+30%，研究速度+20%',
    effectBonus: { knowledge: 5 },
    synergyWith: 'hangingGardens',
    synergyEffect: '文明摇篮：大图书馆与空中花园共鸣，知识产量+40%',
    unlockTech: 'writing',
  },
  colossus: {
    id: 'colossus',
    name: '太阳神巨像',
    description: '矗立罗德岛港口的青铜巨人，以太阳神赫利俄斯之名守护航海者',
    icon: '🗿',
    cost: { metal: 6000, stone: 3000, gold: 2500, wood: 2000 },
    buildTime: 4200,
    effect: '金币产量+30%，贸易收入+50%',
    effectBonus: { gold: 10 },
    synergyWith: 'lighthouse',
    synergyEffect: '海权霸主：巨像与大灯塔共鸣，海上领地奖励+100%',
    unlockTech: 'bronzeWorking',
  },
  lighthouse: {
    id: 'lighthouse',
    name: '亚历山大灯塔',
    description: '指引航船的百米高塔，地中海的导航奇迹，照亮黑夜的火焰',
    icon: '🗼',
    cost: { stone: 5000, metal: 2000, gold: 1500, wood: 2500 },
    buildTime: 3900,
    effect: '海上领地产量+50%，发现领地概率+30%',
    effectBonus: { gold: 5, food: 3 },
    synergyWith: 'colossus',
    synergyEffect: '海权霸主：大灯塔与巨像共鸣，海上领地奖励+100%',
    unlockTech: 'bronzeWorking',
  },

  // ============ 中世纪奇观 ============
  terracottaArmy: {
    id: 'terracottaArmy',
    name: '兵马俑',
    description: '秦始皇的地下军团，千万陶俑列阵以待，永恒守护帝陵',
    icon: '🗿',
    cost: { stone: 6000, metal: 3000, gold: 2000, food: 3000 },
    buildTime: 4800,
    effect: '步兵产量+30%，兵种生产速度+15%',
    effectBonus: { population: 400 },
    synergyWith: 'greatWall',
    synergyEffect: '帝王陵寝：兵马俑与长城共鸣，所有兵种攻击+20%',
    unlockTech: 'ironWorking',
  },
  hagiaSophia: {
    id: 'hagiaSophia',
    name: '圣索菲亚大教堂',
    description: '拜占庭的穹顶奇迹，金色马赛克辉映神圣光辉，信仰的中心',
    icon: '⛪',
    cost: { stone: 7000, metal: 4000, gold: 5000, wood: 3000 },
    buildTime: 5400,
    effect: '人口幸福度+30%，转生货币获取+15%',
    effectBonus: { population: 600, gold: 5 },
    synergyWith: 'greatLibrary',
    synergyEffect: '智慧圣殿：圣索菲亚与大图书馆共鸣，知识产量+50%',
    unlockTech: 'trade',
  },

  // ============ 近代奇观 ============
  eiffelTower: {
    id: 'eiffelTower',
    name: '埃菲尔铁塔',
    description: '巴黎的钢铁地标，工业时代的象征，直指苍穹的钢铁奇迹',
    icon: '🗼',
    cost: { metal: 15000, stone: 5000, gold: 8000, wood: 2000 },
    buildTime: 7200,
    effect: '金属产量+40%，工业建筑产量+25%',
    effectBonus: { metal: 20 },
    synergyWith: 'steamEngine',
    synergyEffect: '工业革命：铁塔与蒸汽机共鸣，所有产量+20%',
    unlockTech: 'steamPower',
  },
  steamEngine: {
    id: 'steamEngine',
    name: '蒸汽机巨构',
    description: '驱动整个帝国的蒸汽核心，工业革命的心脏，轰鸣的力量源泉',
    icon: '🚂',
    cost: { metal: 20000, stone: 8000, gold: 10000, wood: 5000 },
    buildTime: 9000,
    effect: '所有建筑产量+20%，建造速度+30%',
    effectBonus: { metal: 15, stone: 10, gold: 10 },
    synergyWith: 'eiffelTower',
    synergyEffect: '工业革命：蒸汽机与铁塔共鸣，所有产量+20%',
    unlockTech: 'steamPower',
  },

  // ============ 太空时代奇观 ============
  spaceElevator: {
    id: 'spaceElevator',
    name: '太空电梯',
    description: '连接地表与轨道的纳米缆索，通向星辰的天梯，太空时代的门户',
    icon: '🛗',
    cost: { metal: 100000, gold: 80000, knowledge: 20000, stone: 50000 },
    buildTime: 21600,
    effect: '太空建筑产量+50%，太空领地探索成本-50%',
    effectBonus: { metal: 100, gold: 100, knowledge: 30 },
    synergyWith: 'dysonSphere',
    synergyEffect: '星际文明：太空电梯与戴森球共鸣，所有资源产量+100%',
    unlockTech: 'spaceFlight',
  },
  spaceStation: {
    id: 'spaceStation',
    name: '轨道空间站',
    description: '环绕地球的太空城市，失重工厂与科研中心，人类的太空前哨',
    icon: '🛰️',
    cost: { metal: 80000, gold: 60000, knowledge: 15000, stone: 30000 },
    buildTime: 18000,
    effect: '知识产量+50%，稀有资源产量+30%',
    effectBonus: { knowledge: 50, relicFragment: 1, geneSample: 1 },
    synergyWith: 'spaceElevator',
    synergyEffect: '轨道网络：空间站与太空电梯共鸣，太空领地产量+100%',
    unlockTech: 'spaceFlight',
  },

  // ============ 未来奇观 ============
  dysonSphere: {
    id: 'dysonSphere',
    name: '戴森球',
    description: '包裹恒星的人造巨构，汲取恒星能量，卡尔达肖夫II型文明的标志',
    icon: '🌟',
    cost: { metal: 1000000, gold: 500000, knowledge: 200000, starCore: 50 },
    buildTime: 86400,
    effect: '所有资源产量+100%，能量无限',
    effectBonus: { food: 500, wood: 500, stone: 500, metal: 500, gold: 500, knowledge: 500 },
    synergyWith: 'spaceElevator',
    synergyEffect: '星际文明：戴森球与太空电梯共鸣，所有资源产量+100%',
    unlockTech: 'dysonSphere',
  },
  timeMachine: {
    id: 'timeMachine',
    name: '时间机器',
    description: '操控时间流向的终极装置，能回溯过去窥探未来，因果律时代的杰作',
    icon: '⏳',
    cost: { metal: 5000000, gold: 3000000, knowledge: 1000000, starCore: 200 },
    buildTime: 172800,
    effect: '游戏速度+50%，转生货币获取+100%',
    effectBonus: { knowledge: 1000, starCore: 5 },
    synergyWith: 'dysonSphere',
    synergyEffect: '永恒之主：时间机器与戴森球共鸣，所有产量+200%',
    unlockTech: 'timeManipulation',
  },
};

// 获取奇观定义
export function getWonder(id: string): WonderDef | undefined {
  return WONDERS[id];
}

// 获取已解锁的奇观
export function getUnlockedWonders(researchedTechs: string[]): WonderDef[] {
  return Object.values(WONDERS).filter((w) => researchedTechs.includes(w.unlockTech));
}

// 获取奇观的协同伙伴
export function getSynergyPartner(id: string): WonderDef | undefined {
  const wonder = WONDERS[id];
  if (!wonder?.synergyWith) return undefined;
  return WONDERS[wonder.synergyWith];
}

// 获取某科技解锁的奇观
export function getWondersByTech(techId: string): WonderDef[] {
  return Object.values(WONDERS).filter((w) => w.unlockTech === techId);
}
