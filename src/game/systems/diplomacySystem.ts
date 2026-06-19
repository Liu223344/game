// 放置帝国 - 外交与AI帝国系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { CIVILIZATIONS } from '@/game/data/civilizations';
import type { GameState, AIEmpire, ResourceType, CivilizationType } from '@/game/types';

// AI帝国名字池
const EMPIRE_NAMES = [
  '北境王国', '南方联盟', '东方帝国', '西方共和国', '中央王朝',
  '海上帝国', '山地公国', '沙漠苏丹国', '森林联邦', '草原汗国',
];

// 生成AI帝国
export function generateAIEmpires(count: number = 3): AIEmpire[] {
  const civKeys = Object.keys(CIVILIZATIONS) as Array<keyof typeof CIVILIZATIONS>;
  const shuffledNames = [...EMPIRE_NAMES].sort(() => Math.random() - 0.5);
  const empires: AIEmpire[] = [];

  for (let i = 0; i < count; i++) {
    const civ = civKeys[Math.floor(Math.random() * civKeys.length)] as CivilizationType;
    empires.push({
      id: `empire_${i}_${Date.now()}`,
      name: shuffledNames[i] || `帝国${i + 1}`,
      civilization: civ,
      power: 50 + Math.random() * 50,
      relation: 0,
      relationStatus: 'neutral',
      territories: 1 + Math.floor(Math.random() * 3),
      armySize: 20 + Math.floor(Math.random() * 80),
      isAlive: true,
      tradeCooldown: 0,
      lastAction: '刚刚崛起',
    });
  }
  return empires;
}

// 初始化AI帝国（游戏开始时调用）
export function initializeDiplomacy(): void {
  const state = useGameStore.getState();
  if (state.diplomacy.empires.length === 0) {
    const empires = generateAIEmpires(3 + Math.floor(Math.random() * 2)); // 3-4个
    useGameStore.getState().initAIEmpire(empires);
    useGameStore.getState().recordChronicle({
      category: 'diplomacy',
      title: '发现邻邦',
      description: `周边崛起${empires.length}个新兴帝国，外交时代开启`,
      impact: '可进行结盟、贸易、宣战等外交活动',
    });
  }
}

// 获取关系等级名称
export function getRelationLevel(relation: number): { name: string; color: string } {
  if (relation >= 50) return { name: '盟友', color: 'text-green-400' };
  if (relation >= 0) return { name: '友善', color: 'text-blue-400' };
  if (relation >= -50) return { name: '中立', color: 'text-ancient-300' };
  return { name: '敌对', color: 'text-red-400' };
}

// 结盟（需要关系>=40，消耗金币）
export function formAlliance(empireId: string): boolean {
  const state = useGameStore.getState();
  const empire = state.diplomacy.empires.find((e) => e.id === empireId);
  if (!empire || !empire.isAlive) return false;
  if (empire.relation < 40) return false;
  const cost = 100;
  if (state.resources.gold < cost) return false;

  useGameStore.getState().spendResource('gold', cost);
  useGameStore.getState().modifyRelation(empireId, 20);
  useGameStore.getState().updateAIEmpire(empireId, {
    relationStatus: 'ally',
    lastAction: '结为盟友',
  });
  useGameStore.getState().recordChronicle({
    category: 'diplomacy',
    title: '缔结盟约',
    description: `与${empire.name}正式结盟，共御外敌`,
    impact: '关系+20，可请求援军',
  });
  useUIStore.getState().addNotification({
    type: 'success',
    message: `与${empire.name}结为盟友！`,
  });
  return true;
}

// 贸易（用多余资源换稀缺资源）
export function tradeWithEmpire(
  empireId: string,
  giveResource: ResourceType,
  giveAmount: number,
  receiveResource: ResourceType
): boolean {
  const state = useGameStore.getState();
  const empire = state.diplomacy.empires.find((e) => e.id === empireId);
  if (!empire || !empire.isAlive) return false;
  if (empire.tradeCooldown > 0) return false;
  if (!useGameStore.getState().spendResource(giveResource, giveAmount)) return false;

  // 接收资源（按交换比率1:0.8）
  const receiveAmount = Math.floor(giveAmount * 0.8);
  useGameStore.getState().addResource(receiveResource, receiveAmount);
  useGameStore.getState().modifyRelation(empireId, 2);
  useGameStore.getState().updateAIEmpire(empireId, {
    tradeCooldown: 60,
    lastAction: `贸易：用${giveAmount}${giveResource}换${receiveAmount}${receiveResource}`,
  });
  useGameStore.getState().addTradeRecord({
    empireId,
    type: 'export',
    resource: giveResource,
    amount: giveAmount,
  });
  return true;
}

// 宣战
export function declareWar(empireId: string): boolean {
  const state = useGameStore.getState();
  const empire = state.diplomacy.empires.find((e) => e.id === empireId);
  if (!empire || !empire.isAlive) return false;
  if (empire.relationStatus === 'war') return false;

  useGameStore.getState().modifyRelation(empireId, -50);
  useGameStore.getState().updateAIEmpire(empireId, {
    relationStatus: 'war',
    lastAction: '进入战争状态',
  });
  useGameStore.getState().modifyLegitimacy(-5, '发动战争');
  useGameStore.getState().recordChronicle({
    category: 'diplomacy',
    title: '宣战',
    description: `向${empire.name}宣战，两国进入战争状态`,
    impact: '合法性-5，可发动征服战',
  });
  useUIStore.getState().addNotification({
    type: 'warning',
    message: `已向${empire.name}宣战！`,
  });
  return true;
}

// 求和
export function makePeace(empireId: string): boolean {
  const state = useGameStore.getState();
  const empire = state.diplomacy.empires.find((e) => e.id === empireId);
  if (!empire || !empire.isAlive) return false;
  if (empire.relationStatus !== 'war') return false;
  const cost = 200;
  if (state.resources.gold < cost) return false;

  useGameStore.getState().spendResource('gold', cost);
  useGameStore.getState().modifyRelation(empireId, 30);
  useGameStore.getState().updateAIEmpire(empireId, {
    relationStatus: 'neutral',
    lastAction: '签订和平条约',
  });
  useGameStore.getState().recordChronicle({
    category: 'diplomacy',
    title: '议和',
    description: `与${empire.name}签订和平条约，战争结束`,
    impact: '关系+30，消耗金币200',
  });
  return true;
}

// 朝贡（弱国向强国进贡）
export function demandTribute(empireId: string): boolean {
  const state = useGameStore.getState();
  const empire = state.diplomacy.empires.find((e) => e.id === empireId);
  if (!empire || !empire.isAlive) return false;
  // 只有玩家国力远超对方才能索贡
  const playerPower = state.troops.reduce((sum, t) => sum + t.count, 0);
  if (playerPower < empire.armySize * 2) return false;

  const tribute = Math.floor(empire.power * 0.5);
  useGameStore.getState().addResource('gold', tribute);
  useGameStore.getState().modifyRelation(empireId, -15);
  useGameStore.getState().updateAIEmpire(empireId, {
    lastAction: `被迫进贡${tribute}金币`,
  });
  useGameStore.getState().recordChronicle({
    category: 'diplomacy',
    title: '收取朝贡',
    description: `${empire.name}迫于压力，进贡${tribute}金币`,
    impact: `金币+${tribute}，关系-15`,
  });
  return true;
}

// AI帝国行动（每tick调用）
export function processAIEmpireActions(deltaSeconds: number): void {
  const state = useGameStore.getState();
  state.diplomacy.empires.forEach((empire) => {
    if (!empire.isAlive) return;

    // 减少贸易冷却
    if (empire.tradeCooldown > 0) {
      useGameStore.getState().updateAIEmpire(empire.id, {
        tradeCooldown: Math.max(0, empire.tradeCooldown - deltaSeconds),
      });
    }

    // AI国力缓慢增长
    if (Math.random() < 0.001 * deltaSeconds) {
      useGameStore.getState().updateAIEmpire(empire.id, {
        power: empire.power + 0.5,
        armySize: empire.armySize + Math.floor(Math.random() * 3),
      });
    }

    // 敌对帝国可能宣战
    if (empire.relationStatus === 'hostile' && Math.random() < 0.0005 * deltaSeconds) {
      useGameStore.getState().updateAIEmpire(empire.id, {
        relationStatus: 'war',
        lastAction: '主动宣战',
      });
      useGameStore.getState().recordChronicle({
        category: 'diplomacy',
        title: '遭到宣战',
        description: `${empire.name}向我方宣战！`,
        impact: '进入战争状态',
      });
      useUIStore.getState().addNotification({
        type: 'error',
        message: `${empire.name}向我方宣战！`,
      });
    }
  });
}

// 获取外交状态
export function getDiplomacySummary(state: GameState): {
  totalEmpires: number;
  aliveEmpires: number;
  allies: number;
  enemies: number;
} {
  const alive = state.diplomacy.empires.filter((e) => e.isAlive);
  return {
    totalEmpires: state.diplomacy.empires.length,
    aliveEmpires: alive.length,
    allies: alive.filter((e) => e.relationStatus === 'ally').length,
    enemies: alive.filter((e) => e.relationStatus === 'hostile' || e.relationStatus === 'war').length,
  };
}
