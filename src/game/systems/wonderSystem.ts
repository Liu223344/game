import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { WONDERS, getWonder, getSynergyPartner } from '@/game/data/wonders';
import type { WonderDef, WonderState, ResourceState } from '@/game/types';

// 开始建造奇观（消耗资源）
export function startWonderConstruction(wonderId: string): boolean {
  const state = useGameStore.getState();
  const wonder = getWonder(wonderId);
  if (!wonder) return false;

  // 检查是否已建造或正在建造
  const existing = state.wonders.find((w) => w.defId === wonderId);
  if (existing?.built) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该奇观已建造完成' });
    return false;
  }
  if (existing && !existing.built) {
    useUIStore.getState().addNotification({ type: 'warning', message: '该奇观正在建造中' });
    return false;
  }

  // 检查解锁科技
  if (!state.tech.researched.includes(wonder.unlockTech)) {
    useUIStore.getState().addNotification({
      type: 'warning',
      message: `需先研究解锁科技`,
    });
    return false;
  }

  // 检查资源
  if (!state.hasResources(wonder.cost)) {
    useUIStore.getState().addNotification({ type: 'warning', message: '资源不足，无法建造奇观' });
    return false;
  }

  // 扣除资源
  for (const [res, amount] of Object.entries(wonder.cost)) {
    state.spendResource(res as keyof ResourceState, amount as number);
  }

  // 添加建造中的奇观
  const newWonder: WonderState = {
    defId: wonderId,
    built: false,
    buildProgress: 0,
  };
  useGameStore.setState({ wonders: [...state.wonders, newWonder] });

  useUIStore.getState().addNotification({
    type: 'info',
    message: `开始建造 ${wonder.name}`,
  });

  return true;
}

// 更新建造进度（每tick调用）
export function updateWonderConstruction(deltaSeconds: number): void {
  const state = useGameStore.getState();
  if (state.wonders.length === 0) return;

  let updated = false;
  const newWonders = state.wonders.map((wonder) => {
    if (wonder.built) return wonder;

    const def = getWonder(wonder.defId);
    if (!def) return wonder;

    const progressPerTick = deltaSeconds / def.buildTime;
    const newProgress = wonder.buildProgress + progressPerTick;

    if (newProgress >= 1) {
      updated = true;
      // 建造完成
      completeWonder(def);
      return { ...wonder, built: true, buildProgress: 1 };
    }

    if (newProgress > wonder.buildProgress) {
      updated = true;
      return { ...wonder, buildProgress: newProgress };
    }

    return wonder;
  });

  if (updated) {
    useGameStore.setState({ wonders: newWonders });
  }
}

// 完成奇观建造
function completeWonder(wonder: WonderDef): void {
  useUIStore.getState().addNotification({
    type: 'success',
    message: `奇观建造完成：${wonder.name}！`,
  });

  // 记录编年史与合法性加成（奇观是帝国伟业，大幅提升合法性）
  useGameStore.getState().recordChronicle({
    category: 'culture',
    title: '奇观落成',
    description: `${wonder.name}宏伟落成，万民称颂`,
    impact: '合法性+8，文化值提升',
  });
  useGameStore.getState().modifyLegitimacy(8, `奇观落成：${wonder.name}`);
  useGameStore.getState().addCulture(50);

  // 检查协同效应
  const synergyPartner = getSynergyPartner(wonder.id);
  if (synergyPartner) {
    const state = useGameStore.getState();
    const partnerBuilt = state.wonders.find(
      (w) => w.defId === synergyPartner.id && w.built
    );
    if (partnerBuilt && wonder.synergyEffect) {
      useUIStore.getState().addNotification({
        type: 'info',
        message: `协同效应激活：${wonder.synergyEffect}`,
      });
      useGameStore.getState().recordChronicle({
        category: 'culture',
        title: '奇观协同',
        description: `${wonder.name}与${synergyPartner.name}形成协同效应`,
        impact: wonder.synergyEffect,
      });
    }
  }
}

// 获取已建造奇观
export function getBuiltWonders(): WonderDef[] {
  const wonders = useGameStore.getState().wonders;
  return wonders
    .filter((w) => w.built)
    .map((w) => getWonder(w.defId))
    .filter((w): w is WonderDef => w !== undefined);
}

// 获取正在建造的奇观
export function getConstructingWonders(): WonderState[] {
  return useGameStore
    .getState()
    .wonders.filter((w) => !w.built);
}

// 获取奇观加成（仅静态加成，函数型加成需调用方自行处理）
export function getWonderBonus(): Partial<ResourceState> {
  const state = useGameStore.getState();
  const bonus: Partial<ResourceState> = {};

  for (const wonderState of state.wonders) {
    if (!wonderState.built) continue;
    const def = getWonder(wonderState.defId);
    if (!def) continue;

    // 仅累加静态对象型加成
    if (typeof def.effectBonus === 'object') {
      for (const [res, amount] of Object.entries(def.effectBonus)) {
        const key = res as keyof ResourceState;
        bonus[key] = (bonus[key] || 0) + (amount as number);
      }
    }
  }

  return bonus;
}

// 检查奇观协同效应
export function checkSynergy(): { wonderId: string; partnerId: string; effect: string }[] {
  const state = useGameStore.getState();
  const synergies: { wonderId: string; partnerId: string; effect: string }[] = [];
  const builtWonders = state.wonders.filter((w) => w.built);

  for (const wonderState of builtWonders) {
    const def = getWonder(wonderState.defId);
    if (!def?.synergyWith || !def.synergyEffect) continue;

    // 检查协同伙伴是否已建造
    const partnerBuilt = builtWonders.find((w) => w.defId === def.synergyWith);
    if (partnerBuilt) {
      synergies.push({
        wonderId: def.id,
        partnerId: def.synergyWith,
        effect: def.synergyEffect,
      });
    }
  }

  return synergies;
}

// 获取所有奇观定义
export function getAllWonders(): WonderDef[] {
  return Object.values(WONDERS);
}

// 获取已解锁的奇观
export function getUnlockedWonders(): WonderDef[] {
  const researched = useGameStore.getState().tech.researched;
  return Object.values(WONDERS).filter((w) => researched.includes(w.unlockTech));
}
