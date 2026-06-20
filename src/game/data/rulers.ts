// 放置帝国 - 统治者数据定义
import type { RulerSkillBranch, HeirEducation, ResourceState } from '@/game/types';

// ============ 统治者技能分支 ============
export interface RulerSkillDef {
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  effect: string;
  bonusPerLevel: number; // 每级加成百分比
}

export const RULER_SKILLS: Record<RulerSkillBranch, RulerSkillDef> = {
  leadership: {
    name: '领导',
    description: '提升全帝国资源产出',
    icon: '👑',
    maxLevel: 20,
    effect: '每级 +5% 全资源产出',
    bonusPerLevel: 0.05,
  },
  strategy: {
    name: '战略',
    description: '提升军队战斗力',
    icon: '⚔️',
    maxLevel: 20,
    effect: '每级 +5% 军队攻击与防御',
    bonusPerLevel: 0.05,
  },
  governance: {
    name: '治理',
    description: '维持合法性，减少叛乱',
    icon: '⚖️',
    maxLevel: 20,
    effect: '每级 +2 合法性自然恢复/年',
    bonusPerLevel: 2,
  },
  charisma: {
    name: '魅力',
    description: '提升文化影响力与人口增长',
    icon: '💫',
    maxLevel: 20,
    effect: '每级 +5% 文化值与人口增长',
    bonusPerLevel: 0.05,
  },
  arcane: {
    name: '秘术',
    description: '提升科技研究速度与遗物效果',
    icon: '🔮',
    maxLevel: 20,
    effect: '每级 +5% 科技速度与遗物加成',
    bonusPerLevel: 0.05,
  },
};

// ============ 统治者装备 ============
export interface RulerEquipmentDef {
  id: string;
  slot: 'crown' | 'weapon' | 'robe' | 'seal';
  name: string;
  description: string;
  icon: string;
  bonus: Partial<ResourceState>;
  unlockTech?: string;
}

export const RULER_EQUIPMENT: RulerEquipmentDef[] = [
  // 王冠
  {
    id: 'crown_bronze',
    slot: 'crown',
    name: '青铜王冠',
    description: '远古时代的简陋王冠',
    icon: '👑',
    bonus: { gold: 2 },
  },
  {
    id: 'crown_iron',
    slot: 'crown',
    name: '铁血王冠',
    description: '铁器时代的王者之冠',
    icon: '👑',
    bonus: { gold: 5, population: 2 },
    unlockTech: 'ironWorking',
  },
  {
    id: 'crown_golden',
    slot: 'crown',
    name: '黄金帝冠',
    description: '黄金打造的辉煌帝冠',
    icon: '👑',
    bonus: { gold: 15, knowledge: 5 },
    unlockTech: 'trade',
  },
  // 宝剑
  {
    id: 'weapon_bronze',
    slot: 'weapon',
    name: '青铜宝剑',
    description: '远古统治者的佩剑',
    icon: '⚔️',
    bonus: { metal: 1 },
  },
  {
    id: 'weapon_steel',
    slot: 'weapon',
    name: '精钢长剑',
    description: '锋利无比的精钢剑',
    icon: '⚔️',
    bonus: { metal: 3, food: 2 },
    unlockTech: 'ironWorking',
  },
  {
    id: 'weapon_legendary',
    slot: 'weapon',
    name: '王者之剑',
    description: '传说中能号令万军的神剑',
    icon: '⚔️',
    bonus: { metal: 8, gold: 5 },
    unlockTech: 'industry',
  },
  // 龙袍
  {
    id: 'robe_linen',
    slot: 'robe',
    name: '亚麻长袍',
    description: '简朴的统治者长袍',
    icon: '👘',
    bonus: { food: 1 },
  },
  {
    id: 'robe_silk',
    slot: 'robe',
    name: '丝绸龙袍',
    description: '华贵的丝绸龙袍',
    icon: '👘',
    bonus: { gold: 3, population: 3 },
    unlockTech: 'trade',
  },
  {
    id: 'robe_imperial',
    slot: 'robe',
    name: '天命帝袍',
    description: '象征天命的华美帝袍',
    icon: '👘',
    bonus: { gold: 8, knowledge: 3, population: 5 },
    unlockTech: 'writing',
  },
  // 玉玺
  {
    id: 'seal_stone',
    slot: 'seal',
    name: '石质印章',
    description: '远古时代的权力印记',
    icon: '📜',
    bonus: { stone: 1 },
  },
  {
    id: 'seal_jade',
    slot: 'seal',
    name: '传国玉玺',
    description: '由和氏璧雕琢而成的传国之宝',
    icon: '📜',
    bonus: { gold: 5, knowledge: 5 },
    unlockTech: 'writing',
  },
  {
    id: 'seal_celestial',
    slot: 'seal',
    name: '天命玉玺',
    description: '受命于天的至高玉玺',
    icon: '📜',
    bonus: { gold: 10, knowledge: 10, population: 8 },
    unlockTech: 'mythology',
  },
];

// ============ 继承人教育方向 ============
export interface HeirEducationDef {
  name: string;
  description: string;
  skillBoost: RulerSkillBranch; // 主要提升的技能
  icon: string;
}

export const HEIR_EDUCATIONS: Record<HeirEducation, HeirEducationDef> = {
  military: {
    name: '军事教育',
    description: '培养战略才能，提升strategy技能继承',
    skillBoost: 'strategy',
    icon: '⚔️',
  },
  civic: {
    name: '内政教育',
    description: '培养治理才能，提升governance技能继承',
    skillBoost: 'governance',
    icon: '⚖️',
  },
  diplomacy: {
    name: '外交教育',
    description: '培养魅力与外交，提升charisma技能继承',
    skillBoost: 'charisma',
    icon: '🤝',
  },
  academic: {
    name: '学术教育',
    description: '培养学识与秘术，提升arcane技能继承',
    skillBoost: 'arcane',
    icon: '📚',
  },
};

// ============ 统治者特质 ============
export interface RulerTraitDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: string;
}

export const RULER_TRAITS: RulerTraitDef[] = [
  {
    id: 'ambitious',
    name: '雄才大略',
    description: '具有宏大抱负的统治者',
    icon: '🦅',
    effect: '全产出 +10%',
  },
  {
    id: 'benevolent',
    name: '仁慈宽厚',
    description: '深受民众爱戴',
    icon: '🕊️',
    effect: '人口增长 +20%，合法性 +5',
  },
  {
    id: 'ruthless',
    name: '残暴无情',
    description: '以铁腕手段统治',
    icon: '💀',
    effect: '军队攻击 +15%，合法性 -5',
  },
  {
    id: 'wise',
    name: '睿智多谋',
    description: '智慧超群的统治者',
    icon: '🦉',
    effect: '科技速度 +15%',
  },
  {
    id: 'pious',
    name: '虔诚笃信',
    description: '深受神职人员拥护',
    icon: '🙏',
    effect: '文化值 +20%',
  },
  {
    id: 'merchant',
    name: '精于商贾',
    description: '商业头脑敏锐',
    icon: '💰',
    effect: '金币产出 +25%',
  },
  {
    id: 'warrior',
    name: '武勇过人',
    description: '亲自上阵的勇将',
    icon: '🛡️',
    effect: '军队防御 +20%',
  },
  {
    id: 'scholar',
    name: '博学多才',
    description: '学识渊博的学者型统治者',
    icon: '📖',
    effect: '知识产出 +25%',
  },
  {
    id: 'diplomat',
    name: '长袖善舞',
    description: '外交手腕高超',
    icon: '🎭',
    effect: '外交关系 +20%',
  },
  {
    id: 'mystic',
    name: '通晓秘术',
    description: '掌握神秘力量',
    icon: '🔮',
    effect: '遗物效果 +30%',
  },
];

// 根据slot获取装备
export function getEquipmentBySlot(slot: 'crown' | 'weapon' | 'robe' | 'seal'): RulerEquipmentDef[] {
  return RULER_EQUIPMENT.filter((e) => e.slot === slot);
}

// 根据id获取装备
export function getEquipmentById(id: string): RulerEquipmentDef | undefined {
  return RULER_EQUIPMENT.find((e) => e.id === id);
}
