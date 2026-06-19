// 放置帝国 - 帝国编年史系统
import { useGameStore } from '@/store/gameStore';
import type { GameState, ChronicleEntry, ChronicleCategory } from '@/game/types';

// 记录编年史事件
export function recordEvent(
  category: ChronicleCategory,
  title: string,
  description: string,
  impact?: string
): void {
  useGameStore.getState().recordChronicle({ category, title, description, impact });
}

// 按分类查询
export function getChronicleByCategory(state: GameState, category: ChronicleCategory): ChronicleEntry[] {
  return state.chronicle.filter((e) => e.category === category);
}

// 按统治者代数查询
export function getChronicleByReign(state: GameState, reign: number): ChronicleEntry[] {
  return state.chronicle.filter((e) => e.reign === reign);
}

// 统计信息
export function getChronicleStats(state: GameState): {
  total: number;
  byCategory: Record<ChronicleCategory, number>;
} {
  const byCategory: Record<ChronicleCategory, number> = {
    politics: 0,
    military: 0,
    tech: 0,
    culture: 0,
    disaster: 0,
    diplomacy: 0,
  };
  state.chronicle.forEach((e) => {
    byCategory[e.category]++;
  });
  return { total: state.chronicle.length, byCategory };
}

// 导出编年史为文本格式
export function exportChronicle(state: GameState): string {
  const lines: string[] = [];
  lines.push('=== 放置帝国·编年史 ===');
  lines.push(`总记录数：${state.chronicle.length}`);
  lines.push(`王朝代数：第${state.ruler.dynastyCount + 1}代`);
  lines.push('');

  // 按年份分组
  const byYear: Record<number, ChronicleEntry[]> = {};
  state.chronicle.forEach((e) => {
    if (!byYear[e.year]) byYear[e.year] = [];
    byYear[e.year].push(e);
  });

  const sortedYears = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  sortedYears.forEach((year) => {
    lines.push(`【第${year}年】`);
    byYear[year].forEach((e) => {
      lines.push(`  · [${e.title}] ${e.description}`);
      if (e.impact) lines.push(`    影响：${e.impact}`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

// ============ 预定义记录辅助函数 ============

export function recordWonderBuilt(wonderName: string): void {
  recordEvent(
    'culture',
    '奇观落成',
    `${wonderName}宏伟落成，万民称颂`,
    '合法性 +5，文化值提升'
  );
}

export function recordBattleVictory(enemyName: string): void {
  recordEvent(
    'military',
    '战役胜利',
    `击败${enemyName}，凯旋而归`,
    '合法性 +3，获得战利品'
  );
}

export function recordBattleDefeat(enemyName: string): void {
  recordEvent(
    'military',
    '战役失利',
    `不敌${enemyName}，损兵折将`,
    '合法性 -10，兵力损失'
  );
}

export function recordTechResearched(techName: string): void {
  recordEvent(
    'tech',
    '科技突破',
    `成功研究${techName}，开启新篇章`,
    '合法性 +2，解锁新内容'
  );
}

export function recordRebirth(civilizationName: string): void {
  recordEvent(
    'politics',
    '帝国转生',
    `以${civilizationName}文明重生，开启新纪元`,
    '获得转生货币与永久加成'
  );
}

export function recordRulerSuccession(oldName: string, newName: string): void {
  recordEvent(
    'politics',
    '王位传承',
    `${oldName}传位于${newName}，新王登基`,
    '王朝延续，合法性变化'
  );
}

export function recordTerritoryConquered(territoryName: string): void {
  recordEvent(
    'military',
    '领土扩张',
    `征服${territoryName}，版图扩大`,
    '获得新领地与资源加成'
  );
}
