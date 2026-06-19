import type { CivilizationDef } from '@/game/types';

// 文明特质数据 - 转生时可选的文明，每个文明提供独特加成
export const CIVILIZATIONS: Record<string, CivilizationDef> = {
  roman: {
    id: 'roman',
    name: '罗马',
    description: '永恒之城的后裔，纪律严明的军团与不朽的工程奇迹铸就帝国',
    icon: '🏛️',
    bonuses: [
      {
        description: '步兵攻击+15%，防御+15%',
        effect: 'infantryAttackBonus:0.15,infantryDefenseBonus:0.15',
      },
      {
        description: '建筑建造速度+20%',
        effect: { stone: 2, wood: 2, metal: 1 },
      },
      {
        description: '人口上限+500',
        effect: { population: 500 },
      },
    ],
  },
  mongol: {
    id: 'mongol',
    name: '蒙古',
    description: '草原的征服者，铁蹄踏遍欧亚，闪电般的骑兵横扫一切',
    icon: '🏹',
    bonuses: [
      {
        description: '骑兵产量+30%，移动速度+25%',
        effect: 'cavalryProductionBonus:0.3,cavalrySpeedBonus:0.25',
      },
      {
        description: '兵种生产速度+20%',
        effect: { food: 5, metal: 2 },
      },
      {
        description: '领土征服后奖励+50%',
        effect: 'territoryRewardBonus:0.5',
      },
    ],
  },
  egyptian: {
    id: 'egyptian',
    name: '埃及',
    description: '尼罗河的子民，金字塔的建造者，永恒奇迹的缔造者',
    icon: '🔺',
    bonuses: [
      {
        description: '奇观效果+50%，建造速度+30%',
        effect: 'wonderEffectBonus:0.5,wonderBuildSpeedBonus:0.3',
      },
      {
        description: '食物产量+25%',
        effect: { food: 8 },
      },
      {
        description: '遗物掉落概率+20%',
        effect: 'relicDropBonus:0.2',
      },
    ],
  },
  mayan: {
    id: 'mayan',
    name: '玛雅',
    description: '雨林中的天文大师，历法与数学的先驱，知识的守护者',
    icon: '🌅',
    bonuses: [
      {
        description: '知识产量+40%，研究速度+25%',
        effect: { knowledge: 6 },
      },
      {
        description: '科技成本-15%',
        effect: 'techCostReduction:0.15',
      },
      {
        description: '神秘事件触发概率+30%',
        effect: 'mysteryEventBonus:0.3',
      },
    ],
  },
  greek: {
    id: 'greek',
    name: '希腊',
    description: '哲学与民主的摇篮，神话生物的故乡，智慧与战争的平衡者',
    icon: '🏺',
    bonuses: [
      {
        description: '知识产量+20%，神话兵种攻击+20%',
        effect: { knowledge: 3 },
      },
      {
        description: '神话兵种生产成本-25%',
        effect: 'mythTroopCostReduction:0.25',
      },
      {
        description: '人口幸福度+20%',
        effect: { population: 300, gold: 3 },
      },
    ],
  },
  chinese: {
    id: 'chinese',
    name: '中国',
    description: '天朝上国，四大发明的故乡，绵延千年的文明传承',
    icon: '🐉',
    bonuses: [
      {
        description: '所有资源产量+10%',
        effect: { food: 2, wood: 2, stone: 2, metal: 2, gold: 2, knowledge: 2 },
      },
      {
        description: '科技研究速度+15%，奇观效果+20%',
        effect: { knowledge: 2 },
      },
      {
        description: '人口上限+1000，人口增长+30%',
        effect: { population: 1000, food: 3 },
      },
    ],
  },
  persian: {
    id: 'persian',
    name: '波斯',
    description: '万王之王的帝国，丝绸之路的枢纽，富甲天下的商业文明',
    icon: '🦁',
    bonuses: [
      {
        description: '金币产量+40%，贸易收入+50%',
        effect: { gold: 10 },
      },
      {
        description: '市场建筑效果+30%',
        effect: { gold: 5 },
      },
      {
        description: '资源兑换比率+25%',
        effect: 'tradeRateBonus:0.25',
      },
    ],
  },
  norse: {
    id: 'norse',
    name: '北欧',
    description: '维京海盗的后裔，奥丁的勇士，狂战士与航海家的故乡',
    icon: '⚡',
    bonuses: [
      {
        description: '步兵攻击+25%，狂战士兵种解锁',
        effect: 'infantryAttackBonus:0.25',
      },
      {
        description: '海上领地产量+50%，海上战斗+20%',
        effect: { gold: 5, food: 3 },
      },
      {
        description: '战斗经验+30%',
        effect: 'battleExperienceBonus:0.3',
      },
    ],
  },
};

// 获取文明定义
export function getCivilization(id: string): CivilizationDef | undefined {
  return CIVILIZATIONS[id];
}

// 获取所有文明
export function getAllCivilizations(): CivilizationDef[] {
  return Object.values(CIVILIZATIONS);
}
