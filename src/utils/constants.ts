import type { ResourceType, RareResourceType, Season, WeatherType } from '@/game/types';

// 游戏常量
export const GAME_VERSION = 1;
export const TICK_INTERVAL = 1000; // 1秒
export const AUTO_SAVE_INTERVAL = 30000; // 30秒
export const OFFLINE_MAX_HOURS = 24;
export const OFFLINE_EFFICIENCY = 0.5;

// 王朝继承常量
export const DAYS_PER_YEAR = 365;       // 1年=365天（tick）
export const RULER_BASE_LIFESPAN = 60;  // 基础寿命60年
export const RULER_MAX_LIFESPAN = 100;  // 最大寿命100年
export const SEASON_LENGTH = 120;       // 每季120天
export const YEAR_LENGTH = SEASON_LENGTH * 4; // 480天/年

// 资源信息
export const RESOURCE_INFO: Record<ResourceType, { name: string; icon: string; color: string }> = {
  food: { name: '食物', icon: '🌾', color: 'text-green-400' },
  wood: { name: '木材', icon: '🪵', color: 'text-amber-500' },
  stone: { name: '石头', icon: '🪨', color: 'text-gray-400' },
  metal: { name: '金属', icon: '⚙️', color: 'text-slate-300' },
  gold: { name: '金币', icon: '🪙', color: 'text-yellow-400' },
  knowledge: { name: '知识', icon: '📜', color: 'text-blue-400' },
  population: { name: '人口', icon: '👥', color: 'text-purple-400' },
};

export const RARE_RESOURCE_INFO: Record<RareResourceType, { name: string; icon: string; color: string }> = {
  relicFragment: { name: '神器碎片', icon: '💎', color: 'text-pink-400' },
  geneSample: { name: '基因样本', icon: '🧬', color: 'text-emerald-400' },
  starCore: { name: '星核', icon: '⭐', color: 'text-indigo-400' },
};

// 初始资源
export const INITIAL_RESOURCES = {
  food: 100,
  wood: 100,
  stone: 50,
  metal: 20,
  gold: 50,
  knowledge: 0,
  population: 10,
  relicFragment: 0,
  geneSample: 0,
  starCore: 0,
};

// 面板信息
export const PANEL_INFO = {
  buildings: { name: '建筑', icon: '🏛️' },
  troops: { name: '兵营', icon: '⚔️' },
  combat: { name: '战斗', icon: '🛡️' },
  worldmap: { name: '地图', icon: '🗺️' },
  tech: { name: '科技', icon: '🔬' },
  wonders: { name: '奇观', icon: '🗿' },
  ruler: { name: '统治者', icon: '👑' },
  rebirth: { name: '转生', icon: '♻️' },
  codex: { name: '图鉴', icon: '📖' },
  chronicle: { name: '编年史', icon: '📜' },
  diplomacy: { name: '外交', icon: '🤝' },
  multiverse: { name: '多元宇宙', icon: '🌌' },
  cipher: { name: '破译', icon: '🔐' },
  stats: { name: '统计', icon: '📊' },
  settings: { name: '设置', icon: '⚙️' },
} as const;

// 时代名称（与 techs.ts 和 techSystem.ts 保持一致，共11个时代）
export const ERA_NAMES = [
  '石器时代',
  '青铜时代',
  '铁器时代',
  '火药时代',
  '蒸汽时代',
  '电力时代',
  '核能时代',
  '信息时代',
  '太空时代',
  '未来时代',
  '因果律时代',
];

// 季节信息
export const SEASON_INFO: Record<Season, { name: string; icon: string; color: string }> = {
  spring: { name: '春', icon: '🌱', color: 'text-green-400' },
  summer: { name: '夏', icon: '☀️', color: 'text-yellow-400' },
  autumn: { name: '秋', icon: '🍂', color: 'text-orange-400' },
  winter: { name: '冬', icon: '❄️', color: 'text-blue-300' },
};

// 天气信息
export const WEATHER_INFO: Record<WeatherType, { name: string; icon: string }> = {
  sunny: { name: '晴朗', icon: '🌤️' },
  rainstorm: { name: '暴雨', icon: '⛈️' },
  drought: { name: '干旱', icon: '🏜️' },
  blizzard: { name: '暴风雪', icon: '🌨️' },
  aurora: { name: '极光', icon: '🌌' },
};

// 统治者名字池
export const RULER_NAMES = [
  '亚历山大', '凯撒', '奥古斯都', '图拉真', '哈德良', '君士坦丁',
  '查士丁尼', '查理曼', '腓特烈', '拿破仑', '伊丽莎白', '维多利亚',
  '武则天', '李世民', '康熙', '汉武帝', '秦始皇', '成吉思汗',
  '居鲁士', '大流士', '萨尔贡', '汉谟拉比', '拉美西斯', '克利奥帕特拉',
];

export const HEIR_NAMES = [
  '小亚历山大', '小凯撒', '王子', '公主', '皇太子', '皇太女',
  '世子', '郡王', '亲王', '长公主', '二王子', '三王子',
];
