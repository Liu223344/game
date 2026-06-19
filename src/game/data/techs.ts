import type { TechDef } from '@/game/types';

// 科技树数据 - 从石器时代到因果律时代
export const TECHS: Record<string, TechDef> = {
  // ============ 石器时代 ============
  stoneTools: {
    id: 'stoneTools',
    name: '石器制造',
    description: '学会打磨石头制作工具，开启文明的第一步',
    icon: '🪨',
    cost: 10,
    prerequisites: [],
    unlocks: {
      buildings: ['barracks'],
      troops: ['militia'],
      mechanics: ['basicCombat'],
    },
    era: '石器时代',
    historicalEvent: '旧石器时代，人类开始系统性地制造石器工具，距今约250万年前',
    knowledge: '石器制造是人类区别于动物的重要标志，奥杜威文化是已知最早的石器文化之一',
  },
  fire: {
    id: 'fire',
    name: '用火技术',
    description: '掌握火的使用，取暖、烹饪、驱兽、烧制',
    icon: '🔥',
    cost: 15,
    prerequisites: ['stoneTools'],
    unlocks: {
      mechanics: ['cooking', 'warmth'],
    },
    era: '石器时代',
    historicalEvent: '直立人约100万年前学会控制用火，北京猿人遗址发现用火痕迹',
    knowledge: '火的掌握使人类能消化更多食物，促进大脑发育，是文明的关键转折点',
  },
  gathering: {
    id: 'gathering',
    name: '采集农业',
    description: '从单纯采集走向原始耕种，食物来源更稳定',
    icon: '🌾',
    cost: 20,
    prerequisites: ['fire'],
    unlocks: {
      buildings: ['farm'],
      mechanics: ['stableFood'],
    },
    era: '石器时代',
    historicalEvent: '约1.2万年前的新石器革命，人类从采集狩猎转向农业',
    knowledge: '农业革命使人类定居下来，人口增长，催生了城市和文明',
  },

  // ============ 青铜时代 ============
  bronzeWorking: {
    id: 'bronzeWorking',
    name: '青铜冶炼',
    description: '冶炼铜锡合金，制造更坚固的武器和工具',
    icon: '⚒️',
    cost: 50,
    prerequisites: ['gathering'],
    unlocks: {
      buildings: ['mine'],
      troops: ['bronzeWarrior'],
    },
    era: '青铜时代',
    historicalEvent: '约公元前3000年，美索不达米亚率先进入青铜时代',
    knowledge: '青铜是铜锡合金，硬度高于纯铜，中国的商周青铜器达到极高工艺水平',
  },
  archery: {
    id: 'archery',
    name: '弓箭术',
    description: '发明弓箭，远程作战成为可能',
    icon: '🏹',
    cost: 60,
    prerequisites: ['bronzeWorking'],
    unlocks: {
      buildings: ['archeryRange'],
      troops: ['archer'],
    },
    era: '青铜时代',
    historicalEvent: '弓箭约在旧石器时代晚期出现，青铜时代得到大规模军事应用',
    knowledge: '弓箭是人类最早的机械武器，英格兰长弓手在中世纪战场上威名远扬',
  },
  writing: {
    id: 'writing',
    name: '文字',
    description: '发明文字，知识得以积累传承',
    icon: '📜',
    cost: 80,
    prerequisites: ['bronzeWorking'],
    unlocks: {
      buildings: ['academy'],
      mechanics: ['knowledgeProduction'],
    },
    era: '青铜时代',
    historicalEvent: '约公元前3200年，苏美尔人发明楔形文字，是最早的文字系统',
    knowledge: '文字的出现标志着史前时代的结束，四大文明古国都有独立发明的文字',
  },

  // ============ 铁器时代 ============
  ironWorking: {
    id: 'ironWorking',
    name: '铁器冶炼',
    description: '掌握炼铁技术，武器装备全面升级',
    icon: '⚒️',
    cost: 150,
    prerequisites: ['writing', 'archery'],
    unlocks: {
      troops: ['ironSoldier', 'crossbowman'],
    },
    era: '铁器时代',
    historicalEvent: '约公元前1200年，赫梯人率先掌握炼铁技术，铁器时代开始',
    knowledge: '铁比青铜更坚硬更易获取，铁器的普及改变了战争形态和农业生产',
  },
  riding: {
    id: 'riding',
    name: '骑术',
    description: '驯化马匹并用于战争，骑兵诞生',
    icon: '🐎',
    cost: 180,
    prerequisites: ['ironWorking'],
    unlocks: {
      buildings: ['stable'],
      troops: ['knight'],
    },
    era: '铁器时代',
    historicalEvent: '约公元前3500年人类驯化马匹，公元前900年亚述人建立专业骑兵',
    knowledge: '马镫的发明使骑兵战斗力大增，蒙古骑兵凭借骑术征服了欧亚大陆',
  },
  trade: {
    id: 'trade',
    name: '商业贸易',
    description: '建立贸易网络，促进经济繁荣',
    icon: '🏪',
    cost: 200,
    prerequisites: ['writing'],
    unlocks: {
      buildings: ['market'],
      mechanics: ['goldProduction'],
    },
    era: '铁器时代',
    historicalEvent: '丝绸之路是古代最著名的贸易路线，连接东西方文明',
    knowledge: '贸易促进文化交流和技术传播，腓尼基人因航海贸易建立了广泛商业网络',
  },
  mythology: {
    id: 'mythology',
    name: '神话学',
    description: '研究远古神话，唤醒沉睡的神话生物',
    icon: '🐉',
    cost: 500,
    prerequisites: ['riding', 'trade'],
    unlocks: {
      troops: ['dragon', 'phoenix', 'colossus', 'kraken', 'qilin'],
      mechanics: ['mythTroops'],
    },
    era: '铁器时代',
    historicalEvent: '各文明都有丰富的神话体系，希腊神话、北欧神话、中国神话影响深远',
    knowledge: '神话反映了古人对自然和宇宙的认知，许多神话生物成为文化符号',
  },

  // ============ 火药时代 ============
  gunpowder: {
    id: 'gunpowder',
    name: '火药',
    description: '发明黑火药，战争进入热兵器时代',
    icon: '💣',
    cost: 400,
    prerequisites: ['riding'],
    unlocks: {
      mechanics: ['explosives'],
    },
    era: '火药时代',
    historicalEvent: '中国唐代炼丹术士意外发明火药，宋代用于军事',
    knowledge: '火药是中国四大发明之一，13世纪传入欧洲，彻底改变了战争形态',
  },
  firearms: {
    id: 'firearms',
    name: '火器',
    description: '制造火枪火炮，冷兵器逐渐退出战场',
    icon: '🔫',
    cost: 600,
    prerequisites: ['gunpowder'],
    unlocks: {
      troops: ['musketeer', 'cannon'],
    },
    era: '火药时代',
    historicalEvent: '15世纪火绳枪普及，1453年奥斯曼帝国用巨炮攻陷君士坦丁堡',
    knowledge: '火器的普及使骑士阶层衰落，步兵成为战场主力，城堡不再坚不可摧',
  },
  printing: {
    id: 'printing',
    name: '印刷术',
    description: '活字印刷让知识大规模传播',
    icon: '🖨️',
    cost: 500,
    prerequisites: ['gunpowder'],
    unlocks: {
      mechanics: ['knowledgeBoost'],
    },
    era: '火药时代',
    historicalEvent: '北宋毕昇发明活字印刷术，15世纪古腾堡改进并推广至欧洲',
    knowledge: '印刷术推动了文艺复兴和宗教改革，是信息传播的革命性突破',
  },

  // ============ 蒸汽时代 ============
  steamPower: {
    id: 'steamPower',
    name: '蒸汽机',
    description: '蒸汽动力驱动机器，工业革命爆发',
    icon: '🚂',
    cost: 1000,
    prerequisites: ['firearms', 'printing'],
    unlocks: {
      buildings: ['workshop'],
      troops: ['rifleman', 'steamTank'],
    },
    era: '蒸汽时代',
    historicalEvent: '1769年瓦特改良蒸汽机，第一次工业革命开始',
    knowledge: '蒸汽机将热能转化为机械能，工厂取代手工作坊，生产力飞跃式增长',
  },
  industry: {
    id: 'industry',
    name: '工业化',
    description: '大规模工厂生产，量产武器装备',
    icon: '🏭',
    cost: 1200,
    prerequisites: ['steamPower'],
    unlocks: {
      mechanics: ['massProduction'],
    },
    era: '蒸汽时代',
    historicalEvent: '19世纪工业革命席卷欧美，机器大生产取代手工劳动',
    knowledge: '工业化改变了社会结构，催生了城市化，也带来了环境污染等问题',
  },

  // ============ 电力时代 ============
  electricity: {
    id: 'electricity',
    name: '电力',
    description: '掌握电能，第二次工业革命',
    icon: '⚡',
    cost: 2000,
    prerequisites: ['industry'],
    unlocks: {
      troops: ['modernInfantry', 'machineGunner'],
    },
    era: '电力时代',
    historicalEvent: '19世纪末，爱迪生发明电灯，特斯拉推动交流电普及',
    knowledge: '电能易于传输和转换，成为现代社会的能源基础，催生了无数发明',
  },
  combustion: {
    id: 'combustion',
    name: '内燃机',
    description: '内燃机驱动车辆，机动战争升级',
    icon: '⛽',
    cost: 2500,
    prerequisites: ['electricity'],
    unlocks: {
      troops: ['armoredCar'],
    },
    era: '电力时代',
    historicalEvent: '1885年本茨制造出第一辆汽车，内燃机随后用于坦克和飞机',
    knowledge: '内燃机能量密度高，使汽车、飞机、坦克成为可能，改变了交通和战争',
  },
  radio: {
    id: 'radio',
    name: '无线电',
    description: '无线通信，远程指挥作战',
    icon: '📻',
    cost: 2200,
    prerequisites: ['electricity'],
    unlocks: {
      mechanics: ['remoteCommand'],
    },
    era: '电力时代',
    historicalEvent: '1895年马可尼发明无线电报，20世纪初无线电广播普及',
    knowledge: '无线电使即时远程通信成为可能，在两次世界大战中发挥关键作用',
  },

  // ============ 核能时代 ============
  nuclearPower: {
    id: 'nuclearPower',
    name: '核能',
    description: '掌握原子能，开启核时代',
    icon: '☢️',
    cost: 5000,
    prerequisites: ['combustion', 'radio'],
    unlocks: {
      troops: ['tank'],
    },
    era: '核能时代',
    historicalEvent: '1945年第一颗原子弹试爆，1954年苏联建成第一座核电站',
    knowledge: '核裂变释放巨大能量，既可用于发电也带来核威胁，改变了国际格局',
  },
  rocketry: {
    id: 'rocketry',
    name: '火箭技术',
    description: '火箭推进，迈向天空和太空',
    icon: '🚀',
    cost: 5500,
    prerequisites: ['nuclearPower'],
    unlocks: {
      troops: ['rocketArtillery'],
    },
    era: '核能时代',
    historicalEvent: '二战V-2火箭是现代火箭鼻祖，1969年阿波罗登月',
    knowledge: '火箭利用反作用力推进，能在真空中工作，是人类进入太空的工具',
  },
  computing: {
    id: 'computing',
    name: '计算机',
    description: '电子计算机，信息处理革命',
    icon: '💻',
    cost: 6000,
    prerequisites: ['nuclearPower'],
    unlocks: {
      mechanics: ['automation'],
    },
    era: '核能时代',
    historicalEvent: '1946年ENIAC诞生，第一台通用电子计算机',
    knowledge: '计算机从电子管到晶体管到集成电路，摩尔定律驱动性能指数增长',
  },

  // ============ 信息时代 ============
  internet: {
    id: 'internet',
    name: '互联网',
    description: '全球互联网络，信息即时传输',
    icon: '🌐',
    cost: 12000,
    prerequisites: ['computing', 'rocketry'],
    unlocks: {
      troops: ['digitalSoldier'],
    },
    era: '信息时代',
    historicalEvent: '1969年ARPANET建立，1990年代万维网普及',
    knowledge: '互联网将全球计算机连接，催生了数字经济，深刻改变人类社会',
  },
  ai: {
    id: 'ai',
    name: '人工智能',
    description: '机器智能崛起，自主决策',
    icon: '🧠',
    cost: 15000,
    prerequisites: ['internet'],
    unlocks: {
      troops: ['droneSwarm'],
    },
    era: '信息时代',
    historicalEvent: '2010年代深度学习突破，AI在围棋等领域超越人类',
    knowledge: '人工智能模拟人类智能，深度学习是其核心，正在改变各行各业',
  },
  biotech: {
    id: 'biotech',
    name: '生物技术',
    description: '基因工程，改造生命',
    icon: '🧬',
    cost: 14000,
    prerequisites: ['internet'],
    unlocks: {
      mechanics: ['geneEnhancement'],
    },
    era: '信息时代',
    historicalEvent: '1953年DNA双螺旋结构发现，2003年人类基因组计划完成',
    knowledge: '生物技术包括基因编辑、合成生物学等，CRISPR使基因编辑变得精准廉价',
  },

  // ============ 太空时代 ============
  spaceFlight: {
    id: 'spaceFlight',
    name: '太空飞行',
    description: '征服太空，星际扩张',
    icon: '🛰️',
    cost: 30000,
    prerequisites: ['ai', 'biotech'],
    unlocks: {
      troops: ['spaceMarine', 'orbitalCannon'],
      mechanics: ['spaceExpansion'],
    },
    era: '太空时代',
    historicalEvent: '1957年斯普特尼克1号升空，1969年阿波罗11号登月',
    knowledge: '太空飞行需要克服地球引力，轨道力学是核心，空间站实现长期太空驻留',
  },
  nanotech: {
    id: 'nanotech',
    name: '纳米技术',
    description: '原子级操控物质',
    icon: '🔬',
    cost: 35000,
    prerequisites: ['spaceFlight'],
    unlocks: {
      troops: ['powerArmor'],
    },
    era: '太空时代',
    historicalEvent: '1959年费曼提出纳米概念，21世纪纳米材料广泛应用',
    knowledge: '纳米技术操控1-100纳米尺度物质，在材料、医学、电子领域潜力巨大',
  },
  quantumPhysics: {
    id: 'quantumPhysics',
    name: '量子物理',
    description: '掌控量子世界，颠覆性技术',
    icon: '⚛️',
    cost: 40000,
    prerequisites: ['spaceFlight'],
    unlocks: {
      troops: ['plasmaCannon'],
    },
    era: '太空时代',
    historicalEvent: '20世纪初量子力学建立，2020年代量子计算机取得突破',
    knowledge: '量子叠加和量子纠缠是量子计算的基础，量子通信理论上不可窃听',
  },

  // ============ 未来时代 ============
  geneticEngineering: {
    id: 'geneticEngineering',
    name: '基因工程',
    description: '深度改造人类基因，超人类诞生',
    icon: '🧬',
    cost: 80000,
    prerequisites: ['nanotech', 'quantumPhysics'],
    unlocks: {
      mechanics: ['superSoldier'],
    },
    era: '未来时代',
    historicalEvent: 'CRISPR基因编辑技术是未来超人类的技术基础',
    knowledge: '基因工程可消除遗传疾病，也可能创造定制人类，引发深刻伦理争议',
  },
  mindUpload: {
    id: 'mindUpload',
    name: '意识上传',
    description: '将意识数字化，永生成为可能',
    icon: '💭',
    cost: 100000,
    prerequisites: ['geneticEngineering'],
    unlocks: {
      mechanics: ['digitalImmortality'],
    },
    era: '未来时代',
    historicalEvent: '意识上传仍是科幻概念，但脑机接口技术正在发展',
    knowledge: '意识上传涉及哲学的心智问题，若实现将彻底改变生命和死亡的定义',
  },
  dysonSphere: {
    id: 'dysonSphere',
    name: '戴森球',
    description: '包裹恒星收集能量，卡尔达肖夫II型文明',
    icon: '🌟',
    cost: 150000,
    prerequisites: ['mindUpload'],
    unlocks: {
      wonders: ['dysonSphere'],
      mechanics: ['infiniteEnergy'],
    },
    era: '未来时代',
    historicalEvent: '物理学家弗里曼·戴森1960年提出戴森球概念',
    knowledge: '戴森球是包裹恒星的人造结构，能收集恒星的全部能量，是II型文明的标志',
  },
  futureWarfare: {
    id: 'futureWarfare',
    name: '未来战争',
    description: '解锁未来超级兵种',
    icon: '🦾',
    cost: 120000,
    prerequisites: ['geneticEngineering'],
    unlocks: {
      troops: ['mechTitan', 'quantumWarrior', 'nanoSwarm', 'aiCommander'],
    },
    era: '未来时代',
    historicalEvent: '未来战争将融合AI、纳米、量子等技术',
    knowledge: '未来战争形态难以预测，自主武器系统和信息战将是核心',
  },

  // ============ 因果律时代 ============
  timeManipulation: {
    id: 'timeManipulation',
    name: '时间操控',
    description: '操控时间流向，改写历史',
    icon: '⏳',
    cost: 500000,
    prerequisites: ['dysonSphere', 'futureWarfare'],
    unlocks: {
      mechanics: ['timeControl'],
    },
    era: '因果律时代',
    historicalEvent: '时间操控超越当前物理学认知，属于因果律级技术',
    knowledge: '广义相对论允许闭合类时曲线的存在，但时间旅行引发祖父悖论等难题',
  },
  causalityWeapon: {
    id: 'causalityWeapon',
    name: '因果律武器',
    description: '直接改写因果关系的终极武器',
    icon: '🌀',
    cost: 800000,
    prerequisites: ['timeManipulation'],
    unlocks: {
      mechanics: ['causalityControl'],
    },
    era: '因果律时代',
    historicalEvent: '因果律武器是科幻中的终极武器概念',
    knowledge: '因果律武器能从因果层面抹除目标，使其从未存在过，超越物理防御',
  },
  dimensionFolding: {
    id: 'dimensionFolding',
    name: '维度折叠',
    description: '操控空间维度，瞬间移动',
    icon: '🌌',
    cost: 1000000,
    prerequisites: ['causalityWeapon'],
    unlocks: {
      mechanics: ['dimensionTravel'],
    },
    era: '因果律时代',
    historicalEvent: '弦理论预言存在额外维度',
    knowledge: '维度折叠利用高维空间实现瞬间移动，虫洞是其可能的形式之一',
  },
  hiddenKnowledge: {
    id: 'hiddenKnowledge',
    name: '隐秘知识',
    description: '触及宇宙终极奥秘，解锁隐藏兵种',
    icon: '👁️',
    cost: 2000000,
    prerequisites: ['dimensionFolding'],
    unlocks: {
      troops: ['timeTraveler', 'chaosBringer', 'voidWalker'],
      mechanics: ['hiddenTroops'],
    },
    era: '因果律时代',
    historicalEvent: '宇宙的终极奥秘仍待探索',
    knowledge: '当文明发展到因果律级别，将触及存在的本质，解锁超越常理的力量',
  },
};

// 获取科技定义
export function getTech(id: string): TechDef | undefined {
  return TECHS[id];
}

// 获取可研究的科技（前置已满足）
export function getAvailableTechs(researchedTechs: string[]): TechDef[] {
  return Object.values(TECHS).filter((tech) => {
    if (researchedTechs.includes(tech.id)) return false;
    return tech.prerequisites.every((p) => researchedTechs.includes(p));
  });
}

// 获取某时代的科技
export function getTechsByEra(era: string): TechDef[] {
  return Object.values(TECHS).filter((t) => t.era === era);
}
