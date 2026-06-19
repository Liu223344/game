// 放置帝国 - 核心类型定义

// ============ 资源系统 ============
export type ResourceType =
  | 'food'      // 食物
  | 'wood'      // 木材
  | 'stone'     // 石头
  | 'metal'     // 金属
  | 'gold'      // 金币
  | 'knowledge' // 知识
  | 'population'; // 人口

export type RareResourceType =
  | 'relicFragment'    // 神器碎片
  | 'geneSample'       // 基因样本
  | 'starCore';        // 星核

export interface ResourceState {
  food: number;
  wood: number;
  stone: number;
  metal: number;
  gold: number;
  knowledge: number;
  population: number;
  relicFragment: number;
  geneSample: number;
  starCore: number;
}

// ============ 建筑系统 ============
export type BuildingType =
  | 'farm'        // 农场
  | 'lumberyard'  // 伐木场
  | 'quarry'      // 采石场
  | 'mine'        // 矿场
  | 'barracks'    // 兵营
  | 'archeryRange' // 靶场
  | 'stable'      // 马厩
  | 'academy'     // 学院
  | 'market'      // 市场
  | 'workshop';   // 工坊

export interface BuildingDef {
  id: BuildingType;
  name: string;
  description: string;
  icon: string;
  produces?: ResourceType;
  baseProduction: number;
  baseCost: Partial<ResourceState>;
  costMultiplier: number; // 每级成本倍数
  unlockTech?: string;    // 解锁所需科技
  category: 'resource' | 'military';
}

export interface BuildingState {
  type: BuildingType;
  level: number;
  isActive: boolean;
}

// ============ 兵种系统 ============
export type TroopClass = 'infantry' | 'archer' | 'cavalry' | 'siege' | 'myth' | 'future' | 'commander' | 'hidden';

export interface TroopDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  class: TroopClass;
  attack: number;
  defense: number;
  hp: number;
  productionTime: number; // 秒
  cost: Partial<ResourceState>;
  building: BuildingType;
  unlockTech?: string;
  counter?: TroopClass[]; // 克制的兵种
  isSuperTroop?: boolean;
  isLegendary?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface TroopState {
  defId: string;
  count: number;
  inProduction: number;
  productionProgress: number; // 0-1
}

// ============ 战斗系统 ============
export interface EnemyDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  attack: number;
  defense: number;
  hp: number;
  troops: { class: TroopClass; count: number }[];
  rewards: {
    resources?: Partial<ResourceState>;
    drops?: DropTable;
    experience: number;
  };
  unlockCondition?: string;
  isBoss?: boolean;
}

export interface DropTable {
  items: DropEntry[];
}

export interface DropEntry {
  type: 'resource' | 'techFragment' | 'relic' | 'troop' | 'item';
  id: string;
  chance: number; // 0-1
  minAmount: number;
  maxAmount: number;
}

export interface BattleResult {
  victory: boolean;
  playerLosses: { defId: string; lost: number }[];
  enemyLosses: { class: TroopClass; lost: number }[];
  rewards: {
    resources: Partial<ResourceState>;
    drops: DropResult[];
    experience: number;
  };
}

export interface DropResult {
  type: DropEntry['type'];
  id: string;
  amount: number;
  name: string;
}

// ============ 科技系统 ============
export interface TechDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number; // 知识
  prerequisites: string[];
  unlocks: {
    buildings?: BuildingType[];
    troops?: string[];
    wonders?: string[];
    mechanics?: string[];
  };
  era: string; // 所属时代（模糊）
  historicalEvent?: string; // 真实历史事件
  knowledge?: string; // 真实知识百科
}

export interface TechState {
  researched: string[];
  current: string | null;
  progress: number; // 0-1
}

// ============ 领土系统 ============
export type TerritoryType = 'plain' | 'forest' | 'mountain' | 'desert' | 'ocean' | 'sky' | 'underground' | 'space';
export type TerritoryDimension = 'surface' | 'underground' | 'sky' | 'ocean' | 'space';

export interface TerritoryDef {
  id: string;
  name: string;
  description: string;
  type: TerritoryType;
  dimension: TerritoryDimension;
  x: number;
  y: number;
  defender: { class: TroopClass; count: number }[];
  rewards: {
    resources?: Partial<ResourceState>;
    bonus?: Partial<ResourceState>; // 持续加成
    civilization?: string; // 文明遗产
  };
  modifications?: TerritoryModification[];
}

export interface TerritoryModification {
  id: string;
  name: string;
  cost: Partial<ResourceState>;
  resultBonus: Partial<ResourceState>;
}

export interface TerritoryState {
  defId: string;
  owned: boolean;
  modification?: string;
}

// ============ 奇观系统 ============
export interface WonderDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: Partial<ResourceState>;
  buildTime: number; // 秒
  effect: string;
  effectBonus: Partial<ResourceState> | ((state: any) => Partial<ResourceState>);
  synergyWith?: string;
  synergyEffect?: string;
  unlockTech: string;
}

export interface WonderState {
  defId: string;
  built: boolean;
  buildProgress: number; // 0-1
}

// ============ 转生系统 ============
export type CivilizationType = 'roman' | 'mongol' | 'egyptian' | 'mayan' | 'greek' | 'chinese' | 'persian' | 'norse';

export interface CivilizationDef {
  id: CivilizationType;
  name: string;
  description: string;
  icon: string;
  bonuses: {
    description: string;
    effect: Partial<ResourceState> | string;
  }[];
}

export type RulerStyle = 'tyrant' | 'benevolent' | 'scholar' | 'warlord' | 'merchant' | 'prophet';

export interface RulerStyleDef {
  id: RulerStyle;
  name: string;
  description: string;
  abilities: string[];
}

export interface RebirthUpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number; // 转生货币
  effect: string;
  category: 'military' | 'economy' | 'tech' | 'expansion';
  maxLevel: number;
  costMultiplier: number;
}

export interface RebirthState {
  currency: number; // 转生货币
  upgrades: { id: string; level: number }[];
  civilization: CivilizationType | null;
  totalRebirths: number;
  talentTree: { nodeId: string; unlocked: boolean }[];
}

// ============ 遗物系统 ============
export interface RelicDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'rare' | 'epic' | 'legendary' | 'mythic';
  effect: string;
  setId?: string;
  setBonus?: string;
}

export interface RelicState {
  defId: string;
  count: number;
  equipped: boolean;
}

// ============ 统治风格 ============
export interface RulerStyleState {
  current: RulerStyle | null;
  affinity: Record<RulerStyle, number>; // 各风格亲和度
}

// ============ 旗帜系统 ============
export interface BannerState {
  bgColor: string;
  pattern: string;
  border: string;
}

// ============ 图鉴系统 ============
export interface CodexState {
  discoveredTroops: string[];
  discoveredTechs: string[];
  discoveredCivilizations: string[];
  discoveredRelics: string[];
  discoveredEvents: string[];
  decodedLanguages: string[];
}

// ============ 随机事件 ============
export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'merchant' | 'festival' | 'disaster' | 'discovery' | 'mystery';
  choices: EventChoice[];
  condition?: (state: any) => boolean;
}

export interface EventChoice {
  text: string;
  effects: string[];
  requirements?: Partial<ResourceState>;
}

// ============ 王朝继承系统 ============
export type RulerSkillBranch = 'leadership' | 'strategy' | 'governance' | 'charisma' | 'arcane';
export type HeirEducation = 'military' | 'civic' | 'diplomacy' | 'academic';

export interface RulerSkillTree {
  leadership: number;   // 领导：全产出加成
  strategy: number;     // 战略：战斗加成
  governance: number;   // 治理：合法性维持
  charisma: number;     // 魅力：文化影响力
  arcane: number;       // 秘术：科技/遗物加成
}

export interface RulerEquipment {
  crown?: string;    // 王冠
  weapon?: string;   // 宝剑
  robe?: string;     // 龙袍
  seal?: string;     // 玉玺
}

export interface HeirState {
  id: string;
  name: string;
  age: number;
  education: HeirEducation;
  educationProgress: number; // 0-1
  traits: string[];          // 继承的特质
  potential: number;         // 潜力 0-1
}

export interface RulerState {
  id: string;
  name: string;
  age: number;          // 以"天"为单位，365天=1年
  ageInDays: number;
  stamina: number;      // 体力
  intelligence: number; // 智力
  charisma: number;     // 魅力
  isAlive: boolean;
  skills: RulerSkillTree;
  equipment: RulerEquipment;
  heirs: HeirState[];
  reignStart: number;   // 在位起始时间（playTime）
  dynastyCount: number; // 王朝更替次数
}

// ============ 天命合法性系统 ============
export interface LegitimacyState {
  value: number;       // 0-100
  history: { time: number; value: number; reason: string }[];
}

// ============ 季节天气系统 ============
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type WeatherType = 'sunny' | 'rainstorm' | 'drought' | 'blizzard' | 'aurora';

export interface SeasonState {
  current: Season;
  dayInSeason: number;  // 当前季节第几天（0-119）
  weather: WeatherType;
  weatherDaysLeft: number; // 当前天气剩余天数
}

// ============ 帝国编年史系统 ============
export type ChronicleCategory = 'politics' | 'military' | 'tech' | 'culture' | 'disaster' | 'diplomacy';

export interface ChronicleEntry {
  id: string;
  year: number;          // 游戏内年份
  category: ChronicleCategory;
  title: string;
  description: string;
  impact?: string;
  timestamp: number;     // playTime
  reign: number;         // 第几代统治者
}

// ============ 外交与AI帝国系统 ============
export type DiplomaticRelation = 'hostile' | 'neutral' | 'friendly' | 'ally' | 'war';

export interface AIEmpire {
  id: string;
  name: string;
  civilization: CivilizationType;
  power: number;              // 综合国力
  relation: number;           // -100 到 100
  relationStatus: DiplomaticRelation;
  territories: number;        // 拥有领地数
  armySize: number;           // 军队规模
  isAlive: boolean;
  tradeCooldown: number;      // 贸易冷却（tick）
  lastAction: string;         // 上次行动描述
}

export interface DiplomacyState {
  empires: AIEmpire[];
  tradeHistory: { empireId: string; type: 'import' | 'export'; resource: ResourceType; amount: number; time: number }[];
}

// ============ 文化影响力系统 ============
export interface CultureState {
  value: number;          // 文化值
  influence: number;      // 文化影响力
  influenceRange: number; // 影响半径
}

// ============ 生态系统平衡系统 ============
export interface EcologyState {
  value: number;          // 0-100
  degradedTerritories: string[]; // 荒漠化的领地
}

// ============ 灾害链式反应系统 ============
export type DisasterType = 'earthquake' | 'tsunami' | 'plague' | 'famine' | 'volcano' | 'meteor' | 'ai_rebellion';

export interface Disaster {
  id: string;
  type: DisasterType;
  name: string;
  intensity: number;       // 1-10
  stage: number;           // 当前链式阶段
  maxStage: number;        // 最大阶段
  daysLeft: number;        // 当前阶段剩余天数
  isActive: boolean;
}

// ============ 多元宇宙系统 ============
export type UniverseType = 'mirror' | 'frozen' | 'inferno' | 'quantum' | 'void';

export interface UniverseDef {
  id: UniverseType;
  name: string;
  description: string;
  rule: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  reward: string;
}

export interface MultiverseState {
  currentUniverse: UniverseType | null;  // 当前所在宇宙
  universes: UniverseDef[];
  explorationProgress: number;  // 当前宇宙探索进度 0-1
}

// ============ 语言破译系统 ============
export interface CipherDocument {
  id: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  encryptedText: string;
  cipherMap: Record<string, string>;  // 加密映射
  knownChars: string[];               // 已破译字符
  isDecoded: boolean;
  reward: {
    type: 'tech' | 'relic' | 'troop' | 'currency';
    id: string;
    amount: number;
  };
}

// ============ 游戏状态 ============
export interface GameState {
  // 基础
  version: number;
  lastSave: number;
  playTime: number;
  gameSpeed: number;

  // 资源
  resources: ResourceState;

  // 建筑
  buildings: Record<BuildingType, BuildingState>;

  // 兵种
  troops: TroopState[];

  // 科技
  tech: TechState;

  // 领土
  territories: TerritoryState[];

  // 奇观
  wonders: WonderState[];

  // 转生
  rebirth: RebirthState;

  // 遗物
  relics: RelicState[];

  // 统治风格
  rulerStyle: RulerStyleState;

  // 旗帜
  banner: BannerState;

  // 图鉴
  codex: CodexState;

  // 时代印记
  eraImprints: string[];

  // 当前战斗
  currentBattle: {
    enemyId: string;
    deployedTroops: { defId: string; count: number }[];
    progress: number;
  } | null;

  // 事件
  activeEvents: string[];

  // 王朝继承系统
  ruler: RulerState;

  // 天命合法性系统
  legitimacy: LegitimacyState;

  // 季节天气系统
  season: SeasonState;

  // 帝国编年史
  chronicle: ChronicleEntry[];

  // 外交与AI帝国
  diplomacy: DiplomacyState;

  // 文化影响力
  culture: CultureState;

  // 生态系统
  ecology: EcologyState;

  // 灾害系统
  disasters: Disaster[];

  // 多元宇宙
  multiverse: MultiverseState;

  // 语言破译
  cipherDocuments: CipherDocument[];
}

// ============ UI状态 ============
export type PanelType =
  | 'buildings'
  | 'troops'
  | 'combat'
  | 'worldmap'
  | 'tech'
  | 'wonders'
  | 'ruler'
  | 'rebirth'
  | 'codex'
  | 'chronicle'
  | 'diplomacy'
  | 'multiverse'
  | 'cipher'
  | 'stats'
  | 'settings';

export interface UIState {
  currentPanel: PanelType;
  notifications: Notification[];
  modals: { id: string; data?: any }[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}
