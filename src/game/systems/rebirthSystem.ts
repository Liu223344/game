import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import {
  REBIRTH_UPGRADES,
  getRebirthUpgrade,
  getRebirthUpgradeCost,
} from '@/game/data/rebirthUpgrades';
import { getCivilization } from '@/game/data/civilizations';
import { GAME_VERSION, INITIAL_RESOURCES, RULER_NAMES } from '@/utils/constants';
import type {
  CivilizationType,
  RebirthUpgradeDef,
  ResourceState,
  GameState,
  BuildingType,
  BuildingState,
} from '@/game/types';

// 转生门槛：需要达到一定的综合进度
const REBIRTH_THRESHOLD = 100;

// 计算综合进度分数（用于判断是否可转生）
function calculateProgressScore(): number {
  const state = useGameStore.getState();
  let score = 0;

  // 科技进度（每项10分）
  score += state.tech.researched.length * 10;

  // 建筑等级（每级1分）
  for (const building of Object.values(state.buildings)) {
    score += building.level;
  }

  // 兵力（每10个兵1分）
  const totalTroops = state.troops.reduce((sum, t) => sum + t.count, 0);
  score += Math.floor(totalTroops / 10);

  // 领地（每块20分）
  score += state.territories.filter((t) => t.owned).length * 20;

  // 奇观（每座50分）
  score += state.wonders.filter((w) => w.built).length * 50;

  return score;
}

// 计算转生货币（基于科技/建筑/兵力/领地/奇观）
export function calculateRebirthCurrency(): number {
  const state = useGameStore.getState();
  let currency = 0;

  // 科技贡献（每项0.5货币）
  currency += state.tech.researched.length * 0.5;

  // 建筑等级贡献（每级0.1货币）
  for (const building of Object.values(state.buildings)) {
    currency += building.level * 0.1;
  }

  // 兵力贡献（每100个兵1货币）
  const totalTroops = state.troops.reduce((sum, t) => sum + t.count, 0);
  currency += Math.floor(totalTroops / 100);

  // 领地贡献（每块2货币）
  currency += state.territories.filter((t) => t.owned).length * 2;

  // 奇观贡献（每座5货币）
  currency += state.wonders.filter((w) => w.built).length * 5;

  // 文明遗产吸收加成（每个+2货币）
  currency += state.eraImprints.length * 2;

  // 应用转生精通升级加成
  const currencyUpgrade = state.rebirth.upgrades.find((u) => u.id === 'rebirthCurrency');
  if (currencyUpgrade) {
    currency *= 1 + 0.15 * currencyUpgrade.level;
  }

  return Math.floor(currency);
}

// 检查是否可以转生
export function canRebirth(): boolean {
  const state = useGameStore.getState();

  // 首次转生无门槛
  if (state.rebirth.totalRebirths === 0) {
    return calculateProgressScore() >= REBIRTH_THRESHOLD * 0.5;
  }

  // 计算提前转生升级的门槛降低
  const earlyRebirthUpgrade = state.rebirth.upgrades.find((u) => u.id === 'earlyRebirth');
  const thresholdReduction = earlyRebirthUpgrade ? 0.1 * earlyRebirthUpgrade.level : 0;
  const effectiveThreshold = REBIRTH_THRESHOLD * (1 - thresholdReduction);

  return calculateProgressScore() >= effectiveThreshold;
}

// 执行转生（重置进度，获得货币，选择文明）
export function performRebirth(civilizationId: CivilizationType): boolean {
  const state = useGameStore.getState();

  // 检查是否可转生
  if (!canRebirth()) {
    useUIStore.getState().addNotification({
      type: 'warning',
      message: '当前进度不足，无法转生',
    });
    return false;
  }

  // 检查文明是否有效
  const civilization = getCivilization(civilizationId);
  if (!civilization) {
    useUIStore.getState().addNotification({ type: 'warning', message: '无效的文明选择' });
    return false;
  }

  // 计算获得的转生货币
  const gainedCurrency = calculateRebirthCurrency();

  // 构建转生后的状态：重置进度，保留转生信息
  const rebirthState = {
    currency: state.rebirth.currency + gainedCurrency,
    upgrades: state.rebirth.upgrades, // 保留已购升级
    civilization: civilizationId,
    totalRebirths: state.rebirth.totalRebirths + 1,
    talentTree: state.rebirth.talentTree, // 保留天赋树
  };

  // 重置游戏状态（保留转生相关）
  const resetState: Partial<GameState> = {
    version: GAME_VERSION,
    lastSave: Date.now(),
    playTime: state.playTime, // 保留总游戏时间
    gameSpeed: 1,
    resources: { ...INITIAL_RESOURCES },
    troops: [],
    tech: { researched: [], current: null, progress: 0 },
    territories: [],
    wonders: [],
    rebirth: rebirthState,
    relics: state.relics, // 保留遗物
    rulerStyle: {
      current: null,
      affinity: {
        tyrant: 0,
        benevolent: 0,
        scholar: 0,
        warlord: 0,
        merchant: 0,
        prophet: 0,
      },
    },
    banner: state.banner, // 保留旗帜
    codex: state.codex, // 保留图鉴
    eraImprints: state.eraImprints, // 保留已吸收的文明遗产
    currentBattle: null,
    activeEvents: [],
    // 重置新系统状态
    ruler: {
      id: `ruler_${Date.now()}`,
      name: RULER_NAMES[Math.floor(Math.random() * RULER_NAMES.length)],
      age: 25,
      ageInDays: 25 * 365,
      stamina: 80,
      intelligence: 60,
      charisma: 50,
      isAlive: true,
      skills: { leadership: 1, strategy: 1, governance: 1, charisma: 1, arcane: 0 },
      equipment: {},
      heirs: [],
      reignStart: state.playTime,
      dynastyCount: 0,
    },
    legitimacy: { value: 50, history: [] },
    season: { current: 'spring', dayInSeason: 0, weather: 'sunny', weatherDaysLeft: 30 },
    chronicle: state.chronicle, // 保留编年史作为历史遗产
    diplomacy: { empires: [], tradeHistory: [] },
    culture: { value: 0, influence: 0, influenceRange: 1 },
    ecology: { value: 100, degradedTerritories: [] },
    disasters: [],
    multiverse: {
      currentUniverse: null,
      universes: [
        { id: 'mirror', name: '镜像宇宙', description: '所有数值反转的奇异世界', rule: '强变弱，弱变强', isUnlocked: false, isCompleted: false, reward: '镜像遗物' },
        { id: 'frozen', name: '冰封宇宙', description: '资源产出极慢的冰封世界', rule: '产出-80%，兵力+200%', isUnlocked: false, isCompleted: false, reward: '冰霜巨龙' },
        { id: 'inferno', name: '火焰宇宙', description: '资源产出极快的炽热世界', rule: '产出+200%，兵力-80%', isUnlocked: false, isCompleted: false, reward: '火焰凤凰' },
        { id: 'quantum', name: '量子宇宙', description: '每次决策产生平行时间线', rule: '可同时尝试多个选择', isUnlocked: false, isCompleted: false, reward: '量子战士' },
        { id: 'void', name: '虚空宇宙', description: '无资源的虚无世界', rule: '只能通过因果律武器获取', isUnlocked: false, isCompleted: false, reward: '虚空行者' },
      ],
      explorationProgress: 0,
    },
    cipherDocuments: state.cipherDocuments, // 保留已破译文献进度
  };

  // 重置建筑到初始状态
  const initialBuildings: Record<BuildingType, BuildingState> = {
    farm: { type: 'farm', level: 1, isActive: true },
    lumberyard: { type: 'lumberyard', level: 1, isActive: true },
    quarry: { type: 'quarry', level: 0, isActive: false },
    mine: { type: 'mine', level: 0, isActive: false },
    barracks: { type: 'barracks', level: 1, isActive: true },
    archeryRange: { type: 'archeryRange', level: 0, isActive: false },
    stable: { type: 'stable', level: 0, isActive: false },
    academy: { type: 'academy', level: 0, isActive: false },
    market: { type: 'market', level: 0, isActive: false },
    workshop: { type: 'workshop', level: 0, isActive: false },
  };
  resetState.buildings = initialBuildings;

  // 应用起步加速升级加成
  const startingBoost = state.rebirth.upgrades.find((u) => u.id === 'startingBoost');
  if (startingBoost && startingBoost.level > 0) {
    const resourceBonus = 0.2 * startingBoost.level;
    const newResources = { ...resetState.resources } as ResourceState;
    for (const key of Object.keys(newResources) as (keyof ResourceState)[]) {
      newResources[key] = Math.floor(newResources[key] * (1 + resourceBonus));
    }
    resetState.resources = newResources;

    // 建筑等级+1每级
    const boostedBuildings: Record<BuildingType, BuildingState> = { ...initialBuildings };
    (Object.keys(boostedBuildings) as BuildingType[]).forEach((key) => {
      const newLevel = boostedBuildings[key].level + startingBoost.level;
      boostedBuildings[key] = {
        type: key,
        level: newLevel,
        isActive: newLevel > 0,
      };
    });
    resetState.buildings = boostedBuildings;
  }

  // 应用远古知识升级：开局额外解锁科技
  const ancientKnowledge = state.rebirth.upgrades.find((u) => u.id === 'ancientKnowledge');
  if (ancientKnowledge && ancientKnowledge.level > 0) {
    // 标记：实际解锁逻辑由科技系统处理，此处仅通知
    useUIStore.getState().addNotification({
      type: 'info',
      message: `远古知识加成：可额外解锁 ${ancientKnowledge.level} 项科技`,
    });
  }

  useGameStore.setState(resetState as GameState);

  useUIStore.getState().addNotification({
    type: 'success',
    message: `转生成功！加入 ${civilization.name} 文明，获得 ${gainedCurrency} 转生货币`,
  });

  return true;
}

// 购买转生升级
export function purchaseRebirthUpgrade(upgradeId: string): boolean {
  const state = useGameStore.getState();
  const upgrade = getRebirthUpgrade(upgradeId);
  if (!upgrade) return false;

  // 查找当前升级等级
  const existing = state.rebirth.upgrades.find((u) => u.id === upgradeId);
  const currentLevel = existing?.level || 0;

  // 检查是否已满级
  if (currentLevel >= upgrade.maxLevel) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该升级已满级' });
    return false;
  }

  // 计算成本
  const cost = getRebirthUpgradeCost(upgrade, currentLevel);

  // 检查货币
  if (state.rebirth.currency < cost) {
    useUIStore.getState().addNotification({ type: 'warning', message: '转生货币不足' });
    return false;
  }

  // 扣除货币并更新升级
  const newUpgrades = existing
    ? state.rebirth.upgrades.map((u) =>
        u.id === upgradeId ? { ...u, level: u.level + 1 } : u
      )
    : [...state.rebirth.upgrades, { id: upgradeId, level: 1 }];

  useGameStore.setState({
    rebirth: {
      ...state.rebirth,
      currency: state.rebirth.currency - cost,
      upgrades: newUpgrades,
    },
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `购买升级：${upgrade.name} (Lv.${currentLevel + 1})`,
  });

  return true;
}

// 获取转生加成（资源型加成）
export function getRebirthBonus(): Partial<ResourceState> {
  const state = useGameStore.getState();
  const bonus: Partial<ResourceState> = {};

  // 文明加成（仅对象型 effect）
  if (state.rebirth.civilization) {
    const civ = getCivilization(state.rebirth.civilization);
    if (civ) {
      for (const b of civ.bonuses) {
        if (typeof b.effect === 'object') {
          for (const [res, amount] of Object.entries(b.effect)) {
            const key = res as keyof ResourceState;
            bonus[key] = (bonus[key] || 0) + (amount as number);
          }
        }
      }
    }
  }

  // 转生升级加成（资源型）
  for (const upgradeState of state.rebirth.upgrades) {
    const def = getRebirthUpgrade(upgradeState.id);
    if (!def) continue;

    // 资源丰饶：所有资源产量+5%每级（转化为固定加成近似）
    if (def.id === 'resourceAbundance') {
      const add = upgradeState.level;
      bonus.food = (bonus.food || 0) + add;
      bonus.wood = (bonus.wood || 0) + add;
      bonus.stone = (bonus.stone || 0) + add;
      bonus.metal = (bonus.metal || 0) + add;
      bonus.gold = (bonus.gold || 0) + add;
      bonus.knowledge = (bonus.knowledge || 0) + add;
    }
    // 黄金时代：金币产量+8%每级
    if (def.id === 'goldenAge') {
      bonus.gold = (bonus.gold || 0) + upgradeState.level * 2;
    }
    // 人口繁荣：人口上限+10%每级
    if (def.id === 'populationBoom') {
      bonus.population = (bonus.population || 0) + upgradeState.level * 50;
    }
    // 知识涌流：知识产量+8%每级
    if (def.id === 'knowledgeFlow') {
      bonus.knowledge = (bonus.knowledge || 0) + upgradeState.level * 2;
    }
  }

  return bonus;
}

// 获取所有转生升级定义
export function getAllRebirthUpgrades(): RebirthUpgradeDef[] {
  return Object.values(REBIRTH_UPGRADES);
}

// 获取当前转生进度信息
export function getRebirthProgress(): {
  currentScore: number;
  threshold: number;
  canRebirth: boolean;
  potentialCurrency: number;
} {
  const state = useGameStore.getState();
  const currentScore = calculateProgressScore();

  let threshold = REBIRTH_THRESHOLD;
  if (state.rebirth.totalRebirths === 0) {
    threshold = REBIRTH_THRESHOLD * 0.5;
  } else {
    const earlyRebirthUpgrade = state.rebirth.upgrades.find((u) => u.id === 'earlyRebirth');
    if (earlyRebirthUpgrade) {
      threshold = REBIRTH_THRESHOLD * (1 - 0.1 * earlyRebirthUpgrade.level);
    }
  }

  return {
    currentScore,
    threshold,
    canRebirth: canRebirth(),
    potentialCurrency: calculateRebirthCurrency(),
  };
}
