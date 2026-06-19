import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { TECHS, getTech } from '@/game/data/techs';
import { HISTORICAL_EVENTS } from '@/game/data/historicalEvents';
import type { TechDef } from '@/game/types';

// 获取所有科技
export function getAllTechs(): TechDef[] {
  return Object.values(TECHS);
}

// 获取可研究的科技（前置已满足且未研究）
export function getAvailableTechs(): TechDef[] {
  const state = useGameStore.getState();
  const researched = state.tech.researched;

  return Object.values(TECHS).filter((tech) => {
    if (researched.includes(tech.id)) return false;
    return tech.prerequisites.every((prereq) => researched.includes(prereq));
  });
}

// 获取已研究的科技
export function getResearchedTechs(): TechDef[] {
  const researched = useGameStore.getState().tech.researched;
  return researched.map((id) => getTech(id)).filter((t): t is TechDef => t !== undefined);
}

// 开始研究科技
export function startResearch(techId: string): boolean {
  const state = useGameStore.getState();
  const tech = getTech(techId);
  if (!tech) return false;

  // 检查是否已研究
  if (state.tech.researched.includes(techId)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '科技已研究' });
    return false;
  }

  // 检查前置
  if (!tech.prerequisites.every((p) => state.tech.researched.includes(p))) {
    useUIStore.getState().addNotification({ type: 'warning', message: '前置科技未满足' });
    return false;
  }

  // 检查是否正在研究
  if (state.tech.current) {
    useUIStore.getState().addNotification({ type: 'warning', message: '已有科技正在研究' });
    return false;
  }

  // 检查知识资源
  if (state.resources.knowledge < tech.cost) {
    useUIStore.getState().addNotification({ type: 'warning', message: '知识不足' });
    return false;
  }

  // 扣除知识
  state.spendResource('knowledge', tech.cost);

  // 设置当前研究
  useGameStore.setState({
    tech: {
      ...state.tech,
      current: techId,
      progress: 0,
    },
  });

  useUIStore.getState().addNotification({
    type: 'info',
    message: `开始研究: ${tech.name}`,
  });

  return true;
}

// 更新研究进度（每tick调用）
export function updateResearch(deltaSeconds: number): void {
  const state = useGameStore.getState();
  if (!state.tech.current) return;

  const tech = getTech(state.tech.current);
  if (!tech) {
    useGameStore.setState({
      tech: { ...state.tech, current: null, progress: 0 },
    });
    return;
  }

  // 研究速度：每秒1%（100秒完成）
  const progressGain = deltaSeconds * 0.01;
  const newProgress = state.tech.progress + progressGain;

  if (newProgress >= 1) {
    // 研究完成
    completeResearch(tech);
  } else {
    useGameStore.setState({
      tech: { ...state.tech, progress: newProgress },
    });
  }
}

// 完成研究
function completeResearch(tech: TechDef): void {
  const state = useGameStore.getState();

  useGameStore.setState({
    tech: {
      researched: [...state.tech.researched, tech.id],
      current: null,
      progress: 0,
    },
    // 更新图鉴
    codex: {
      ...state.codex,
      discoveredTechs: [...state.codex.discoveredTechs, tech.id],
    },
  });

  useUIStore.getState().addNotification({
    type: 'success',
    message: `研究完成: ${tech.name}!`,
  });

  // 显示历史事件
  if (tech.historicalEvent) {
    const historicalEvent = Object.values(HISTORICAL_EVENTS).find((e) => e.relatedTech === tech.id);
    if (historicalEvent) {
      useUIStore.getState().addNotification({
        type: 'info',
        message: `📜 ${historicalEvent.name}`,
      });
    }
  }

  // 通知解锁内容
  if (tech.unlocks.buildings && tech.unlocks.buildings.length > 0) {
    useUIStore.getState().addNotification({
      type: 'info',
      message: `解锁建筑: ${tech.unlocks.buildings.join(', ')}`,
    });
  }
  if (tech.unlocks.troops && tech.unlocks.troops.length > 0) {
    useUIStore.getState().addNotification({
      type: 'info',
      message: `解锁兵种: ${tech.unlocks.troops.length}种`,
    });
  }

  // 记录编年史与合法性加成
  useGameStore.getState().recordChronicle({
    category: 'tech',
    title: '科技突破',
    description: `成功研究${tech.name}，开启新篇章`,
    impact: '合法性+2，解锁新内容',
  });
  useGameStore.getState().modifyLegitimacy(2, `科技突破：${tech.name}`);
}

// 取消研究
export function cancelResearch(): void {
  const state = useGameStore.getState();
  if (!state.tech.current) return;

  // 退还50%知识
  const tech = getTech(state.tech.current);
  if (tech) {
    useGameStore.getState().addResource('knowledge', Math.floor(tech.cost * 0.5));
  }

  useGameStore.setState({
    tech: { ...state.tech, current: null, progress: 0 },
  });

  useUIStore.getState().addNotification({
    type: 'warning',
    message: '研究已取消，退还50%知识',
  });
}

// 获取当前时代（根据已研究科技推断）
export function getCurrentEra(): string {
  const researched = useGameStore.getState().tech.researched;
  const techs = researched.map((id) => getTech(id)).filter((t): t is TechDef => t !== undefined);

  if (techs.length === 0) return '石器时代';

  // 按时代排序，取最后一个
  const eraOrder = ['石器时代', '青铜时代', '铁器时代', '火药时代', '蒸汽时代', '电力时代', '核能时代', '信息时代', '太空时代', '未来时代', '因果时代'];

  let currentEra = '石器时代';
  for (const tech of techs) {
    if (eraOrder.indexOf(tech.era) > eraOrder.indexOf(currentEra)) {
      currentEra = tech.era;
    }
  }

  return currentEra;
}
