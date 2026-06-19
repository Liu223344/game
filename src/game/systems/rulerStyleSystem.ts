import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { RulerStyle, RulerStyleDef, ResourceState } from '@/game/types';

// 统治风格定义数据（项目未单独提供数据文件，此处内联定义）
export const RULER_STYLES: Record<RulerStyle, RulerStyleDef> = {
  tyrant: {
    id: 'tyrant',
    name: '暴君',
    description: '以铁腕手段统治帝国，恐惧让军队更具杀伤力',
    abilities: ['兵种攻击+10%每级', '征服损耗-5%每级', '解锁高压统治能力'],
  },
  benevolent: {
    id: 'benevolent',
    name: '仁君',
    description: '以仁德治理万民，百姓安居乐业，人口繁荣',
    abilities: ['人口上限+100每级', '食物产量+8%每级', '解锁惠民政策能力'],
  },
  scholar: {
    id: 'scholar',
    name: '学者',
    description: '崇尚知识的力量，推动科技与文明进步',
    abilities: ['知识产量+12%每级', '研究速度+5%每级', '解锁学术奖励能力'],
  },
  warlord: {
    id: 'warlord',
    name: '军阀',
    description: '以武立国，军队坚不可摧，所向披靡',
    abilities: ['兵种防御+10%每级', '兵种生命+8%每级', '解锁军事动员能力'],
  },
  merchant: {
    id: 'merchant',
    name: '商人',
    description: '以贸易富国，金币如流水般涌入国库',
    abilities: ['金币产量+15%每级', '市场效果+8%每级', '解锁贸易垄断能力'],
  },
  prophet: {
    id: 'prophet',
    name: '先知',
    description: '聆听神谕，掌握神秘之力，遗物与奇迹的引导者',
    abilities: ['遗物掉落+10%每级', '神秘事件+8%每级', '解锁神谕启示能力'],
  },
};

// 亲和度阈值：达到此值后该风格成为主导
const STYLE_THRESHOLD = 10;

// 获取风格定义
export function getRulerStyle(style: RulerStyle): RulerStyleDef {
  return RULER_STYLES[style];
}

// 获取所有统治风格
export function getAllRulerStyles(): RulerStyleDef[] {
  return Object.values(RULER_STYLES);
}

// 增加风格亲和度
export function addStyleAffinity(style: RulerStyle, amount: number): boolean {
  const state = useGameStore.getState();
  const currentAffinity = state.rulerStyle.affinity[style];
  const newAffinity = Math.max(0, currentAffinity + amount);

  const newAffinityMap = {
    ...state.rulerStyle.affinity,
    [style]: newAffinity,
  };

  // 判断是否需要切换主导风格
  const previousStyle = state.rulerStyle.current;
  let newCurrent = previousStyle;

  // 找到亲和度最高且超过阈值的风格
  let maxStyle: RulerStyle | null = null;
  let maxAffinity = 0;
  for (const [s, a] of Object.entries(newAffinityMap)) {
    if (a > maxAffinity) {
      maxAffinity = a;
      maxStyle = s as RulerStyle;
    }
  }
  if (maxStyle && maxAffinity >= STYLE_THRESHOLD) {
    newCurrent = maxStyle;
  }

  useGameStore.setState({
    rulerStyle: {
      current: newCurrent,
      affinity: newAffinityMap,
    },
  });

  // 主导风格变更通知
  if (newCurrent !== previousStyle && newCurrent) {
    const styleDef = RULER_STYLES[newCurrent];
    useUIStore.getState().addNotification({
      type: 'info',
      message: `统治风格转变为：${styleDef.name}`,
    });
  }

  return true;
}

// 获取当前主导风格
export function getCurrentStyle(): RulerStyle | null {
  return useGameStore.getState().rulerStyle.current;
}

// 获取当前主导风格定义
export function getCurrentStyleDef(): RulerStyleDef | null {
  const current = getCurrentStyle();
  if (!current) return null;
  return RULER_STYLES[current];
}

// 获取当前主导风格的亲和度等级
export function getCurrentStyleLevel(): number {
  const state = useGameStore.getState();
  if (!state.rulerStyle.current) return 0;
  return Math.floor(state.rulerStyle.affinity[state.rulerStyle.current] / STYLE_THRESHOLD);
}

// 获取风格加成（基于当前主导风格及其等级）
export function getStyleBonus(): Partial<ResourceState> {
  const state = useGameStore.getState();
  const bonus: Partial<ResourceState> = {};

  if (!state.rulerStyle.current) return bonus;

  const style = state.rulerStyle.current;
  const level = getCurrentStyleLevel();
  if (level <= 0) return bonus;

  switch (style) {
    case 'tyrant':
      // 暴君：无直接资源加成，返回空（攻击加成由战斗系统读取）
      break;
    case 'benevolent':
      // 仁君：人口+100每级，食物+8每级
      bonus.population = (bonus.population || 0) + level * 100;
      bonus.food = (bonus.food || 0) + level * 8;
      break;
    case 'scholar':
      // 学者：知识+12每级
      bonus.knowledge = (bonus.knowledge || 0) + level * 12;
      break;
    case 'warlord':
      // 军阀：无直接资源加成（防御/HP加成由战斗系统读取）
      bonus.population = (bonus.population || 0) + level * 20;
      break;
    case 'merchant':
      // 商人：金币+15每级
      bonus.gold = (bonus.gold || 0) + level * 15;
      break;
    case 'prophet':
      // 先知：知识+5每级，金币+3每级
      bonus.knowledge = (bonus.knowledge || 0) + level * 5;
      bonus.gold = (bonus.gold || 0) + level * 3;
      break;
  }

  return bonus;
}

// 获取风格能力（返回当前风格的能力描述列表）
export function getStyleAbilities(): string[] {
  const state = useGameStore.getState();
  if (!state.rulerStyle.current) return [];
  return RULER_STYLES[state.rulerStyle.current].abilities;
}

// 获取所有风格的亲和度信息
export function getAllStyleAffinity(): { style: RulerStyle; def: RulerStyleDef; affinity: number; level: number }[] {
  const state = useGameStore.getState();
  return (Object.keys(RULER_STYLES) as RulerStyle[]).map((style) => ({
    style,
    def: RULER_STYLES[style],
    affinity: state.rulerStyle.affinity[style],
    level: Math.floor(state.rulerStyle.affinity[style] / STYLE_THRESHOLD),
  }));
}
