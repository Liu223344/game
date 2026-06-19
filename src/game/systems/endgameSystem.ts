import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { ResourceState } from '@/game/types';

// ============ 终局解锁标识（存储于 eraImprints） ============
const COSMIC_COLONIZATION_FLAG = 'endgame:cosmicColonization';
const CAUSALITY_WEAPON_FLAG = 'endgame:causalityWeapon';
const PLANET_PREFIX = 'endgame:planet:'; // 殖民星球标识前缀

// ============ 宇宙殖民 - 星球定义 ============
export interface PlanetDef {
  id: string;
  name: string;
  description: string;
  distance: number; // 距离（光年）
  cost: Partial<ResourceState>;
  reward: Partial<ResourceState>; // 持续加成
  unlockTech: string; // 解锁所需科技
}

const PLANETS: Record<string, PlanetDef> = {
  mars: {
    id: 'mars',
    name: '火星殖民地',
    description: '红色星球的第一个人类定居点，蕴藏丰富的金属矿藏',
    distance: 0.0000158,
    cost: { metal: 50000, food: 30000, knowledge: 20000 },
    reward: { metal: 50, knowledge: 10 },
    unlockTech: 'spaceFlight',
  },
  europa: {
    id: 'europa',
    name: '木卫二基地',
    description: '冰封海洋下的深海基地，可能存在地外生命',
    distance: 0.000628,
    cost: { metal: 100000, food: 50000, knowledge: 50000, starCore: 5 },
    reward: { metal: 100, knowledge: 30, geneSample: 1 },
    unlockTech: 'nanotech',
  },
  proxima: {
    id: 'proxima',
    name: '比邻星b',
    description: '距离最近的系外行星，潜在的第二家园',
    distance: 4.24,
    cost: { metal: 500000, food: 200000, knowledge: 200000, starCore: 30 },
    reward: { metal: 500, knowledge: 100, population: 1000 },
    unlockTech: 'quantumPhysics',
  },
  dysonSwarm: {
    id: 'dysonSwarm',
    name: '戴森云节点',
    description: '环绕恒星的能量收集节点群，能源近乎无限',
    distance: 0,
    cost: { metal: 1000000, knowledge: 500000, starCore: 100 },
    reward: { knowledge: 500, gold: 1000 },
    unlockTech: 'dysonSphere',
  },
  galaxyCore: {
    id: 'galaxyCore',
    name: '银河系核心',
    description: '银河中心的人马座A*，掌控超大质量黑洞',
    distance: 26000,
    cost: { metal: 5000000, knowledge: 2000000, starCore: 500, relicFragment: 100 },
    reward: { knowledge: 5000, starCore: 10 },
    unlockTech: 'dimensionFolding',
  },
};

// ============ 因果律武器 ============
export interface CausalityWeaponTarget {
  id: string;
  name: string;
  description: string;
  effect: string;
  cost: Partial<ResourceState>;
}

const CAUSALITY_TARGETS: Record<string, CausalityWeaponTarget> = {
  eraseEnemy: {
    id: 'eraseEnemy',
    name: '抹除敌对文明',
    description: '从因果层面抹除一个敌对文明，使其从未存在过',
    effect: '立即清除当前所有敌人，获得大量资源',
    cost: { starCore: 10, knowledge: 100000 },
  },
  rewriteHistory: {
    id: 'rewriteHistory',
    name: '改写历史',
    description: '回溯过去，改变关键历史节点，获得额外加成',
    effect: '所有资源产量+100%持续永久',
    cost: { starCore: 50, knowledge: 500000, relicFragment: 50 },
  },
  accelerateTime: {
    id: 'accelerateTime',
    name: '加速时间',
    description: '操控时间流速，瞬间完成所有在建项目',
    effect: '立即完成所有奇观建造和兵种训练',
    cost: { starCore: 20, knowledge: 200000 },
  },
  dimensionCollapse: {
    id: 'dimensionCollapse',
    name: '维度坍缩',
    description: '坍缩维度，获得跨维度资源',
    effect: '获得大量星核和神器碎片',
    cost: { starCore: 100, knowledge: 1000000 },
  },
};

// ============ 维度挑战 ============
export interface DimensionalChallenge {
  id: string;
  name: string;
  description: string;
  difficulty: number; // 1-10
  reward: string;
  requiredTech: string;
}

const DIMENSIONAL_CHALLENGES: DimensionalChallenge[] = [
  {
    id: 'dim_surface',
    name: '地表维度',
    description: '巩固地表文明，统一所有地表领土',
    difficulty: 3,
    reward: '所有资源产量+10%',
    requiredTech: 'ironWorking',
  },
  {
    id: 'dim_underground',
    name: '地底维度',
    description: '探索地底世界，发掘远古文明遗产',
    difficulty: 5,
    reward: '获得大量石头和金属加成',
    requiredTech: 'steamPower',
  },
  {
    id: 'dim_sky',
    name: '天空维度',
    description: '征服天空，建立浮空城市',
    difficulty: 6,
    reward: '获得知识产量+30%',
    requiredTech: 'electricity',
  },
  {
    id: 'dim_ocean',
    name: '海洋维度',
    description: '开发深海资源，建立海底帝国',
    difficulty: 7,
    reward: '获得食物和金币产量+40%',
    requiredTech: 'nuclearPower',
  },
  {
    id: 'dim_space',
    name: '太空维度',
    description: '掌控太阳系，建立星际帝国',
    difficulty: 8,
    reward: '解锁宇宙殖民',
    requiredTech: 'spaceFlight',
  },
  {
    id: 'dim_quantum',
    name: '量子维度',
    description: '进入量子领域，操控概率',
    difficulty: 9,
    reward: '所有产量+50%',
    requiredTech: 'quantumPhysics',
  },
  {
    id: 'dim_causality',
    name: '因果维度',
    description: '触及因果律，掌控命运',
    difficulty: 10,
    reward: '解锁因果律武器',
    requiredTech: 'causalityWeapon',
  },
];

// ============ 宇宙殖民 ============

// 检查是否解锁宇宙殖民
export function canUnlockCosmicColonization(): boolean {
  const state = useGameStore.getState();
  // 需研究太空飞行科技，且未已解锁
  if (state.eraImprints.includes(COSMIC_COLONIZATION_FLAG)) return false;
  return state.tech.researched.includes('spaceFlight');
}

// 解锁宇宙殖民
export function unlockCosmicColonization(): boolean {
  const state = useGameStore.getState();

  if (state.eraImprints.includes(COSMIC_COLONIZATION_FLAG)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '宇宙殖民已解锁' });
    return false;
  }

  if (!state.tech.researched.includes('spaceFlight')) {
    useUIStore.getState().addNotification({ type: 'warning', message: '需先研究太空飞行科技' });
    return false;
  }

  useGameStore.setState({
    eraImprints: [...state.eraImprints, COSMIC_COLONIZATION_FLAG],
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: '宇宙殖民已解锁！现在可以殖民外星世界',
  });

  return true;
}

// 检查宇宙殖民是否已解锁
export function isCosmicColonizationUnlocked(): boolean {
  return useGameStore.getState().eraImprints.includes(COSMIC_COLONIZATION_FLAG);
}

// 殖民星球
export function colonizePlanet(planetId: string): boolean {
  const state = useGameStore.getState();
  const planet = PLANETS[planetId];
  if (!planet) {
    useUIStore.getState().addNotification({ type: 'warning', message: '未知星球' });
    return false;
  }

  // 检查宇宙殖民是否解锁
  if (!state.eraImprints.includes(COSMIC_COLONIZATION_FLAG)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '需先解锁宇宙殖民' });
    return false;
  }

  // 检查解锁科技
  if (!state.tech.researched.includes(planet.unlockTech)) {
    useUIStore.getState().addNotification({ type: 'warning', message: `需先研究对应科技：${planet.unlockTech}` });
    return false;
  }

  // 检查是否已殖民
  const planetFlag = `${PLANET_PREFIX}${planetId}`;
  if (state.eraImprints.includes(planetFlag)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该星球已殖民' });
    return false;
  }

  // 检查资源
  if (!state.hasResources(planet.cost)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '资源不足，无法殖民' });
    return false;
  }

  // 扣除资源
  for (const [res, amount] of Object.entries(planet.cost)) {
    useGameStore.getState().spendResource(res as keyof ResourceState, amount as number);
  }

  // 标记殖民完成
  useGameStore.setState({
    eraImprints: [...useGameStore.getState().eraImprints, planetFlag],
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `成功殖民 ${planet.name}！获得持续资源加成`,
  });

  return true;
}

// 获取所有星球定义
export function getAllPlanets(): PlanetDef[] {
  return Object.values(PLANETS);
}

// 获取已殖民星球
export function getColonizedPlanets(): PlanetDef[] {
  const eraImprints = useGameStore.getState().eraImprints;
  return Object.values(PLANETS).filter((p) =>
    eraImprints.includes(`${PLANET_PREFIX}${p.id}`)
  );
}

// 获取星球殖民加成
export function getColonizationBonus(): Partial<ResourceState> {
  const colonized = getColonizedPlanets();
  const bonus: Partial<ResourceState> = {};
  for (const planet of colonized) {
    for (const [res, amount] of Object.entries(planet.reward)) {
      const key = res as keyof ResourceState;
      bonus[key] = (bonus[key] || 0) + (amount as number);
    }
  }
  return bonus;
}

// ============ 因果律武器 ============

// 检查是否可建造因果律武器
export function canBuildCausalityWeapon(): boolean {
  const state = useGameStore.getState();
  // 需研究因果律武器科技，且未已建造
  if (state.eraImprints.includes(CAUSALITY_WEAPON_FLAG)) return false;
  return state.tech.researched.includes('causalityWeapon');
}

// 建造因果律武器
export function buildCausalityWeapon(): boolean {
  const state = useGameStore.getState();

  if (state.eraImprints.includes(CAUSALITY_WEAPON_FLAG)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '因果律武器已建造' });
    return false;
  }

  if (!state.tech.researched.includes('causalityWeapon')) {
    useUIStore.getState().addNotification({ type: 'warning', message: '需先研究因果律武器科技' });
    return false;
  }

  // 建造费用
  const cost: Partial<ResourceState> = {
    metal: 1000000,
    knowledge: 500000,
    starCore: 50,
    relicFragment: 20,
  };

  if (!state.hasResources(cost)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '资源不足，无法建造因果律武器' });
    return false;
  }

  // 扣除资源
  for (const [res, amount] of Object.entries(cost)) {
    useGameStore.getState().spendResource(res as keyof ResourceState, amount as number);
  }

  useGameStore.setState({
    eraImprints: [...useGameStore.getState().eraImprints, CAUSALITY_WEAPON_FLAG],
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: '因果律武器建造完成！可改写因果',
  });

  return true;
}

// 检查因果律武器是否已建造
export function isCausalityWeaponBuilt(): boolean {
  return useGameStore.getState().eraImprints.includes(CAUSALITY_WEAPON_FLAG);
}

// 激活因果律武器（改变过去影响现在）
export function activateCausalityWeapon(target: string): boolean {
  const state = useGameStore.getState();

  if (!state.eraImprints.includes(CAUSALITY_WEAPON_FLAG)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '因果律武器尚未建造' });
    return false;
  }

  const targetDef = CAUSALITY_TARGETS[target];
  if (!targetDef) {
    useUIStore.getState().addNotification({ type: 'warning', message: '无效的目标' });
    return false;
  }

  // 检查资源
  if (!state.hasResources(targetDef.cost)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '资源不足，无法激活' });
    return false;
  }

  // 扣除资源
  for (const [res, amount] of Object.entries(targetDef.cost)) {
    useGameStore.getState().spendResource(res as keyof ResourceState, amount as number);
  }

  // 应用效果
  applyCausalityEffect(target);

  useUIStore.getState().addNotification({
    type: 'success',
    message: `因果律武器激活：${targetDef.name} - ${targetDef.effect}`,
  });

  return true;
}

// 应用因果律武器效果
function applyCausalityEffect(target: string): void {
  const state = useGameStore.getState();

  switch (target) {
    case 'eraseEnemy':
      // 抹除敌对文明：获得大量资源
      useGameStore.getState().addResource('gold', 100000);
      useGameStore.getState().addResource('food', 100000);
      useGameStore.getState().addResource('metal', 100000);
      useUIStore.getState().addNotification({ type: 'info', message: '敌对文明被抹除，掠夺大量资源' });
      break;

    case 'rewriteHistory':
      // 改写历史：永久产量加成（通过 eraImprints 标记）
      if (!state.eraImprints.includes('endgame:historyRewritten')) {
        useGameStore.setState({
          eraImprints: [...useGameStore.getState().eraImprints, 'endgame:historyRewritten'],
        });
      }
      useUIStore.getState().addNotification({ type: 'info', message: '历史已改写，所有产量永久+100%' });
      break;

    case 'accelerateTime':
      // 加速时间：立即完成所有在建项目
      // 完成所有奇观建造
      const newWonders = state.wonders.map((w) =>
        w.built ? w : { ...w, built: true, buildProgress: 1 }
      );
      // 完成所有兵种训练
      const newTroops = state.troops.map((t) => ({
        ...t,
        count: t.count + t.inProduction,
        inProduction: 0,
        productionProgress: 0,
      }));
      useGameStore.setState({ wonders: newWonders, troops: newTroops });
      useUIStore.getState().addNotification({ type: 'info', message: '时间加速完成，所有在建项目已竣工' });
      break;

    case 'dimensionCollapse':
      // 维度坍缩：获得跨维度资源
      useGameStore.getState().addResource('starCore', 50);
      useGameStore.getState().addResource('relicFragment', 50);
      useUIStore.getState().addNotification({ type: 'info', message: '维度坍缩，获得星核×50、神器碎片×50' });
      break;
  }
}

// 获取所有因果律武器目标
export function getCausalityTargets(): CausalityWeaponTarget[] {
  return Object.values(CAUSALITY_TARGETS);
}

// 检查历史是否已被改写（用于产量加成计算）
export function isHistoryRewritten(): boolean {
  return useGameStore.getState().eraImprints.includes('endgame:historyRewritten');
}

// ============ 维度挑战 ============

// 获取维度挑战
export function getDimensionalChallenges(): DimensionalChallenge[] {
  const researched = useGameStore.getState().tech.researched;
  // 返回所有挑战，标注是否已解锁
  return DIMENSIONAL_CHALLENGES.map((c) => ({
    ...c,
    // 已解锁的挑战所需科技已研究
  })).filter((c) => researched.includes(c.requiredTech) || c.difficulty <= 3);
}

// 获取所有维度挑战（不考虑解锁状态）
export function getAllDimensionalChallenges(): DimensionalChallenge[] {
  return DIMENSIONAL_CHALLENGES;
}

// 检查维度挑战是否已解锁
export function isDimensionalChallengeUnlocked(challengeId: string): boolean {
  const challenge = DIMENSIONAL_CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) return false;
  return useGameStore.getState().tech.researched.includes(challenge.requiredTech);
}

// 检查维度挑战是否已完成
export function isDimensionalChallengeCompleted(challengeId: string): boolean {
  return useGameStore.getState().eraImprints.includes(`endgame:dimChallenge:${challengeId}`);
}

// 完成维度挑战
export function completeDimensionalChallenge(challengeId: string): boolean {
  const state = useGameStore.getState();
  const challenge = DIMENSIONAL_CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) {
    useUIStore.getState().addNotification({ type: 'warning', message: '未知维度挑战' });
    return false;
  }

  const flag = `endgame:dimChallenge:${challengeId}`;
  if (state.eraImprints.includes(flag)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该维度挑战已完成' });
    return false;
  }

  if (!state.tech.researched.includes(challenge.requiredTech)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '维度挑战未解锁' });
    return false;
  }

  useGameStore.setState({
    eraImprints: [...useGameStore.getState().eraImprints, flag],
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `维度挑战完成：${challenge.name}！${challenge.reward}`,
  });

  return true;
}
