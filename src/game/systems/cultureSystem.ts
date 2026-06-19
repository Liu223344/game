// 放置帝国 - 文化影响力系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { GameState } from '@/game/types';

// 获取文化产出（来自建筑、奇观、科技）
export function calculateCultureGain(state: GameState): number {
  let gain = 0;

  // 学院建筑产出文化
  const academy = state.buildings.academy;
  if (academy.isActive && academy.level > 0) {
    gain += academy.level * 0.5;
  }

  // 奇观加成
  state.wonders.forEach((w) => {
    if (!w.built) return;
    const cultureWonders = ['great_library', 'hanging_gardens', 'statue_of_zeus', 'sistine_chapel'];
    if (cultureWonders.includes(w.defId)) {
      gain += 2;
    }
  });

  // 统治者魅力技能加成
  const charismaBonus = state.ruler.skills.charisma * 0.05;
  gain *= 1 + charismaBonus;

  return gain;
}

// 更新文化值（每tick调用）
export function updateCulture(deltaSeconds: number): void {
  const state = useGameStore.getState();
  const gain = calculateCultureGain(state) * deltaSeconds;
  if (gain > 0) {
    useGameStore.getState().addCulture(gain);
  }
}

// 获取文化等级
export function getCultureLevel(state: GameState): { name: string; color: string } {
  const value = state.culture.value;
  if (value >= 1000) return { name: '文明灯塔', color: 'text-yellow-400' };
  if (value >= 500) return { name: '文化昌盛', color: 'text-purple-400' };
  if (value >= 200) return { name: '文化繁荣', color: 'text-blue-400' };
  if (value >= 50) return { name: '文化萌芽', color: 'text-green-400' };
  return { name: '蛮荒之地', color: 'text-ancient-400' };
}

// 检查文化归附（文化值高时邻近领地主动归附）
export function checkCultureAnnexation(state: GameState): void {
  if (state.culture.influence < 100) return;
  // 每100文化影响力有概率触发归附
  if (Math.random() > 0.001) return;

  // 找到未占领的领地
  const unowned = state.territories.filter((t) => !t.owned);
  if (unowned.length === 0) return;

  const target = unowned[Math.floor(Math.random() * unowned.length)];
  useGameStore.setState((s) => ({
    territories: s.territories.map((t) =>
      t.defId === target.defId ? { ...t, owned: true } : t
    ),
  }));

  useGameStore.getState().recordChronicle({
    category: 'culture',
    title: '文化归附',
    description: `受我方文化影响，${target.defId}主动归附`,
    impact: '获得新领地，无需战争',
  });
  useUIStore.getState().addNotification({
    type: 'success',
    message: `${target.defId}受文化影响主动归附！`,
  });
}

// 检查文化胜利条件
export function checkCultureVictory(state: GameState): boolean {
  // 文化影响力覆盖50%以上领地
  const ownedCount = state.territories.filter((t) => t.owned).length;
  const totalCount = state.territories.length;
  if (totalCount === 0) return false;
  const coverage = ownedCount / totalCount;
  return state.culture.influence >= 2000 && coverage >= 0.5;
}

// 获取文化对已占领领地的忠诚度加成
export function getCultureLoyaltyBonus(state: GameState): number {
  // 文化值越高，领地忠诚度越高，减少叛乱风险
  return Math.min(0.5, state.culture.value / 2000); // 最高50%叛乱风险降低
}
