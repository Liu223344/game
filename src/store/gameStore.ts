import { create } from 'zustand';
import type { GameState, BuildingType, BuildingState, ResourceState, RulerState, LegitimacyState, SeasonState, ChronicleEntry, DiplomacyState, CultureState, EcologyState, AIEmpire, ResourceType, Disaster, MultiverseState, CipherDocument } from '@/game/types';
import { GAME_VERSION, INITIAL_RESOURCES, RULER_NAMES } from '@/utils/constants';

// 初始建筑状态
function createInitialBuildings(): Record<BuildingType, BuildingState> {
  return {
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
}

// 创建初始统治者
function createInitialRuler(): RulerState {
  const name = RULER_NAMES[Math.floor(Math.random() * RULER_NAMES.length)];
  return {
    id: `ruler_${Date.now()}`,
    name,
    age: 25,
    ageInDays: 25 * 365,
    stamina: 80,
    intelligence: 60,
    charisma: 50,
    isAlive: true,
    skills: {
      leadership: 1,
      strategy: 1,
      governance: 1,
      charisma: 1,
      arcane: 0,
    },
    equipment: {},
    heirs: [],
    reignStart: 0,
    dynastyCount: 0,
  };
}

// 初始合法性
function createInitialLegitimacy(): LegitimacyState {
  return {
    value: 50,
    history: [],
  };
}

// 初始季节
function createInitialSeason(): SeasonState {
  return {
    current: 'spring',
    dayInSeason: 0,
    weather: 'sunny',
    weatherDaysLeft: 30,
  };
}

// 初始外交
function createInitialDiplomacy(): DiplomacyState {
  return {
    empires: [],
    tradeHistory: [],
  };
}

// 初始文化
function createInitialCulture(): CultureState {
  return {
    value: 0,
    influence: 0,
    influenceRange: 1,
  };
}

// 初始生态
function createInitialEcology(): EcologyState {
  return {
    value: 100,
    degradedTerritories: [],
  };
}

// 初始灾害
function createInitialDisasters(): Disaster[] {
  return [];
}

// 初始多元宇宙
function createInitialMultiverse(): MultiverseState {
  return {
    currentUniverse: null,
    universes: [
      { id: 'mirror', name: '镜像宇宙', description: '所有数值反转的奇异世界', rule: '强变弱，弱变强', isUnlocked: false, isCompleted: false, reward: '镜像遗物' },
      { id: 'frozen', name: '冰封宇宙', description: '资源产出极慢的冰封世界', rule: '产出-80%，兵力+200%', isUnlocked: false, isCompleted: false, reward: '冰霜巨龙' },
      { id: 'inferno', name: '火焰宇宙', description: '资源产出极快的炽热世界', rule: '产出+200%，兵力-80%', isUnlocked: false, isCompleted: false, reward: '火焰凤凰' },
      { id: 'quantum', name: '量子宇宙', description: '每次决策产生平行时间线', rule: '可同时尝试多个选择', isUnlocked: false, isCompleted: false, reward: '量子战士' },
      { id: 'void', name: '虚空宇宙', description: '无资源的虚无世界', rule: '只能通过因果律武器获取', isUnlocked: false, isCompleted: false, reward: '虚空行者' },
    ],
    explorationProgress: 0,
  };
}

// 初始密码文献
function createInitialCipherDocuments(): CipherDocument[] {
  return [];
}

// 初始游戏状态
function createInitialState(): GameState {
  return {
    version: GAME_VERSION,
    lastSave: Date.now(),
    playTime: 0,
    gameSpeed: 1,

    resources: { ...INITIAL_RESOURCES },

    buildings: createInitialBuildings(),

    troops: [],

    tech: {
      researched: [],
      current: null,
      progress: 0,
    },

    territories: [],

    wonders: [],

    rebirth: {
      currency: 0,
      upgrades: [],
      civilization: null,
      totalRebirths: 0,
      talentTree: [],
    },

    relics: [],

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

    banner: {
      bgColor: 'brown',
      pattern: 'eagle',
      border: 'simple',
    },

    codex: {
      discoveredTroops: [],
      discoveredTechs: [],
      discoveredCivilizations: [],
      discoveredRelics: [],
      discoveredEvents: [],
      decodedLanguages: [],
    },

    eraImprints: [],

    currentBattle: null,

    activeEvents: [],

    ruler: createInitialRuler(),

    legitimacy: createInitialLegitimacy(),

    season: createInitialSeason(),

    chronicle: [],

    diplomacy: createInitialDiplomacy(),

    culture: createInitialCulture(),

    ecology: createInitialEcology(),

    disasters: createInitialDisasters(),

    multiverse: createInitialMultiverse(),

    cipherDocuments: createInitialCipherDocuments(),
  };
}

interface GameStoreActions {
  // 资源
  addResource: (resource: keyof ResourceState, amount: number) => void;
  spendResource: (resource: keyof ResourceState, amount: number) => boolean;
  hasResources: (cost: Partial<ResourceState>) => boolean;

  // 建筑
  upgradeBuilding: (type: BuildingType) => void;
  toggleBuilding: (type: BuildingType) => void;

  // 王朝继承
  ageRuler: (days: number) => void;
  educateHeir: (heirId: string) => void;
  succeedRuler: (heirId: string) => void;
  upgradeRulerSkill: (branch: import('@/game/types').RulerSkillBranch) => void;

  // 合法性
  modifyLegitimacy: (delta: number, reason: string) => void;

  // 季节
  advanceSeason: (days: number) => void;

  // 编年史
  recordChronicle: (entry: Omit<ChronicleEntry, 'id' | 'timestamp' | 'reign' | 'year'>) => void;

  // 外交
  initAIEmpire: (empires: AIEmpire[]) => void;
  updateAIEmpire: (id: string, updates: Partial<AIEmpire>) => void;
  modifyRelation: (empireId: string, delta: number) => void;
  addTradeRecord: (record: { empireId: string; type: 'import' | 'export'; resource: ResourceType; amount: number }) => void;

  // 文化
  addCulture: (amount: number) => void;

  // 生态
  modifyEcology: (delta: number) => void;
  addDegradedTerritory: (territoryId: string) => void;

  // 灾害
  addDisaster: (disaster: Disaster) => void;
  updateDisaster: (id: string, updates: Partial<Disaster>) => void;
  removeDisaster: (id: string) => void;

  // 多元宇宙
  setCurrentUniverse: (universe: import('@/game/types').UniverseType | null) => void;
  completeUniverse: (universe: import('@/game/types').UniverseType) => void;
  updateExplorationProgress: (progress: number) => void;

  // 语言破译
  addCipherDocument: (doc: CipherDocument) => void;
  updateCipherDocument: (id: string, updates: Partial<CipherDocument>) => void;

  // 通用
  tick: (deltaSeconds: number) => void;
  resetGame: () => void;
  loadState: (state: GameState) => void;
  getState: () => GameState;
}

export const useGameStore = create<GameState & GameStoreActions>((set, get) => ({
  ...createInitialState(),

  addResource: (resource, amount) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [resource]: state.resources[resource] + amount,
      },
    })),

  spendResource: (resource, amount) => {
    const current = get().resources[resource];
    if (current < amount) return false;
    set((state) => ({
      resources: {
        ...state.resources,
        [resource]: state.resources[resource] - amount,
      },
    }));
    return true;
  },

  hasResources: (cost) => {
    const resources = get().resources;
    return Object.entries(cost).every(
      ([key, amount]) => resources[key as keyof ResourceState] >= (amount || 0)
    );
  },

  upgradeBuilding: (type) =>
    set((state) => ({
      buildings: {
        ...state.buildings,
        [type]: {
          ...state.buildings[type],
          level: state.buildings[type].level + 1,
          isActive: true,
        },
      },
    })),

  toggleBuilding: (type) =>
    set((state) => ({
      buildings: {
        ...state.buildings,
        [type]: {
          ...state.buildings[type],
          isActive: !state.buildings[type].isActive,
        },
      },
    })),

  // ============ 王朝继承系统 ============
  ageRuler: (days) =>
    set((state) => {
      const ruler = state.ruler;
      const newAgeInDays = ruler.ageInDays + days;
      const newAge = Math.floor(newAgeInDays / 365);
      // 体力随年龄变化：30岁前增长，之后缓慢下降
      let newStamina = ruler.stamina;
      if (newAge < 30) {
        newStamina = Math.min(100, newStamina + days * 0.001);
      } else if (newAge > 50) {
        newStamina = Math.max(20, newStamina - days * 0.002);
      }
      // 智力随年龄缓慢增长
      const newIntelligence = Math.min(100, ruler.intelligence + days * 0.0005);
      return {
        ruler: {
          ...ruler,
          ageInDays: newAgeInDays,
          age: newAge,
          stamina: newStamina,
          intelligence: newIntelligence,
        },
      };
    }),

  educateHeir: (heirId) =>
    set((state) => ({
      ruler: {
        ...state.ruler,
        heirs: state.ruler.heirs.map((h) =>
          h.id === heirId
            ? { ...h, educationProgress: Math.min(1, h.educationProgress + 0.05) }
            : h
        ),
      },
    })),

  succeedRuler: (heirId) =>
    set((state) => {
      const heir = state.ruler.heirs.find((h) => h.id === heirId);
      if (!heir) return state;
      const inheritRate = 0.3 + heir.educationProgress * 0.4; // 30%-70%
      const newRuler = {
        ...state.ruler,
        id: `ruler_${Date.now()}`,
        name: heir.name,
        age: heir.age,
        ageInDays: heir.age * 365,
        stamina: Math.floor(state.ruler.stamina * inheritRate + 40),
        intelligence: Math.floor(state.ruler.intelligence * inheritRate + 30),
        charisma: Math.floor(state.ruler.charisma * inheritRate + 30),
        isAlive: true,
        skills: {
          leadership: Math.max(1, Math.floor(state.ruler.skills.leadership * inheritRate)),
          strategy: Math.max(1, Math.floor(state.ruler.skills.strategy * inheritRate)),
          governance: Math.max(1, Math.floor(state.ruler.skills.governance * inheritRate)),
          charisma: Math.max(1, Math.floor(state.ruler.skills.charisma * inheritRate)),
          arcane: Math.floor(state.ruler.skills.arcane * inheritRate),
        },
        equipment: state.ruler.equipment, // 装备传承
        heirs: [],
        reignStart: state.playTime,
        dynastyCount: state.ruler.dynastyCount + 1,
      };
      return { ruler: newRuler };
    }),

  upgradeRulerSkill: (branch) =>
    set((state) => ({
      ruler: {
        ...state.ruler,
        skills: {
          ...state.ruler.skills,
          [branch]: state.ruler.skills[branch] + 1,
        },
      },
    })),

  // ============ 天命合法性系统 ============
  modifyLegitimacy: (delta, reason) =>
    set((state) => {
      const newValue = Math.max(0, Math.min(100, state.legitimacy.value + delta));
      return {
        legitimacy: {
          value: newValue,
          history: [
            ...state.legitimacy.history.slice(-49), // 保留最近50条
            { time: state.playTime, value: newValue, reason },
          ],
        },
      };
    }),

  // ============ 季节天气系统 ============
  advanceSeason: (days) =>
    set((state) => {
      const season = state.season;
      let newDayInSeason = season.dayInSeason + days;
      let newCurrent = season.current;
      // 季节切换
      while (newDayInSeason >= 120) {
        newDayInSeason -= 120;
        const seasonOrder = ['spring', 'summer', 'autumn', 'winter'] as const;
        const idx = seasonOrder.indexOf(newCurrent);
        newCurrent = seasonOrder[(idx + 1) % 4];
      }
      // 天气倒计时
      let newWeatherDaysLeft = season.weatherDaysLeft - days;
      let newWeather = season.weather;
      if (newWeatherDaysLeft <= 0) {
        // 随机新天气
        const weathers = ['sunny', 'sunny', 'sunny', 'rainstorm', 'drought', 'blizzard', 'aurora'] as const;
        newWeather = weathers[Math.floor(Math.random() * weathers.length)];
        newWeatherDaysLeft = 20 + Math.floor(Math.random() * 30);
      }
      return {
        season: {
          current: newCurrent,
          dayInSeason: newDayInSeason,
          weather: newWeather,
          weatherDaysLeft: newWeatherDaysLeft,
        },
      };
    }),

  // ============ 帝国编年史系统 ============
  recordChronicle: (entry) =>
    set((state) => {
      const year = Math.floor(state.playTime / 480); // 480 tick = 1年
      const newEntry: ChronicleEntry = {
        ...entry,
        id: `chronicle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        year,
        timestamp: state.playTime,
        reign: state.ruler.dynastyCount,
      };
      return {
        chronicle: [...state.chronicle, newEntry].slice(-500), // 保留最近500条
      };
    }),

  // ============ 外交与AI帝国系统 ============
  initAIEmpire: (empires) =>
    set((state) => ({
      diplomacy: { ...state.diplomacy, empires },
    })),

  updateAIEmpire: (id, updates) =>
    set((state) => ({
      diplomacy: {
        ...state.diplomacy,
        empires: state.diplomacy.empires.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      },
    })),

  modifyRelation: (empireId, delta) =>
    set((state) => ({
      diplomacy: {
        ...state.diplomacy,
        empires: state.diplomacy.empires.map((e) => {
          if (e.id !== empireId) return e;
          const newRelation = Math.max(-100, Math.min(100, e.relation + delta));
          let newStatus: AIEmpire['relationStatus'] = 'neutral';
          if (newRelation <= -50) newStatus = 'hostile';
          else if (newRelation < 0) newStatus = 'neutral';
          else if (newRelation < 50) newStatus = 'friendly';
          else newStatus = 'ally';
          return { ...e, relation: newRelation, relationStatus: newStatus };
        }),
      },
    })),

  addTradeRecord: (record) =>
    set((state) => ({
      diplomacy: {
        ...state.diplomacy,
        tradeHistory: [
          ...state.diplomacy.tradeHistory.slice(-49),
          { ...record, time: state.playTime },
        ],
      },
    })),

  // ============ 文化影响力系统 ============
  addCulture: (amount) =>
    set((state) => {
      const newValue = state.culture.value + amount;
      const charismaMult = 1 + state.ruler.skills.charisma * 0.05;
      const newInfluence = newValue * charismaMult * (state.legitimacy.value / 50);
      const newRange = 1 + Math.floor(newValue / 100); // 每100文化值+1影响半径
      return {
        culture: {
          value: newValue,
          influence: newInfluence,
          influenceRange: newRange,
        },
      };
    }),

  // ============ 生态系统平衡系统 ============
  modifyEcology: (delta) =>
    set((state) => ({
      ecology: {
        ...state.ecology,
        value: Math.max(0, Math.min(100, state.ecology.value + delta)),
      },
    })),

  addDegradedTerritory: (territoryId) =>
    set((state) => ({
      ecology: {
        ...state.ecology,
        degradedTerritories: state.ecology.degradedTerritories.includes(territoryId)
          ? state.ecology.degradedTerritories
          : [...state.ecology.degradedTerritories, territoryId],
      },
    })),

  // ============ 灾害链式反应系统 ============
  addDisaster: (disaster) =>
    set((state) => ({
      disasters: [...state.disasters, disaster],
    })),

  updateDisaster: (id, updates) =>
    set((state) => ({
      disasters: state.disasters.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  removeDisaster: (id) =>
    set((state) => ({
      disasters: state.disasters.filter((d) => d.id !== id),
    })),

  // ============ 多元宇宙系统 ============
  setCurrentUniverse: (universe) =>
    set({ multiverse: { ...useGameStore.getState().multiverse, currentUniverse: universe, explorationProgress: 0 } }),

  completeUniverse: (universe) =>
    set((state) => ({
      multiverse: {
        ...state.multiverse,
        universes: state.multiverse.universes.map((u) =>
          u.id === universe ? { ...u, isCompleted: true } : u
        ),
        currentUniverse: null,
      },
    })),

  updateExplorationProgress: (progress) =>
    set((state) => ({
      multiverse: {
        ...state.multiverse,
        explorationProgress: Math.min(1, Math.max(0, progress)),
      },
    })),

  // ============ 语言破译系统 ============
  addCipherDocument: (doc) =>
    set((state) => ({
      cipherDocuments: [...state.cipherDocuments, doc],
    })),

  updateCipherDocument: (id, updates) =>
    set((state) => ({
      cipherDocuments: state.cipherDocuments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  tick: (deltaSeconds) =>
    set((state) => ({
      playTime: state.playTime + deltaSeconds,
    })),

  resetGame: () => set({ ...createInitialState() }),

  loadState: (loadedState) => {
    // 字段迁移：将旧存档与初始状态深度合并，补全缺失字段
    const initial = createInitialState();
    const merged: GameState = {
      ...initial,
      ...loadedState,
      // 深度合并嵌套对象，避免旧存档缺少子字段
      resources: { ...initial.resources, ...(loadedState.resources || {}) },
      tech: { ...initial.tech, ...(loadedState.tech || {}) },
      rebirth: { ...initial.rebirth, ...(loadedState.rebirth || {}) },
      rulerStyle: { ...initial.rulerStyle, ...(loadedState.rulerStyle || {}),
        affinity: { ...initial.rulerStyle.affinity, ...((loadedState.rulerStyle as GameState['rulerStyle'])?.affinity || {}) } },
      banner: { ...initial.banner, ...(loadedState.banner || {}) },
      codex: { ...initial.codex, ...(loadedState.codex || {}) },
      ruler: {
        ...initial.ruler,
        ...(loadedState.ruler || {}),
        skills: { ...initial.ruler.skills, ...((loadedState.ruler as GameState['ruler'])?.skills || {}) },
      },
      legitimacy: { ...initial.legitimacy, ...(loadedState.legitimacy || {}) },
      season: { ...initial.season, ...(loadedState.season || {}) },
      diplomacy: { ...initial.diplomacy, ...(loadedState.diplomacy || {}) },
      culture: { ...initial.culture, ...(loadedState.culture || {}) },
      ecology: { ...initial.ecology, ...(loadedState.ecology || {}) },
      multiverse: { ...initial.multiverse, ...(loadedState.multiverse || {}) },
      // 数组字段：使用 loadedState 的值或空数组
      troops: loadedState.troops || [],
      territories: loadedState.territories || [],
      wonders: loadedState.wonders || [],
      relics: loadedState.relics || [],
      eraImprints: loadedState.eraImprints || [],
      activeEvents: loadedState.activeEvents || [],
      chronicle: loadedState.chronicle || [],
      disasters: loadedState.disasters || [],
      cipherDocuments: loadedState.cipherDocuments || [],
      // 建筑特殊处理：确保所有建筑类型都存在
      buildings: { ...initial.buildings, ...(loadedState.buildings || {}) },
    };
    set(merged);
  },

  getState: () => get(),
}));
