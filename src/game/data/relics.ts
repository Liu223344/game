import type { RelicDef } from '@/game/types';

// 遗物数据 - 稀有神器，提供独特加成，部分可组成套装
export const RELICS: Record<string, RelicDef> = {
  // ============ 稀有遗物 (rare) ============
  ancientCoin: {
    id: 'ancientCoin',
    name: '远古金币',
    description: '刻有失落文明图案的古老金币，散发着微弱的魔力',
    icon: '🪙',
    rarity: 'rare',
    effect: '金币产量+10%',
  },
  warriorsTotem: {
    id: 'warriorsTotem',
    name: '战士图腾',
    description: '部落时代的战神图腾，能激发战士的勇气',
    icon: '🪨',
    rarity: 'rare',
    effect: '步兵攻击+8%',
  },
  herbalistPouch: {
    id: 'herbalistPouch',
    name: '草药师之囊',
    description: '装满珍稀草药的皮囊，散发着草药清香',
    icon: '🌿',
    rarity: 'rare',
    effect: '食物产量+10%',
  },
  minersPickaxe: {
    id: 'minersPickaxe',
    name: '矿工神镐',
    description: '传说矮人王使用过的神镐，能感知矿脉',
    icon: '⛏️',
    rarity: 'rare',
    effect: '金属产量+10%',
  },
  scholarsQuill: {
    id: 'scholarsQuill',
    name: '学者之笔',
    description: '大图书馆馆长的鹅毛笔，书写过无数典籍',
    icon: '🪶',
    rarity: 'rare',
    effect: '知识产量+12%',
  },

  // ============ 史诗遗物 (epic) ============
  dragonScaleArmor: {
    id: 'dragonScaleArmor',
    name: '龙鳞甲',
    description: '以远古巨龙鳞片锻造的铠甲，坚不可摧，防火抗魔',
    icon: '🐲',
    rarity: 'epic',
    effect: '所有兵种防御+15%',
    setId: 'dragonSet',
    setBonus: '龙之力量：集齐龙鳞甲、龙牙剑、龙翼披风，所有兵种攻击+25%',
  },
  dragonFangSword: {
    id: 'dragonFangSword',
    name: '龙牙剑',
    description: '以巨龙獠牙打磨的利刃，削铁如泥，附有龙炎',
    icon: '⚔️',
    rarity: 'epic',
    effect: '所有兵种攻击+12%',
    setId: 'dragonSet',
    setBonus: '龙之力量：集齐龙鳞甲、龙牙剑、龙翼披风，所有兵种攻击+25%',
  },
  dragonWingCloak: {
    id: 'dragonWingCloak',
    name: '龙翼披风',
    description: '以龙翼膜制成的披风，轻盈如风，赋予穿戴者敏捷',
    icon: '🦇',
    rarity: 'epic',
    effect: '兵种生产速度+15%',
    setId: 'dragonSet',
    setBonus: '龙之力量：集齐龙鳞甲、龙牙剑、龙翼披风，所有兵种攻击+25%',
  },
  prophetsEye: {
    id: 'prophetsEye',
    name: '先知之眼',
    description: '能窥见未来的神秘宝石，先知遗留的圣物',
    icon: '👁️',
    rarity: 'epic',
    effect: '知识产量+20%，研究速度+10%',
    setId: 'prophetSet',
    setBonus: '先知智慧：集齐先知之眼、先知权杖、先知长袍，知识产量+50%',
  },
  prophetsStaff: {
    id: 'prophetsStaff',
    name: '先知权杖',
    description: '先知持有的权杖，顶端宝石蕴含神秘力量',
    icon: '🪄',
    rarity: 'epic',
    effect: '神秘事件触发+20%',
    setId: 'prophetSet',
    setBonus: '先知智慧：集齐先知之眼、先知权杖、先知长袍，知识产量+50%',
  },
  prophetsRobe: {
    id: 'prophetsRobe',
    name: '先知长袍',
    description: '先知穿着的神秘长袍，绣有星辰图案',
    icon: '👘',
    rarity: 'epic',
    effect: '人口幸福度+15%',
    setId: 'prophetSet',
    setBonus: '先知智慧：集齐先知之眼、先知权杖、先知长袍，知识产量+50%',
  },
  phoenixFeather: {
    id: 'phoenixFeather',
    name: '凤凰之羽',
    description: '不朽凤凰遗落的尾羽，温暖如阳，蕴含重生之力',
    icon: '🪶',
    rarity: 'epic',
    effect: '兵种复活概率+15%',
  },
  krakenPearl: {
    id: 'krakenPearl',
    name: '克拉肯之珠',
    description: '从深海巨怪体内取出的巨大珍珠，蕴含海洋之力',
    icon: '🔮',
    rarity: 'epic',
    effect: '海上领地产量+30%',
  },

  // ============ 传说遗物 (legendary) ============
  eternalCrown: {
    id: 'eternalCrown',
    name: '永恒之冠',
    description: '传说中永恒帝王的王冠，戴上者将获得不朽的统治力',
    icon: '👑',
    rarity: 'legendary',
    effect: '所有资源产量+25%，人口上限+1000',
    setId: 'eternitySet',
    setBonus: '永恒统治：集齐永恒之冠、永恒之心、永恒之刃，所有产量+50%，转生货币+100%',
  },
  eternalHeart: {
    id: 'eternalHeart',
    name: '永恒之心',
    description: '永不停止跳动的神秘心脏，蕴含无尽生命力',
    icon: '💖',
    rarity: 'legendary',
    effect: '人口增长+50%，食物产量+30%',
    setId: 'eternitySet',
    setBonus: '永恒统治：集齐永恒之冠、永恒之心、永恒之刃，所有产量+50%，转生货币+100%',
  },
  eternalBlade: {
    id: 'eternalBlade',
    name: '永恒之刃',
    description: '永不磨损的神兵，斩断时间与空间，传说中的终极武器',
    icon: '🗡️',
    rarity: 'legendary',
    effect: '所有兵种攻击+25%，防御+15%',
    setId: 'eternitySet',
    setBonus: '永恒统治：集齐永恒之冠、永恒之心、永恒之刃，所有产量+50%，转生货币+100%',
  },
  excalibur: {
    id: 'excalibur',
    name: '王者之剑',
    description: '石中剑的真身，亚瑟王的传奇佩剑，唯有真王可拔',
    icon: '⚔️',
    rarity: 'legendary',
    effect: '指挥官兵种攻击+50%',
  },
  pandoraBox: {
    id: 'pandoraBox',
    name: '潘多拉魔盒',
    description: '装满灾厄与希望的神秘盒子，开启者将面对未知',
    icon: '🎁',
    rarity: 'legendary',
    effect: '随机事件触发+40%，事件奖励+30%',
  },
  philosophersStone: {
    id: 'philosophersStone',
    name: '贤者之石',
    description: '炼金术的终极追求，能点石成金，赋予永生',
    icon: '💎',
    rarity: 'legendary',
    effect: '金币产量+50%，资源兑换无损耗',
  },

  // ============ 神话遗物 (mythic) ============
  worldTreeSeed: {
    id: 'worldTreeSeed',
    name: '世界树之种',
    description: '北欧神话世界树伊格德拉修的种子，蕴含连接九界的力量',
    icon: '🌱',
    rarity: 'mythic',
    effect: '所有产量+40%，所有维度领地解锁',
  },
  chaosOrb: {
    id: 'chaosOrb',
    name: '混沌宝珠',
    description: '宇宙诞生之初的混沌凝聚体，蕴含创世与毁灭之力',
    icon: '🌀',
    rarity: 'mythic',
    effect: '所有兵种属性+30%，战斗经验+100%',
  },
  genesisTablet: {
    id: 'genesisTablet',
    name: '创世石板',
    description: '记录宇宙法则的石板，解读它将掌握因果律',
    icon: '📜',
    rarity: 'mythic',
    effect: '科技研究速度+100%，解锁隐藏科技',
  },
  voidCrown: {
    id: 'voidCrown',
    name: '虚空之冠',
    description: '虚空行者遗留的王冠，戴上者能操控维度',
    icon: '👑',
    rarity: 'mythic',
    effect: '所有产量+50%，隐藏兵种解锁',
  },
  cosmicHeart: {
    id: 'cosmicHeart',
    name: '宇宙之心',
    description: '宇宙核心的碎片，蕴含无尽能量，万物之源',
    icon: '💫',
    rarity: 'mythic',
    effect: '所有资源产量+60%，转生货币+200%',
  },
};

// 获取遗物定义
export function getRelic(id: string): RelicDef | undefined {
  return RELICS[id];
}

// 获取所有遗物
export function getAllRelics(): RelicDef[] {
  return Object.values(RELICS);
}

// 按稀有度获取遗物
export function getRelicsByRarity(rarity: string): RelicDef[] {
  return Object.values(RELICS).filter((r) => r.rarity === rarity);
}

// 获取套装遗物
export function getRelicsBySet(setId: string): RelicDef[] {
  return Object.values(RELICS).filter((r) => r.setId === setId);
}

// 获取所有套装ID
export function getAllSetIds(): string[] {
  const setIds = new Set<string>();
  Object.values(RELICS).forEach((r) => {
    if (r.setId) setIds.add(r.setId);
  });
  return Array.from(setIds);
}
