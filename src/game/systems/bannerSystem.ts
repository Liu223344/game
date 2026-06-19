import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { ResourceState, BannerState } from '@/game/types';

// ============ 旗帜颜色定义 ============
export interface BannerColorDef {
  id: string;
  name: string;
  hex: string;
  description: string;
  bonus: Partial<ResourceState>;
  bonusLabel: string; // 加成描述
}

// 颜色加成：红+攻击/蓝+防御/绿+产量/金+金币
const BANNER_COLORS: Record<string, BannerColorDef> = {
  red: {
    id: 'red',
    name: '赤红',
    hex: '#c0392b',
    description: '象征勇气与力量的赤红之旗，激励军队攻势',
    bonus: { metal: 5 },
    bonusLabel: '兵种攻击+10%',
  },
  blue: {
    id: 'blue',
    name: '深蓝',
    hex: '#2c3e50',
    description: '象征坚韧与防御的深蓝之旗，巩固防线',
    bonus: { stone: 5 },
    bonusLabel: '兵种防御+10%',
  },
  green: {
    id: 'green',
    name: '翠绿',
    hex: '#27ae60',
    description: '象征丰收与生机的翠绿之旗，提升产量',
    bonus: { food: 10, wood: 10 },
    bonusLabel: '资源产量+15%',
  },
  gold: {
    id: 'gold',
    name: '金黄',
    hex: '#f39c12',
    description: '象征财富与繁荣的金黄之旗，招财进宝',
    bonus: { gold: 10 },
    bonusLabel: '金币产量+20%',
  },
  purple: {
    id: 'purple',
    name: '紫罗兰',
    hex: '#8e44ad',
    description: '象征神秘与智慧的紫罗兰之旗，启迪心智',
    bonus: { knowledge: 5 },
    bonusLabel: '知识产量+15%',
  },
  black: {
    id: 'black',
    name: '玄黑',
    hex: '#1a1a1a',
    description: '象征威严与统御的玄黑之旗，震慑四方',
    bonus: { population: 5 },
    bonusLabel: '人口增长+10%',
  },
  white: {
    id: 'white',
    name: '素白',
    hex: '#ecf0f1',
    description: '象征纯洁与信仰的素白之旗，凝聚人心',
    bonus: { food: 5, knowledge: 3 },
    bonusLabel: '幸福度+10%',
  },
  brown: {
    id: 'brown',
    name: '土褐',
    hex: '#8a6630',
    description: '象征质朴与根基的土褐之旗，稳固基础',
    bonus: { wood: 5, stone: 5 },
    bonusLabel: '建材产量+10%',
  },
};

// ============ 旗帜图案定义 ============
export interface BannerPatternDef {
  id: string;
  name: string;
  description: string;
  bonus: Partial<ResourceState>;
  bonusLabel: string;
  unlockTech?: string; // 解锁所需科技
}

// 图案加成：龙+神话召唤/鹰+骑兵/狮+步兵/狼+弓兵
const BANNER_PATTERNS: Record<string, BannerPatternDef> = {
  eagle: {
    id: 'eagle',
    name: '雄鹰',
    description: '展翅高飞的雄鹰，象征骑兵的迅捷与冲击力',
    bonus: { metal: 3 },
    bonusLabel: '骑兵攻击+15%',
  },
  lion: {
    id: 'lion',
    name: '雄狮',
    description: '威风凛凛的雄狮，象征步兵的坚毅与勇猛',
    bonus: { stone: 3 },
    bonusLabel: '步兵防御+15%',
  },
  wolf: {
    id: 'wolf',
    name: '苍狼',
    description: '狡黠迅捷的苍狼，象征弓兵的精准与致命',
    bonus: { wood: 5 },
    bonusLabel: '弓兵攻击+15%',
  },
  dragon: {
    id: 'dragon',
    name: '神龙',
    description: '腾云驾雾的神龙，象征神话兵种的至高召唤',
    bonus: { knowledge: 5, relicFragment: 0 },
    bonusLabel: '神话召唤概率+20%',
    unlockTech: 'mythology',
  },
  phoenix: {
    id: 'phoenix',
    name: '凤凰',
    description: '浴火重生的凤凰，象征不朽与复苏',
    bonus: { food: 5, knowledge: 3 },
    bonusLabel: '兵种生命+10%',
    unlockTech: 'mythology',
  },
  tiger: {
    id: 'tiger',
    name: '猛虎',
    description: '下山猛虎，象征攻城器械的破坏力',
    bonus: { metal: 5 },
    bonusLabel: '攻城伤害+15%',
  },
  bear: {
    id: 'bear',
    name: '巨熊',
    description: '力大无穷的巨熊，象征重装步兵的防御',
    bonus: { stone: 5 },
    bonusLabel: '重装兵种防御+15%',
  },
  snake: {
    id: 'snake',
    name: '灵蛇',
    description: '蜿蜒诡谲的灵蛇，象征隐蔽与突袭',
    bonus: { gold: 5 },
    bonusLabel: '突袭伤害+15%',
  },
  unicorn: {
    id: 'unicorn',
    name: '独角兽',
    description: '纯洁神圣的独角兽，象征治愈与庇护',
    bonus: { food: 8, population: 3 },
    bonusLabel: '治疗效率+20%',
    unlockTech: 'mythology',
  },
  kraken: {
    id: 'kraken',
    name: '海怪',
    description: '深渊触手的海怪，象征海军霸权',
    bonus: { food: 6, gold: 3 },
    bonusLabel: '海军攻击+20%',
    unlockTech: 'mythology',
  },
};

// ============ 旗帜边框定义 ============
export interface BannerBorderDef {
  id: string;
  name: string;
  description: string;
  bonus: Partial<ResourceState>;
  bonusLabel: string;
}

const BANNER_BORDERS: Record<string, BannerBorderDef> = {
  simple: {
    id: 'simple',
    name: '朴素',
    description: '朴素的边框，无额外加成',
    bonus: {},
    bonusLabel: '无加成',
  },
  golden: {
    id: 'golden',
    name: '金边',
    description: '华丽的金色边框，彰显财富',
    bonus: { gold: 5 },
    bonusLabel: '金币产量+10%',
  },
  iron: {
    id: 'iron',
    name: '铁边',
    description: '坚固的铁质边框，象征军事力量',
    bonus: { metal: 3 },
    bonusLabel: '兵种攻击+5%',
  },
  ornate: {
    id: 'ornate',
    name: '华丽',
    description: '极致华丽的装饰边框，全面提升',
    bonus: { gold: 3, knowledge: 3, food: 3 },
    bonusLabel: '全产量+5%',
  },
};

// ============ 旗帜操作 ============

// 获取当前旗帜状态
export function getCurrentBanner(): BannerState {
  return useGameStore.getState().banner;
}

// 更新旗帜设计
export function updateBanner(bgColor: string, pattern: string, border: string): boolean {
  const state = useGameStore.getState();

  // 验证颜色
  if (!BANNER_COLORS[bgColor]) {
    useUIStore.getState().addNotification({ type: 'warning', message: '无效的旗帜颜色' });
    return false;
  }

  // 验证图案
  const patternDef = BANNER_PATTERNS[pattern];
  if (!patternDef) {
    useUIStore.getState().addNotification({ type: 'warning', message: '无效的旗帜图案' });
    return false;
  }

  // 检查图案解锁
  if (patternDef.unlockTech && !state.tech.researched.includes(patternDef.unlockTech)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该图案尚未解锁' });
    return false;
  }

  // 验证边框
  if (!BANNER_BORDERS[border]) {
    useUIStore.getState().addNotification({ type: 'warning', message: '无效的旗帜边框' });
    return false;
  }

  // 更新旗帜
  useGameStore.setState({
    banner: { bgColor, pattern, border },
  });

  const colorDef = BANNER_COLORS[bgColor];
  useUIStore.getState().addNotification({
    type: 'success',
    message: `旗帜已更新：${colorDef.name}底色·${patternDef.name}图案`,
  });

  return true;
}

// 获取旗帜加成（基于颜色和图案）
export function getBannerBonus(): Partial<ResourceState> {
  const state = useGameStore.getState();
  const banner = state.banner;
  const bonus: Partial<ResourceState> = {};

  // 颜色加成
  const colorDef = BANNER_COLORS[banner.bgColor];
  if (colorDef) {
    for (const [res, amount] of Object.entries(colorDef.bonus)) {
      const key = res as keyof ResourceState;
      bonus[key] = (bonus[key] || 0) + (amount as number);
    }
  }

  // 图案加成
  const patternDef = BANNER_PATTERNS[banner.pattern];
  if (patternDef) {
    for (const [res, amount] of Object.entries(patternDef.bonus)) {
      const key = res as keyof ResourceState;
      bonus[key] = (bonus[key] || 0) + (amount as number);
    }
  }

  // 边框加成
  const borderDef = BANNER_BORDERS[banner.border];
  if (borderDef) {
    for (const [res, amount] of Object.entries(borderDef.bonus)) {
      const key = res as keyof ResourceState;
      bonus[key] = (bonus[key] || 0) + (amount as number);
    }
  }

  return bonus;
}

// 获取旗帜加成描述列表
export function getBannerBonusLabels(): string[] {
  const state = useGameStore.getState();
  const banner = state.banner;
  const labels: string[] = [];

  const colorDef = BANNER_COLORS[banner.bgColor];
  if (colorDef) labels.push(`颜色：${colorDef.bonusLabel}`);

  const patternDef = BANNER_PATTERNS[banner.pattern];
  if (patternDef) labels.push(`图案：${patternDef.bonusLabel}`);

  const borderDef = BANNER_BORDERS[banner.border];
  if (borderDef && borderDef.id !== 'simple') {
    labels.push(`边框：${borderDef.bonusLabel}`);
  }

  return labels;
}

// ============ 可用选项查询 ============

// 获取可用颜色
export function getAvailableColors(): BannerColorDef[] {
  return Object.values(BANNER_COLORS);
}

// 获取可用图案（考虑科技解锁）
export function getAvailablePatterns(): BannerPatternDef[] {
  const researched = useGameStore.getState().tech.researched;
  return Object.values(BANNER_PATTERNS).filter(
    (p) => !p.unlockTech || researched.includes(p.unlockTech)
  );
}

// 获取所有图案（不考虑解锁）
export function getAllPatterns(): BannerPatternDef[] {
  return Object.values(BANNER_PATTERNS);
}

// 获取可用边框
export function getAvailableBorders(): BannerBorderDef[] {
  return Object.values(BANNER_BORDERS);
}

// 获取颜色定义
export function getColorDef(colorId: string): BannerColorDef | undefined {
  return BANNER_COLORS[colorId];
}

// 获取图案定义
export function getPatternDef(patternId: string): BannerPatternDef | undefined {
  return BANNER_PATTERNS[patternId];
}

// 获取边框定义
export function getBorderDef(borderId: string): BannerBorderDef | undefined {
  return BANNER_BORDERS[borderId];
}
