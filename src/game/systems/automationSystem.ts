import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { getAvailableTechs, startResearch } from '@/game/systems/techSystem';
import { startTroopProduction, getTroopDef } from '@/game/systems/troopSystem';
import type { ResourceState } from '@/game/types';

// ============ 自动化规则定义 ============
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  unlockTech: string; // 解锁该规则所需科技
}

// 模块级状态：自动化规则启用状态
// 由于 GameState 中未定义自动化字段，使用模块级状态管理
// 解锁 AI 科技后所有规则默认可用但需手动启用
const automationRules: Map<string, boolean> = new Map([
  ['autoBuildTroops', false],
  ['autoResearch', false],
  ['autoBattle', false],
  ['autoConstruct', false],
]);

// 自动化规则元数据
const AUTOMATION_RULE_DEFS: Omit<AutomationRule, 'enabled'>[] = [
  {
    id: 'autoBuildTroops',
    name: '自动造兵',
    description: '资源充足时自动训练基础兵种，维持军队规模',
    unlockTech: 'ai',
  },
  {
    id: 'autoResearch',
    name: '自动研究',
    description: '当前无研究项目时自动选择可研究科技开始研究',
    unlockTech: 'ai',
  },
  {
    id: 'autoBattle',
    name: '自动战斗',
    description: '军队战力足够时自动发起战斗（简化处理：自动积累战利品）',
    unlockTech: 'ai',
  },
  {
    id: 'autoConstruct',
    name: '自动建造',
    description: '资源充足时自动升级关键资源建筑',
    unlockTech: 'computing',
  },
];

// 自动造兵：维持的最小兵力
const MIN_TROOP_COUNT = 50;
// 自动造兵：每次训练数量
const AUTO_TROOP_BATCH = 10;
// 自动战斗：每 tick 触发概率
const AUTO_BATTLE_CHANCE = 0.01;
// 自动建造：资源阈值（超过此值才升级）
const AUTO_BUILD_RESOURCE_THRESHOLD = 500;

// ============ 解锁检查 ============

// 检查 AI 自动化是否解锁（需研究 AI 科技）
export function isAutomationUnlocked(): boolean {
  const researched = useGameStore.getState().tech.researched;
  // 研究 ai 或 computing 科技即可解锁自动化系统
  return researched.includes('ai') || researched.includes('computing');
}

// 检查特定规则是否解锁
export function isRuleUnlocked(ruleId: string): boolean {
  const rule = AUTOMATION_RULE_DEFS.find((r) => r.id === ruleId);
  if (!rule) return false;
  return useGameStore.getState().tech.researched.includes(rule.unlockTech);
}

// ============ 规则管理 ============

// 获取当前自动化规则（含启用状态与解锁状态）
export function getAutomationRules(): AutomationRule[] {
  const unlocked = isAutomationUnlocked();
  return AUTOMATION_RULE_DEFS.map((def) => ({
    ...def,
    enabled: unlocked && (automationRules.get(def.id) || false),
  }));
}

// 设置自动化规则
export function setAutomationRule(ruleId: string, enabled: boolean): boolean {
  if (!isAutomationUnlocked()) {
    useUIStore.getState().addNotification({ type: 'warning', message: 'AI自动化尚未解锁' });
    return false;
  }

  if (!isRuleUnlocked(ruleId)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该自动化规则尚未解锁' });
    return false;
  }

  automationRules.set(ruleId, enabled);

  const rule = AUTOMATION_RULE_DEFS.find((r) => r.id === ruleId);
  useUIStore.getState().addNotification({
    type: enabled ? 'info' : 'warning',
    message: `${rule?.name || ruleId} 已${enabled ? '启用' : '禁用'}`,
  });

  return true;
}

// ============ 自动化处理（每 tick 调用） ============

export function processAutomation(deltaSeconds: number): void {
  if (!isAutomationUnlocked()) return;

  // 自动造兵
  if (automationRules.get('autoBuildTroops')) {
    processAutoBuildTroops();
  }

  // 自动研究
  if (automationRules.get('autoResearch')) {
    processAutoResearch();
  }

  // 自动战斗
  if (automationRules.get('autoBattle')) {
    processAutoBattle(deltaSeconds);
  }

  // 自动建造
  if (automationRules.get('autoConstruct')) {
    processAutoConstruct();
  }
}

// 自动造兵：资源充足时训练基础兵种
function processAutoBuildTroops(): void {
  const state = useGameStore.getState();
  const totalTroops = state.troops.reduce((s, t) => s + t.count, 0);

  // 兵力充足则不训练
  if (totalTroops >= MIN_TROOP_COUNT) return;

  // 寻找已解锁的基础兵种（民兵/步兵）
  const basicTroopIds = ['militia', 'ironSoldier', 'archer', 'bronzeWarrior'];
  for (const troopId of basicTroopIds) {
    const def = getTroopDef(troopId);
    if (!def) continue;

    // 检查是否解锁
    if (def.unlockTech && !state.tech.researched.includes(def.unlockTech)) continue;

    // 检查资源是否足够训练一个批次
    const totalCost: Partial<ResourceState> = {};
    for (const [res, amount] of Object.entries(def.cost)) {
      totalCost[res as keyof ResourceState] = (amount as number) * AUTO_TROOP_BATCH;
    }

    if (state.hasResources(totalCost)) {
      startTroopProduction(troopId, AUTO_TROOP_BATCH);
      return; // 每 tick 只训练一种
    }
  }
}

// 自动研究：无当前研究时自动开始
function processAutoResearch(): void {
  const state = useGameStore.getState();
  if (state.tech.current) return; // 已有研究进行中

  const available = getAvailableTechs();
  if (available.length === 0) return;

  // 选择知识足够的最便宜科技
  const affordable = available
    .filter((t) => state.resources.knowledge >= t.cost)
    .sort((a, b) => a.cost - b.cost);

  if (affordable.length > 0) {
    startResearch(affordable[0].id);
  }
}

// 自动战斗：概率触发，获得少量资源
function processAutoBattle(deltaSeconds: number): void {
  // 简化处理：基于概率自动获得战利品
  if (Math.random() > AUTO_BATTLE_CHANCE * deltaSeconds) return;

  const state = useGameStore.getState();
  const totalTroops = state.troops.reduce((s, t) => s + t.count, 0);
  if (totalTroops < 10) return; // 兵力不足不战斗

  // 自动战斗获得少量资源
  const goldGain = Math.floor(10 + Math.random() * 50);
  const foodGain = Math.floor(5 + Math.random() * 30);
  useGameStore.getState().addResource('gold', goldGain);
  useGameStore.getState().addResource('food', foodGain);
}

// 自动建造：资源充足时升级资源建筑
function processAutoConstruct(): void {
  const state = useGameStore.getState();
  const resources = state.resources;

  // 资源不充裕时不升级
  if (
    resources.food < AUTO_BUILD_RESOURCE_THRESHOLD ||
    resources.wood < AUTO_BUILD_RESOURCE_THRESHOLD
  ) {
    return;
  }

  // 优先升级农场和伐木场
  const priorityBuildings: Array<'farm' | 'lumberyard' | 'quarry' | 'mine'> = [
    'farm',
    'lumberyard',
    'quarry',
    'mine',
  ];

  for (const buildingType of priorityBuildings) {
    const building = state.buildings[buildingType];
    if (!building || !building.isActive) continue;

    // 简化处理：直接升级（实际项目应检查升级费用）
    // 为避免无限升级，限制每 tick 只升一级且概率触发
    if (Math.random() < 0.1) {
      useGameStore.getState().upgradeBuilding(buildingType);
      useUIStore.getState().addNotification({
        type: 'info',
        message: `AI自动升级了建筑`,
      });
      return;
    }
  }
}

// ============ 工具函数 ============

// 获取自动化系统状态摘要
export function getAutomationSummary(): {
  unlocked: boolean;
  enabledCount: number;
  totalRules: number;
} {
  const unlocked = isAutomationUnlocked();
  let enabledCount = 0;
  for (const [, enabled] of automationRules) {
    if (enabled) enabledCount++;
  }
  return {
    unlocked,
    enabledCount,
    totalRules: AUTOMATION_RULE_DEFS.length,
  };
}
