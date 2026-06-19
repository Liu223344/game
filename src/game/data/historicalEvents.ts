// 历史事件数据 - 与科技解锁联动的真实历史事件，提供教育性背景

export interface HistoricalEvent {
  id: string;
  name: string;
  description: string;
  era: string;
  relatedTech: string;
}

// 历史事件数据 - 每个科技解锁时联动展示真实历史事件
export const HISTORICAL_EVENTS: Record<string, HistoricalEvent> = {
  // ============ 石器时代 ============
  stoneAgeTools: {
    id: 'stoneAgeTools',
    name: '石器时代的诞生',
    description: '约250万年前，能人开始系统性地打制石器，奥杜威文化标志着人类与动物的根本分野。石器制造是人类文明的第一缕曙光，使早期人类能够狩猎、切割食物和防御猛兽。',
    era: '石器时代',
    relatedTech: 'stoneTools',
  },
  controlOfFire: {
    id: 'controlOfFire',
    name: '火的使用',
    description: '约100万年前，直立人学会了控制火。北京周口店遗址发现了迄今最确凿的早期人类用火证据。火的掌握使人类能够烹饪食物、取暖御寒、驱赶野兽和烧制工具，极大促进了大脑发育和文明进程。',
    era: '石器时代',
    relatedTech: 'fire',
  },
  agriculturalRevolution: {
    id: 'agriculturalRevolution',
    name: '农业革命',
    description: '约1.2万年前的新石器革命，人类从采集狩猎转向定居农业。小麦、水稻、玉米等作物被驯化，人类开始定居，人口激增，催生了城市、文字和国家，是文明史上最重要的转折点之一。',
    era: '石器时代',
    relatedTech: 'gathering',
  },

  // ============ 青铜时代 ============
  bronzeAge: {
    id: 'bronzeAge',
    name: '青铜时代的开启',
    description: '约公元前3000年，美索不达米亚率先掌握青铜冶炼技术。青铜是铜锡合金，硬度高于纯铜，使武器和工具性能飞跃。中国的商周青铜器达到极高艺术水准，后母戊鼎是代表作。',
    era: '青铜时代',
    relatedTech: 'bronzeWorking',
  },
  archeryInvention: {
    id: 'archeryInvention',
    name: '弓箭的发明',
    description: '弓箭约在旧石器时代晚期出现，至青铜时代大规模用于军事。弓箭是人类最早的机械武器，将能量储存与释放结合。英格兰长弓手在百年战争中威名远扬，蒙古骑射更是横扫欧亚。',
    era: '青铜时代',
    relatedTech: 'archery',
  },
  birthOfWriting: {
    id: 'birthOfWriting',
    name: '文字的诞生',
    description: '约公元前3200年，苏美尔人发明楔形文字，是最早的文字系统。埃及象形文字、中国甲骨文、玛雅文字独立起源。文字的出现标志着史前时代结束，知识得以跨越时空传承。',
    era: '青铜时代',
    relatedTech: 'writing',
  },

  // ============ 铁器时代 ============
  ironAge: {
    id: 'ironAge',
    name: '铁器时代的到来',
    description: '约公元前1200年，赫梯人率先掌握炼铁技术。铁比青铜更坚硬、更易获取，铁器的普及彻底改变了战争形态和农业生产，推动了古代帝国的扩张。',
    era: '铁器时代',
    relatedTech: 'ironWorking',
  },
  horseDomestication: {
    id: 'horseDomestication',
    name: '马匹驯化与骑兵',
    description: '约公元前3500年人类在欧亚草原驯化马匹，公元前900年亚述人建立专业骑兵。马镫的发明使骑兵战斗力大增，蒙古骑兵凭借骑术征服了人类历史上最大的陆地帝国。',
    era: '铁器时代',
    relatedTech: 'riding',
  },
  silkRoad: {
    id: 'silkRoad',
    name: '丝绸之路',
    description: '丝绸之路是古代连接东西方的贸易网络，始于公元前2世纪张骞通西域。丝绸、瓷器、香料、宗教和技术沿此路传播，促进了欧亚大陆的文明交流，是史上最重要的贸易路线之一。',
    era: '铁器时代',
    relatedTech: 'trade',
  },
  mythologies: {
    id: 'mythologies',
    name: '神话体系的形成',
    description: '各文明都发展出丰富的神话体系：希腊神话、北欧神话、中国神话、印度神话等。神话反映了古人对自然和宇宙的认知，许多神话生物如龙、凤凰、独角兽成为永恒的文化符号。',
    era: '铁器时代',
    relatedTech: 'mythology',
  },

  // ============ 火药时代 ============
  gunpowderInvention: {
    id: 'gunpowderInvention',
    name: '火药的发明',
    description: '中国唐代炼丹术士意外发明黑火药，宋代开始用于军事。火药是中国四大发明之一，13世纪传入欧洲，彻底改变了战争形态，使骑士阶层和城堡逐渐退出历史舞台。',
    era: '火药时代',
    relatedTech: 'gunpowder',
  },
  fallOfConstantinople: {
    id: 'fallOfConstantinople',
    name: '君士坦丁堡陷落',
    description: '1453年，奥斯曼帝国用巨炮攻陷拜占庭帝国首都君士坦丁堡，标志着中世纪的结束。火器的普及使城堡不再坚不可摧，步兵成为战场主力，开启了近代军事革命。',
    era: '火药时代',
    relatedTech: 'firearms',
  },
  printingPress: {
    id: 'printingPress',
    name: '印刷术的传播',
    description: '北宋毕昇发明活字印刷术，15世纪古腾堡改进并推广至欧洲。印刷术推动了文艺复兴和宗教改革，使知识大规模传播成为可能，是信息传播史上革命性的突破。',
    era: '火药时代',
    relatedTech: 'printing',
  },

  // ============ 蒸汽时代 ============
  industrialRevolution: {
    id: 'industrialRevolution',
    name: '第一次工业革命',
    description: '1769年瓦特改良蒸汽机，第一次工业革命在英国爆发。蒸汽机将热能转化为机械能，工厂取代手工作坊，生产力飞跃增长，催生了城市化和社会结构的深刻变革。',
    era: '蒸汽时代',
    relatedTech: 'steamPower',
  },
  massProduction: {
    id: 'massProduction',
    name: '工业化大生产',
    description: '19世纪工业革命席卷欧美，机器大生产取代手工劳动。流水线、标准化零件和工厂制度使产量激增，改变了社会结构，也带来了环境污染和劳资矛盾等新问题。',
    era: '蒸汽时代',
    relatedTech: 'industry',
  },

  // ============ 电力时代 ============
  electricalAge: {
    id: 'electricalAge',
    name: '第二次工业革命',
    description: '19世纪末，爱迪生发明电灯，特斯拉推动交流电普及。电能易于传输和转换，成为现代社会的能源基础，催生了无数发明，开启了第二次工业革命。',
    era: '电力时代',
    relatedTech: 'electricity',
  },
  automobileEra: {
    id: 'automobileEra',
    name: '内燃机与汽车',
    description: '1885年本茨制造出第一辆汽车，内燃机随后用于坦克和飞机。内燃机能量密度高，使汽车、飞机、坦克成为可能，彻底改变了交通和战争形态。',
    era: '电力时代',
    relatedTech: 'combustion',
  },
  radioInvention: {
    id: 'radioInvention',
    name: '无线电的发明',
    description: '1895年马可尼发明无线电报，20世纪初无线电广播普及。无线电使即时远程通信成为可能，在两次世界大战中发挥关键作用，是现代通信的基石。',
    era: '电力时代',
    relatedTech: 'radio',
  },

  // ============ 核能时代 ============
  nuclearAge: {
    id: 'nuclearAge',
    name: '核时代的开启',
    description: '1945年第一颗原子弹试爆，1954年苏联建成第一座核电站。核裂变释放巨大能量，既可用于发电也带来核威胁，核武器的存在深刻改变了国际政治格局。',
    era: '核能时代',
    relatedTech: 'nuclearPower',
  },
  spaceRace: {
    id: 'spaceRace',
    name: '太空竞赛',
    description: '二战V-2火箭是现代火箭鼻祖，1969年阿波罗11号实现人类登月。冷战期间美苏太空竞赛推动了航天技术飞跃，火箭利用反作用力推进，能在真空中工作，是人类进入太空的工具。',
    era: '核能时代',
    relatedTech: 'rocketry',
  },
  computerBirth: {
    id: 'computerBirth',
    name: '计算机的诞生',
    description: '1946年ENIAC诞生，第一台通用电子计算机。计算机从电子管到晶体管到集成电路，摩尔定律驱动性能指数增长，开启了信息时代的大门。',
    era: '核能时代',
    relatedTech: 'computing',
  },

  // ============ 信息时代 ============
  internetEra: {
    id: 'internetEra',
    name: '互联网时代',
    description: '1969年ARPANET建立，1990年代万维网普及。互联网将全球计算机连接，催生了数字经济，深刻改变人类社会的方方面面，是信息革命的核心。',
    era: '信息时代',
    relatedTech: 'internet',
  },
  aiBreakthrough: {
    id: 'aiBreakthrough',
    name: '人工智能突破',
    description: '2010年代深度学习取得突破，AI在围棋、图像识别、自然语言处理等领域超越人类。人工智能模拟人类智能，深度学习是其核心，正在改变各行各业。',
    era: '信息时代',
    relatedTech: 'ai',
  },
  genomeProject: {
    id: 'genomeProject',
    name: '基因组计划',
    description: '1953年沃森和克里克发现DNA双螺旋结构，2003年人类基因组计划完成。生物技术包括基因编辑、合成生物学等，CRISPR使基因编辑变得精准廉价，开启生命科学新纪元。',
    era: '信息时代',
    relatedTech: 'biotech',
  },

  // ============ 太空时代 ============
  spaceExploration: {
    id: 'spaceExploration',
    name: '太空探索',
    description: '1957年斯普特尼克1号升空开启太空时代，1969年阿波罗11号登月。太空飞行需要克服地球引力，轨道力学是核心，空间站实现长期太空驻留，人类开始走向星辰大海。',
    era: '太空时代',
    relatedTech: 'spaceFlight',
  },
  nanotechEra: {
    id: 'nanotechEra',
    name: '纳米技术时代',
    description: '1959年费曼提出纳米概念，21世纪纳米材料广泛应用。纳米技术操控1-100纳米尺度物质，在材料、医学、电子领域潜力巨大，是未来科技的重要方向。',
    era: '太空时代',
    relatedTech: 'nanotech',
  },
  quantumEra: {
    id: 'quantumEra',
    name: '量子科技时代',
    description: '20世纪初量子力学建立，2020年代量子计算机取得突破。量子叠加和量子纠缠是量子计算的基础，量子通信理论上不可窃听，将颠覆计算和通信领域。',
    era: '太空时代',
    relatedTech: 'quantumPhysics',
  },

  // ============ 未来时代 ============
  geneticEngineeringEra: {
    id: 'geneticEngineeringEra',
    name: '基因工程时代',
    description: 'CRISPR基因编辑技术是未来超人类的技术基础。基因工程可消除遗传疾病，也可能创造定制人类，引发深刻伦理争议，是塑造人类未来的关键技术。',
    era: '未来时代',
    relatedTech: 'geneticEngineering',
  },
  mindUploadConcept: {
    id: 'mindUploadConcept',
    name: '意识上传的构想',
    description: '意识上传仍是科幻概念，但脑机接口技术正在发展。意识上传涉及哲学的心智问题，若实现将彻底改变生命和死亡的定义，是人类追求永生的终极路径之一。',
    era: '未来时代',
    relatedTech: 'mindUpload',
  },
  dysonSphereConcept: {
    id: 'dysonSphereConcept',
    name: '戴森球构想',
    description: '物理学家弗里曼·戴森1960年提出戴森球概念。戴森球是包裹恒星的人造结构，能收集恒星的全部能量，是卡尔达肖夫II型文明的标志，代表着文明对能源的终极掌控。',
    era: '未来时代',
    relatedTech: 'dysonSphere',
  },
  futureWarfareConcept: {
    id: 'futureWarfareConcept',
    name: '未来战争形态',
    description: '未来战争将融合AI、纳米、量子等技术。自主武器系统和信息战将是核心，战争形态难以预测，可能超越人类控制，引发对AI武器化的深刻担忧。',
    era: '未来时代',
    relatedTech: 'futureWarfare',
  },

  // ============ 因果律时代 ============
  timeManipulationConcept: {
    id: 'timeManipulationConcept',
    name: '时间操控的遐想',
    description: '时间操控超越当前物理学认知，属于因果律级技术。广义相对论允许闭合类时曲线的存在，但时间旅行引发祖父悖论等难题，是物理学最深邃的谜题之一。',
    era: '因果律时代',
    relatedTech: 'timeManipulation',
  },
  causalityWeaponConcept: {
    id: 'causalityWeaponConcept',
    name: '因果律武器',
    description: '因果律武器是科幻中的终极武器概念。它能从因果层面抹除目标，使其从未存在过，超越一切物理防御，是文明发展到极致后的终极力量。',
    era: '因果律时代',
    relatedTech: 'causalityWeapon',
  },
  dimensionFoldingConcept: {
    id: 'dimensionFoldingConcept',
    name: '维度折叠',
    description: '弦理论预言存在额外维度。维度折叠利用高维空间实现瞬间移动，虫洞是其可能的形式之一，若实现将彻底改变空间和距离的概念。',
    era: '因果律时代',
    relatedTech: 'dimensionFolding',
  },
  hiddenKnowledgeConcept: {
    id: 'hiddenKnowledgeConcept',
    name: '宇宙的终极奥秘',
    description: '宇宙的终极奥秘仍待探索。当文明发展到因果律级别，将触及存在的本质，解锁超越常理的力量，这是智慧生命追求的终极目标。',
    era: '因果律时代',
    relatedTech: 'hiddenKnowledge',
  },
};

// 获取历史事件
export function getHistoricalEvent(id: string): HistoricalEvent | undefined {
  return HISTORICAL_EVENTS[id];
}

// 获取所有历史事件
export function getAllHistoricalEvents(): HistoricalEvent[] {
  return Object.values(HISTORICAL_EVENTS);
}

// 按时代获取历史事件
export function getHistoricalEventsByEra(era: string): HistoricalEvent[] {
  return Object.values(HISTORICAL_EVENTS).filter((e) => e.era === era);
}

// 根据科技ID获取关联的历史事件
export function getHistoricalEventByTech(techId: string): HistoricalEvent | undefined {
  return Object.values(HISTORICAL_EVENTS).find((e) => e.relatedTech === techId);
}
