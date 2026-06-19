import type { GameEvent } from '@/game/types';

// 随机事件数据 - 游戏中随机触发的互动事件，提供选择与后果
export const EVENTS: Record<string, GameEvent> = {
  // ============ 神秘商人 ============
  mysteriousMerchant: {
    id: 'mysteriousMerchant',
    name: '神秘商人',
    description: '一位披着斗篷的神秘商人出现在城门口，他的货物散发着奇异的魔力，声称拥有你从未见过的宝物',
    type: 'merchant',
    choices: [
      {
        text: '购买神秘宝箱（花费500金币）',
        effects: ['获得随机遗物碎片', '获得少量资源'],
        requirements: { gold: 500 },
      },
      {
        text: '购买稀有遗物（花费2000金币）',
        effects: ['获得史诗遗物', '金币大幅减少'],
        requirements: { gold: 2000 },
      },
      {
        text: '婉拒商人',
        effects: ['无变化'],
      },
    ],
  },
  travelingTrader: {
    id: 'travelingTrader',
    name: '行商旅人',
    description: '风尘仆仆的旅人带着远方货物前来交易，价格公道，童叟无欺',
    type: 'merchant',
    choices: [
      {
        text: '用木材换取食物（300木材换600食物）',
        effects: ['食物增加', '木材减少'],
        requirements: { wood: 300 },
      },
      {
        text: '用金属换取金币（200金属换500金币）',
        effects: ['金币增加', '金属减少'],
        requirements: { metal: 200 },
      },
      {
        text: '用金币换取知识（300金币换200知识）',
        effects: ['知识增加', '金币减少'],
        requirements: { gold: 300 },
      },
    ],
  },
  blackMarket: {
    id: 'blackMarket',
    name: '黑市拍卖',
    description: '地下黑市正在拍卖一件神秘物品，出价最高者得，但风险与收益并存',
    type: 'merchant',
    choices: [
      {
        text: '高价竞拍（花费5000金币）',
        effects: ['可能获得传说遗物', '可能获得垃圾', '金币大幅减少'],
        requirements: { gold: 5000 },
      },
      {
        text: '低价试探（花费1000金币）',
        effects: ['获得少量资源', '金币减少'],
        requirements: { gold: 1000 },
      },
      {
        text: '离开黑市',
        effects: ['无变化'],
      },
    ],
  },

  // ============ 节日庆典 ============
  harvestFestival: {
    id: 'harvestFestival',
    name: '丰收节',
    description: '金秋时节，五谷丰登，人民提议举办盛大的丰收庆典',
    type: 'festival',
    choices: [
      {
        text: '举办盛大庆典（花费500食物）',
        effects: ['人口幸福度+30%', '人口增长+20%', '食物减少'],
        requirements: { food: 500 },
      },
      {
        text: '举办简单庆典（花费100食物）',
        effects: ['人口幸福度+10%', '食物少量减少'],
        requirements: { food: 100 },
      },
      {
        text: '取消庆典，储存粮食',
        effects: ['人口幸福度-5%'],
      },
    ],
  },
  warriorsFestival: {
    id: 'warriorsFestival',
    name: '勇士竞技',
    description: '将军提议举办勇士竞技大会，以激励士气，选拔精锐',
    type: 'festival',
    choices: [
      {
        text: '举办竞技大会（花费300金币）',
        effects: ['兵种攻击+10%持续24小时', '获得经验值', '金币减少'],
        requirements: { gold: 300 },
      },
      {
        text: '举办小型比武（花费100金币）',
        effects: ['获得少量经验值', '金币少量减少'],
        requirements: { gold: 100 },
      },
      {
        text: '拒绝提议',
        effects: ['无变化'],
      },
    ],
  },
  knowledgeFestival: {
    id: 'knowledgeFestival',
    name: '学术盛会',
    description: '学者们请求举办学术研讨会，交流知识，激发创新',
    type: 'festival',
    choices: [
      {
        text: '资助盛会（花费400知识）',
        effects: ['研究速度+30%持续24小时', '获得科技碎片', '知识减少'],
        requirements: { knowledge: 400 },
      },
      {
        text: '小规模研讨（花费100知识）',
        effects: ['获得少量科技碎片', '知识少量减少'],
        requirements: { knowledge: 100 },
      },
      {
        text: '婉拒学者',
        effects: ['无变化'],
      },
    ],
  },

  // ============ 灾难事件 ============
  plague: {
    id: 'plague',
    name: '瘟疫蔓延',
    description: '可怕的瘟疫在城中蔓延，人民恐慌，急需应对措施',
    type: 'disaster',
    choices: [
      {
        text: '全力救治（花费800食物+500金币）',
        effects: ['瘟疫被控制', '人口少量减少', '资源大幅减少'],
        requirements: { food: 800, gold: 500 },
      },
      {
        text: '隔离疫区（花费300食物）',
        effects: ['人口减少10%', '瘟疫缓慢控制'],
        requirements: { food: 300 },
      },
      {
        text: '无能为力',
        effects: ['人口减少25%', '生产效率-20%持续24小时'],
      },
    ],
  },
  earthquake: {
    id: 'earthquake',
    name: '大地震',
    description: '大地剧烈震动，建筑倒塌，人民受灾，需要紧急救援',
    type: 'disaster',
    choices: [
      {
        text: '紧急重建（花费1000石头+500木材）',
        effects: ['建筑恢复', '资源减少'],
        requirements: { stone: 1000, wood: 500 },
      },
      {
        text: '部分重建（花费400石头+200木材）',
        effects: ['建筑部分恢复', '产量-10%持续12小时'],
        requirements: { stone: 400, wood: 200 },
      },
      {
        text: '放弃重建',
        effects: ['建筑损毁严重', '产量-30%持续48小时'],
      },
    ],
  },
  drought: {
    id: 'drought',
    name: '大旱灾',
    description: '连续数月无雨，庄稼枯萎，水源干涸，饥荒迫在眉睫',
    type: 'disaster',
    choices: [
      {
        text: '开凿水渠（花费600木材+300石头）',
        effects: ['食物产量恢复', '资源减少'],
        requirements: { wood: 600, stone: 300 },
      },
      {
        text: '配给制（花费200食物）',
        effects: ['食物消耗减少', '人口幸福度-15%'],
        requirements: { food: 200 },
      },
      {
        text: '祈雨祭祀（花费100金币）',
        effects: ['可能降雨恢复', '可能继续干旱'],
        requirements: { gold: 100 },
      },
    ],
  },
  barbarianInvasion: {
    id: 'barbarianInvasion',
    name: '蛮族入侵',
    description: '北方蛮族大举入侵，边境告急，必须立即应对',
    type: 'disaster',
    choices: [
      {
        text: '全力迎敌（损失部分兵力）',
        effects: ['击败蛮族', '获得战利品', '兵力减少'],
      },
      {
        text: '坚守城池（花费500食物）',
        effects: ['成功防守', '食物减少', '边境产量-10%'],
        requirements: { food: 500 },
      },
      {
        text: '缴纳贡品求和（花费1000金币）',
        effects: ['蛮族退兵', '金币大幅减少'],
        requirements: { gold: 1000 },
      },
    ],
  },

  // ============ 发现事件 ============
  ancientRuin: {
    id: 'ancientRuin',
    name: '古代遗迹',
    description: '探险队在丛林深处发现了一座古代遗迹，门上刻着神秘的符文',
    type: 'discovery',
    choices: [
      {
        text: '探索遗迹（花费200知识）',
        effects: ['获得遗物碎片', '获得知识', '知识减少'],
        requirements: { knowledge: 200 },
      },
      {
        text: '强行破门（损失部分兵力）',
        effects: ['可能获得传说遗物', '可能触发陷阱', '兵力减少'],
      },
      {
        text: '记录位置，日后探索',
        effects: ['获得少量知识'],
      },
    ],
  },
  lostTreasure: {
    id: 'lostTreasure',
    name: '失落宝藏',
    description: '渔民在湖底打捞出一个古老的宝箱，上面锈迹斑斑，似乎藏着秘密',
    type: 'discovery',
    choices: [
      {
        text: '撬开宝箱（花费100金属）',
        effects: ['获得金币', '可能获得遗物', '金属减少'],
        requirements: { metal: 100 },
      },
      {
        text: '寻找钥匙（花费200金币）',
        effects: ['获得大量金币', '可能获得稀有遗物', '金币减少'],
        requirements: { gold: 200 },
      },
      {
        text: '出售宝箱（获得300金币）',
        effects: ['金币增加'],
      },
    ],
  },
  newResourceVein: {
    id: 'newResourceVein',
    name: '新矿脉发现',
    description: '矿工在挖掘时发现了一条丰富的矿脉，蕴藏大量金属',
    type: 'discovery',
    choices: [
      {
        text: '立即开采（花费300木材）',
        effects: ['获得大量金属', '木材减少'],
        requirements: { wood: 300 },
      },
      {
        text: '规划后开采（花费100知识）',
        effects: ['持续获得金属加成', '知识减少'],
        requirements: { knowledge: 100 },
      },
      {
        text: '封锁消息，秘密开采',
        effects: ['少量获得金属', '人口幸福度-5%'],
      },
    ],
  },
  ancientTomb: {
    id: 'ancientTomb',
    name: '帝王陵墓',
    description: '考古队发现了一座古代帝王的陵墓，入口处守卫着石像',
    type: 'discovery',
    choices: [
      {
        text: '考古发掘（花费500知识+300金币）',
        effects: ['获得传说遗物', '获得大量知识', '资源减少'],
        requirements: { knowledge: 500, gold: 300 },
      },
      {
        text: '盗墓（损失部分兵力）',
        effects: ['获得金币', '可能触发诅咒', '兵力减少'],
      },
      {
        text: '尊重逝者，封存陵墓',
        effects: ['人口幸福度+10%'],
      },
    ],
  },

  // ============ 神秘事件 ============
  fallingStar: {
    id: 'fallingStar',
    name: '陨星坠落',
    description: '一颗璀璨的流星划过夜空，坠落在城郊，散发着奇异的光芒',
    type: 'mystery',
    choices: [
      {
        text: '采集星核碎片（花费200金属）',
        effects: ['获得星核', '获得知识', '金属减少'],
        requirements: { metal: 200 },
      },
      {
        text: '研究陨石（花费300知识）',
        effects: ['获得大量知识', '可能解锁新科技', '知识减少'],
        requirements: { knowledge: 300 },
      },
      {
        text: '视为凶兆，举行祭祀（花费200金币）',
        effects: ['人口幸福度+15%', '金币减少'],
        requirements: { gold: 200 },
      },
    ],
  },
  prophecy: {
    id: 'prophecy',
    name: '神秘预言',
    description: '一位盲眼先知来到城中，预言了帝国的未来，但话语晦涩难懂',
    type: 'mystery',
    choices: [
      {
        text: '供奉先知（花费500金币）',
        effects: ['获得预言加成', '金币减少'],
        requirements: { gold: 500 },
      },
      {
        text: '请教先知（花费200知识）',
        effects: ['获得神秘知识', '可能触发新事件', '知识减少'],
        requirements: { knowledge: 200 },
      },
      {
        text: '驱逐先知',
        effects: ['人口幸福度-10%'],
      },
    ],
  },
  dimensionalRift: {
    id: 'dimensionalRift',
    name: '维度裂缝',
    description: '天空中出现一道诡异的裂缝，从中传出低语，似乎通向另一个世界',
    type: 'mystery',
    choices: [
      {
        text: '探索裂缝（损失部分兵力）',
        effects: ['可能获得神话遗物', '可能获得星核', '兵力减少'],
      },
      {
        text: '研究裂缝（花费500知识）',
        effects: ['获得大量知识', '可能解锁隐藏科技', '知识减少'],
        requirements: { knowledge: 500 },
      },
      {
        text: '封印裂缝（花费300金币+200知识）',
        effects: ['获得人口幸福度', '资源减少'],
        requirements: { gold: 300, knowledge: 200 },
      },
    ],
  },
  ancientBeast: {
    id: 'ancientBeast',
    name: '远古巨兽',
    description: '一只沉睡千年的巨兽在山中苏醒，威胁着周边的领地',
    type: 'mystery',
    choices: [
      {
        text: '讨伐巨兽（损失大量兵力）',
        effects: ['击败巨兽', '获得大量资源', '获得遗物碎片', '兵力大幅减少'],
      },
      {
        text: '尝试驯服（花费500食物+300知识）',
        effects: ['可能驯服巨兽', '可能失败损失兵力', '资源减少'],
        requirements: { food: 500, knowledge: 300 },
      },
      {
        text: '献祭安抚（花费1000金币）',
        effects: ['巨兽离去', '获得少量遗物碎片', '金币大幅减少'],
        requirements: { gold: 1000 },
      },
    ],
  },
  timeAnomaly: {
    id: 'timeAnomaly',
    name: '时间异常',
    description: '城中出现时间扭曲现象，过去与未来的影像交织，令人困惑',
    type: 'mystery',
    choices: [
      {
        text: '研究时间异常（花费1000知识）',
        effects: ['获得大量知识', '可能解锁时间科技', '知识大幅减少'],
        requirements: { knowledge: 1000 },
      },
      {
        text: '利用时间异常加速生产',
        effects: ['所有产量+50%持续1小时', '人口幸福度-10%'],
      },
      {
        text: '忽视异常',
        effects: ['异常自行消失', '无变化'],
      },
    ],
  },
};

// 获取事件定义
export function getEvent(id: string): GameEvent | undefined {
  return EVENTS[id];
}

// 获取所有事件
export function getAllEvents(): GameEvent[] {
  return Object.values(EVENTS);
}

// 按类型获取事件
export function getEventsByType(type: string): GameEvent[] {
  return Object.values(EVENTS).filter((e) => e.type === type);
}
