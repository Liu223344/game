import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { EVENTS, getEvent, getAllEvents } from '@/game/data/events';
import type { GameEvent, EventChoice, ResourceState } from '@/game/types';

// 模块级状态：记录上次触发事件的游戏时间（秒），刷新后从存档恢复
let lastEventTriggerPlayTime = 0;

// 事件触发间隔（游戏秒）：至少间隔 60 秒
const EVENT_COOLDOWN_SECONDS = 60;

// 基础触发概率（每 tick 检查时）
const BASE_TRIGGER_CHANCE = 0.05;

// 现实节日配置：月份（0-11）+ 日期（1-31）+ 对应事件 ID
interface FestivalConfig {
  eventId: string;
  name: string;
  month: number;
  day: number;
}

const FESTIVAL_DATES: FestivalConfig[] = [
  { eventId: 'harvestFestival', name: '春节', month: 1, day: 22 }, // 农历春节附近，简化处理
  { eventId: 'warriorsFestival', name: '国庆', month: 9, day: 1 },
  { eventId: 'knowledgeFestival', name: '圣诞', month: 11, day: 25 },
];

// 随机触发事件（基于游戏时间和概率）
export function triggerRandomEvent(): GameEvent | null {
  const state = useGameStore.getState();

  // 冷却检查（基于游戏时间，刷新后不会重置）
  if (state.playTime - lastEventTriggerPlayTime < EVENT_COOLDOWN_SECONDS) {
    return null;
  }

  // 游戏时间过短不触发（至少游玩 30 秒）
  if (state.playTime < 30) {
    return null;
  }

  // 概率检查
  if (Math.random() > BASE_TRIGGER_CHANCE) {
    return null;
  }

  // 筛选可用事件（满足条件且未在活跃列表中）
  const availableEvents = getAllEvents().filter((evt) => {
    if (state.activeEvents.includes(evt.id)) return false;
    if (evt.condition && !evt.condition(state)) return false;
    return true;
  });

  if (availableEvents.length === 0) {
    return null;
  }

  // 随机选取一个事件
  const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];

  // 标记触发时间（使用游戏时间，刷新后从存档恢复）
  lastEventTriggerPlayTime = state.playTime;

  // 添加到活跃事件
  useGameStore.setState({
    activeEvents: [...state.activeEvents, event.id],
  });

  // 打开事件弹窗
  useUIStore.getState().openModal('event', { eventId: event.id });

  // 通知
  useUIStore.getState().addNotification({
    type: 'info',
    message: `事件触发：${event.name}`,
  });

  // 更新图鉴
  if (!state.codex.discoveredEvents.includes(event.id)) {
    useGameStore.setState({
      codex: {
        ...state.codex,
        discoveredEvents: [...state.codex.discoveredEvents, event.id],
      },
    });
  }

  return event;
}

// 获取当前活跃事件
export function getActiveEvents(): GameEvent[] {
  const activeIds = useGameStore.getState().activeEvents;
  return activeIds
    .map((id) => getEvent(id))
    .filter((e): e is GameEvent => e !== undefined);
}

// 处理事件选择
export function processEventChoice(eventId: string, choiceIndex: number): boolean {
  const state = useGameStore.getState();
  const event = getEvent(eventId);
  if (!event) {
    useUIStore.getState().addNotification({ type: 'warning', message: '事件不存在' });
    return false;
  }

  if (!state.activeEvents.includes(eventId)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该事件已不在活跃列表' });
    return false;
  }

  const choice = event.choices[choiceIndex];
  if (!choice) {
    useUIStore.getState().addNotification({ type: 'warning', message: '无效的选择' });
    return false;
  }

  // 检查选择的前置资源要求
  if (choice.requirements) {
    if (!useGameStore.getState().hasResources(choice.requirements)) {
      useUIStore.getState().addNotification({ type: 'warning', message: '资源不足，无法选择该项' });
      return false;
    }
  }

  // 扣除前置资源
  if (choice.requirements) {
    for (const [res, amount] of Object.entries(choice.requirements)) {
      useGameStore.getState().spendResource(res as keyof ResourceState, amount as number);
    }
  }

  // 应用事件效果
  applyEventEffects(event, choice);

  // 从活跃事件列表移除
  const currentState = useGameStore.getState();
  useGameStore.setState({
    activeEvents: currentState.activeEvents.filter((id) => id !== eventId),
  });

  // 关闭事件弹窗
  useUIStore.getState().closeModal('event');

  useUIStore.getState().addNotification({
    type: 'success',
    message: `事件「${event.name}」已处理`,
  });

  return true;
}

// 应用事件效果（根据事件 id 与选择分支给予资源/兵种/科技等）
function applyEventEffects(event: GameEvent, choice: EventChoice): void {
  const state = useGameStore.getState();

  switch (event.id) {
    // ============ 神秘商人 ============
    case 'mysteriousMerchant':
      if (choice.text.includes('神秘宝箱')) {
        // 500 金币 -> 随机遗物碎片 + 少量资源
        useGameStore.getState().addResource('relicFragment', 1);
        useGameStore.getState().addResource('food', 100);
        useGameStore.getState().addResource('wood', 50);
        useUIStore.getState().addNotification({ type: 'success', message: '获得神器碎片×1、食物+100、木材+50' });
      } else if (choice.text.includes('稀有遗物')) {
        // 2000 金币 -> 史诗遗物
        useGameStore.getState().addResource('relicFragment', 3);
        useUIStore.getState().addNotification({ type: 'success', message: '获得神器碎片×3（史诗遗物材料）' });
      }
      break;

    case 'travelingTrader':
      if (choice.text.includes('木材换取食物')) {
        useGameStore.getState().addResource('food', 600);
        useUIStore.getState().addNotification({ type: 'info', message: '食物+600' });
      } else if (choice.text.includes('金属换取金币')) {
        useGameStore.getState().addResource('gold', 500);
        useUIStore.getState().addNotification({ type: 'info', message: '金币+500' });
      } else if (choice.text.includes('金币换取知识')) {
        useGameStore.getState().addResource('knowledge', 200);
        useUIStore.getState().addNotification({ type: 'info', message: '知识+200' });
      }
      break;

    case 'blackMarket':
      if (choice.text.includes('高价竞拍')) {
        // 50% 概率传说遗物，50% 垃圾
        if (Math.random() < 0.5) {
          useGameStore.getState().addResource('relicFragment', 5);
          useUIStore.getState().addNotification({ type: 'success', message: '运气爆棚！获得神器碎片×5（传说遗物）' });
        } else {
          useGameStore.getState().addResource('food', 50);
          useUIStore.getState().addNotification({ type: 'warning', message: '只买到一些残羹冷炙（食物+50）' });
        }
      } else if (choice.text.includes('低价试探')) {
        useGameStore.getState().addResource('wood', 200);
        useGameStore.getState().addResource('stone', 100);
        useUIStore.getState().addNotification({ type: 'info', message: '获得木材+200、石头+100' });
      }
      break;

    // ============ 节日庆典 ============
    case 'harvestFestival':
      if (choice.text.includes('盛大庆典')) {
        useGameStore.getState().addResource('population', 20);
        useUIStore.getState().addNotification({ type: 'success', message: '人口+20，幸福度大幅提升' });
      } else if (choice.text.includes('简单庆典')) {
        useGameStore.getState().addResource('population', 5);
        useUIStore.getState().addNotification({ type: 'info', message: '人口+5，幸福度小幅提升' });
      } else {
        useUIStore.getState().addNotification({ type: 'warning', message: '人民略感失望' });
      }
      break;

    case 'warriorsFestival':
      if (choice.text.includes('竞技大会')) {
        useGameStore.getState().addResource('knowledge', 50);
        useUIStore.getState().addNotification({ type: 'success', message: '士气大振！知识+50，兵种攻击临时+10%' });
      } else if (choice.text.includes('小型比武')) {
        useGameStore.getState().addResource('knowledge', 15);
        useUIStore.getState().addNotification({ type: 'info', message: '知识+15' });
      }
      break;

    case 'knowledgeFestival':
      if (choice.text.includes('资助盛会')) {
        useGameStore.getState().addResource('knowledge', 100);
        useUIStore.getState().addNotification({ type: 'success', message: '研究速度临时+30%，科技碎片+100知识' });
      } else if (choice.text.includes('小规模研讨')) {
        useGameStore.getState().addResource('knowledge', 30);
        useUIStore.getState().addNotification({ type: 'info', message: '知识+30' });
      }
      break;

    // ============ 灾难事件 ============
    case 'plague':
      if (choice.text.includes('全力救治')) {
        useGameStore.getState().addResource('population', -2);
        useUIStore.getState().addNotification({ type: 'success', message: '瘟疫被控制，人口仅小幅减少' });
      } else if (choice.text.includes('隔离疫区')) {
        useGameStore.getState().addResource('population', -Math.floor(state.resources.population * 0.1));
        useUIStore.getState().addNotification({ type: 'warning', message: '隔离有效，人口减少10%' });
      } else {
        useGameStore.getState().addResource('population', -Math.floor(state.resources.population * 0.25));
        useUIStore.getState().addNotification({ type: 'error', message: '瘟疫肆虐，人口减少25%' });
      }
      break;

    case 'earthquake':
      if (choice.text.includes('紧急重建')) {
        useUIStore.getState().addNotification({ type: 'success', message: '建筑全面恢复' });
      } else if (choice.text.includes('部分重建')) {
        useUIStore.getState().addNotification({ type: 'warning', message: '建筑部分恢复，产量临时-10%' });
      } else {
        useUIStore.getState().addNotification({ type: 'error', message: '建筑损毁严重，产量临时-30%' });
      }
      break;

    case 'drought':
      if (choice.text.includes('开凿水渠')) {
        useGameStore.getState().addResource('food', 200);
        useUIStore.getState().addNotification({ type: 'success', message: '食物产量恢复，额外+200食物' });
      } else if (choice.text.includes('配给制')) {
        useUIStore.getState().addNotification({ type: 'warning', message: '食物消耗减少，幸福度下降' });
      } else {
        if (Math.random() < 0.5) {
          useGameStore.getState().addResource('food', 100);
          useUIStore.getState().addNotification({ type: 'success', message: '祈雨成功！食物+100' });
        } else {
          useUIStore.getState().addNotification({ type: 'error', message: '祈雨失败，旱情持续' });
        }
      }
      break;

    case 'barbarianInvasion':
      if (choice.text.includes('全力迎敌')) {
        const totalTroops = state.troops.reduce((s, t) => s + t.count, 0);
        const losses = Math.floor(totalTroops * 0.2);
        applyTroopLoss(losses);
        useGameStore.getState().addResource('gold', 300);
        useGameStore.getState().addResource('food', 200);
        useUIStore.getState().addNotification({ type: 'success', message: `击败蛮族！获得金币+300、食物+200，损失兵力${losses}` });
      } else if (choice.text.includes('坚守城池')) {
        useUIStore.getState().addNotification({ type: 'info', message: '成功防守，边境产量临时-10%' });
      } else {
        useUIStore.getState().addNotification({ type: 'info', message: '蛮族退兵，金币大幅减少' });
      }
      break;

    // ============ 发现事件 ============
    case 'ancientRuin':
      if (choice.text.includes('探索遗迹')) {
        useGameStore.getState().addResource('relicFragment', 2);
        useGameStore.getState().addResource('knowledge', 100);
        useUIStore.getState().addNotification({ type: 'success', message: '获得神器碎片×2、知识+100' });
      } else if (choice.text.includes('强行破门')) {
        if (Math.random() < 0.4) {
          useGameStore.getState().addResource('relicFragment', 5);
          useUIStore.getState().addNotification({ type: 'success', message: '获得传说遗物！神器碎片×5' });
        } else {
          applyTroopLoss(5);
          useUIStore.getState().addNotification({ type: 'error', message: '触发陷阱！损失5兵力' });
        }
      } else {
        useGameStore.getState().addResource('knowledge', 20);
        useUIStore.getState().addNotification({ type: 'info', message: '记录位置，知识+20' });
      }
      break;

    case 'lostTreasure':
      if (choice.text.includes('撬开宝箱')) {
        useGameStore.getState().addResource('gold', 500);
        if (Math.random() < 0.3) {
          useGameStore.getState().addResource('relicFragment', 1);
          useUIStore.getState().addNotification({ type: 'success', message: '金币+500，额外获得神器碎片×1' });
        } else {
          useUIStore.getState().addNotification({ type: 'info', message: '金币+500' });
        }
      } else if (choice.text.includes('寻找钥匙')) {
        useGameStore.getState().addResource('gold', 1500);
        useUIStore.getState().addNotification({ type: 'success', message: '金币+1500' });
      } else {
        useGameStore.getState().addResource('gold', 300);
        useUIStore.getState().addNotification({ type: 'info', message: '金币+300' });
      }
      break;

    case 'newResourceVein':
      if (choice.text.includes('立即开采')) {
        useGameStore.getState().addResource('metal', 500);
        useUIStore.getState().addNotification({ type: 'success', message: '金属+500' });
      } else if (choice.text.includes('规划后开采')) {
        useGameStore.getState().addResource('metal', 200);
        useUIStore.getState().addNotification({ type: 'info', message: '金属+200，持续加成已激活' });
      } else {
        useGameStore.getState().addResource('metal', 100);
        useUIStore.getState().addNotification({ type: 'info', message: '金属+100' });
      }
      break;

    case 'ancientTomb':
      if (choice.text.includes('考古发掘')) {
        useGameStore.getState().addResource('relicFragment', 3);
        useGameStore.getState().addResource('knowledge', 300);
        useUIStore.getState().addNotification({ type: 'success', message: '获得神器碎片×3、知识+300' });
      } else if (choice.text.includes('盗墓')) {
        useGameStore.getState().addResource('gold', 800);
        if (Math.random() < 0.5) {
          applyTroopLoss(10);
          useUIStore.getState().addNotification({ type: 'error', message: '触发诅咒！损失10兵力，但获得金币+800' });
        } else {
          useUIStore.getState().addNotification({ type: 'success', message: '金币+800' });
        }
      } else {
        useUIStore.getState().addNotification({ type: 'info', message: '尊重逝者，人口幸福度+10%' });
      }
      break;

    // ============ 神秘事件 ============
    case 'fallingStar':
      if (choice.text.includes('采集星核')) {
        useGameStore.getState().addResource('starCore', 1);
        useGameStore.getState().addResource('knowledge', 50);
        useUIStore.getState().addNotification({ type: 'success', message: '获得星核×1、知识+50' });
      } else if (choice.text.includes('研究陨石')) {
        useGameStore.getState().addResource('knowledge', 200);
        useUIStore.getState().addNotification({ type: 'success', message: '知识+200' });
      } else {
        useUIStore.getState().addNotification({ type: 'info', message: '祭祀完成，幸福度+15%' });
      }
      break;

    case 'prophecy':
      if (choice.text.includes('供奉先知')) {
        useGameStore.getState().addResource('knowledge', 100);
        useUIStore.getState().addNotification({ type: 'success', message: '获得预言加成，知识+100' });
      } else if (choice.text.includes('请教先知')) {
        useGameStore.getState().addResource('knowledge', 150);
        useUIStore.getState().addNotification({ type: 'info', message: '获得神秘知识+150' });
      } else {
        useUIStore.getState().addNotification({ type: 'warning', message: '先知愤怒离去，幸福度-10%' });
      }
      break;

    case 'dimensionalRift':
      if (choice.text.includes('探索裂缝')) {
        applyTroopLoss(15);
        if (Math.random() < 0.5) {
          useGameStore.getState().addResource('relicFragment', 4);
          useUIStore.getState().addNotification({ type: 'success', message: '损失15兵力，获得神器碎片×4' });
        } else {
          useGameStore.getState().addResource('starCore', 1);
          useUIStore.getState().addNotification({ type: 'info', message: '损失15兵力，获得星核×1' });
        }
      } else if (choice.text.includes('研究裂缝')) {
        useGameStore.getState().addResource('knowledge', 400);
        useUIStore.getState().addNotification({ type: 'success', message: '知识+400' });
      } else {
        useUIStore.getState().addNotification({ type: 'info', message: '裂缝被封印，幸福度提升' });
      }
      break;

    case 'ancientBeast':
      if (choice.text.includes('讨伐巨兽')) {
        applyTroopLoss(30);
        useGameStore.getState().addResource('food', 500);
        useGameStore.getState().addResource('gold', 500);
        useGameStore.getState().addResource('relicFragment', 2);
        useUIStore.getState().addNotification({ type: 'success', message: '击败巨兽！损失30兵力，获得大量资源' });
      } else if (choice.text.includes('尝试驯服')) {
        if (Math.random() < 0.4) {
          useUIStore.getState().addNotification({ type: 'success', message: '驯服成功！巨兽加入军队' });
        } else {
          applyTroopLoss(20);
          useUIStore.getState().addNotification({ type: 'error', message: '驯服失败！损失20兵力' });
        }
      } else {
        useGameStore.getState().addResource('relicFragment', 1);
        useUIStore.getState().addNotification({ type: 'info', message: '巨兽离去，获得神器碎片×1' });
      }
      break;

    case 'timeAnomaly':
      if (choice.text.includes('研究时间异常')) {
        useGameStore.getState().addResource('knowledge', 500);
        useUIStore.getState().addNotification({ type: 'success', message: '知识+500，时间科技研究加速' });
      } else if (choice.text.includes('利用时间异常')) {
        useUIStore.getState().addNotification({ type: 'info', message: '所有产量临时+50%（1小时）' });
      } else {
        useUIStore.getState().addNotification({ type: 'info', message: '时间异常自行消失' });
      }
      break;

    default:
      useUIStore.getState().addNotification({ type: 'info', message: '事件已处理' });
      break;
  }
}

// 扣除兵力（按比例从所有兵种中扣除）
function applyTroopLoss(totalLoss: number): void {
  const state = useGameStore.getState();
  const totalTroops = state.troops.reduce((s, t) => s + t.count, 0);
  if (totalTroops <= 0 || totalLoss <= 0) return;

  let remaining = totalLoss;
  const newTroops = state.troops.map((troop) => {
    if (remaining <= 0) return troop;
    const loss = Math.min(troop.count, Math.ceil((troop.count / totalTroops) * totalLoss));
    remaining -= loss;
    return { ...troop, count: troop.count - loss };
  });

  useGameStore.setState({ troops: newTroops });
}

// 检查现实节日联动（春节/圣诞等）
export function checkFestivalEvents(): GameEvent | null {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate(); // 1-31

  for (const festival of FESTIVAL_DATES) {
    if (festival.month === month && festival.day === day) {
      const event = getEvent(festival.eventId);
      if (!event) continue;

      const state = useGameStore.getState();
      // 同一节日事件一天内只触发一次（通过活跃事件判断）
      if (state.activeEvents.includes(event.id)) {
        continue;
      }

      // 添加到活跃事件
      useGameStore.setState({
        activeEvents: [...state.activeEvents, event.id],
      });

      useUIStore.getState().openModal('event', { eventId: event.id });
      useUIStore.getState().addNotification({
        type: 'info',
        message: `节日联动：${festival.name} - ${event.name}`,
      });

      return event;
    }
  }

  return null;
}

// 生成神秘商人
export function spawnMysteriousMerchant(): GameEvent | null {
  const state = useGameStore.getState();
  const merchantEvent = getEvent('mysteriousMerchant');
  if (!merchantEvent) return null;

  // 已在活跃列表则不重复生成
  if (state.activeEvents.includes(merchantEvent.id)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '神秘商人已在城中等候' });
    return null;
  }

  useGameStore.setState({
    activeEvents: [...state.activeEvents, merchantEvent.id],
  });

  useUIStore.getState().openModal('event', { eventId: merchantEvent.id });
  useUIStore.getState().addNotification({
    type: 'info',
    message: '神秘商人出现在城门口！',
  });

  return merchantEvent;
}

// 获取所有事件定义
export function getAllEventDefs(): GameEvent[] {
  return Object.values(EVENTS);
}
