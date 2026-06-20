// 放置帝国 - 语言破译谜题系统
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import type { CipherDocument, GameState } from '@/game/types';

// 语言定义
const LANGUAGES = [
  { name: '远古符文', chars: 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ', map: 'abcdefghijklmnopqrstuvwxyz' },
  { name: '神代文字', chars: 'αβγδεζηθικλμνξοπρστυφχψω', map: 'abcdefghijklmnopqrstuvwxyz' },
  { name: '失落文明语', chars: '𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓀐𓀑𓀒𓀓', map: 'abcdefghijklmnopqrst' },
];

// 加密文本库
const CIPHER_TEXTS = [
  'the ancient power lies within',
  'knowledge is the key to victory',
  'the dragon sleeps in the mountain',
  'empires rise and fall like stars',
  'time flows like a river eternal',
  'the void whispers forgotten truths',
  'beyond the stars lies destiny',
  'the crown bears the weight of ages',
];

// 生成密码文献
export function generateCipherDocument(difficulty: 'easy' | 'medium' | 'hard' = 'easy'): CipherDocument {
  const lang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
  const text = CIPHER_TEXTS[Math.floor(Math.random() * CIPHER_TEXTS.length)];

  // 构建加密映射
  const cipherMap: Record<string, string> = {};
  const plainChars = lang.map.split('');
  const cipherChars = lang.chars.split('');

  // 随机打乱加密字符
  const shuffled = [...cipherChars].sort(() => Math.random() - 0.5);
  plainChars.forEach((p, i) => {
    if (i < shuffled.length) {
      cipherMap[p] = shuffled[i];
    }
  });

  // 加密文本
  const encryptedText = text
    .split('')
    .map((c) => {
      const lower = c.toLowerCase();
      if (cipherMap[lower]) {
        // 保留大小写：大写字母对应密文也需大写
        return c === lower ? cipherMap[lower] : cipherMap[lower].toUpperCase();
      }
      return c;
    })
    .join('');

  // 根据难度决定初始已知字符数
  const knownCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 1;
  const knownChars = plainChars.slice(0, knownCount);

  // 奖励
  const rewards = [
    { type: 'currency' as const, id: 'rebirth_currency', amount: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 15 : 50 },
    { type: 'tech' as const, id: 'hiddenKnowledge', amount: 1 },
    { type: 'relic' as const, id: 'genesisTablet', amount: 1 },
  ];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  return {
    id: `cipher_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    language: lang.name,
    difficulty,
    encryptedText,
    cipherMap,
    knownChars,
    isDecoded: false,
    reward,
  };
}

// 随机发现密码文献（战斗掉落或领地探索时）
export function discoverCipherDocument(): void {
  const state = useGameStore.getState();
  // 最多保留10个未破译文献
  const undecoded = state.cipherDocuments.filter((d) => !d.isDecoded);
  if (undecoded.length >= 10) return;

  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'easy', 'medium', 'medium', 'hard'];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const doc = generateCipherDocument(difficulty);

  useGameStore.getState().addCipherDocument(doc);
  useUIStore.getState().addNotification({
    type: 'info',
    message: `发现${doc.language}文献！可前往破译`,
  });
  useGameStore.getState().recordChronicle({
    category: 'culture',
    title: '发现古老文献',
    description: `发现一份${doc.language}文献（${difficulty}难度）`,
    impact: '破译后可获得奖励',
  });
}

// 猜测字符映射
export function guessChar(docId: string, cipherChar: string, guess: string): boolean {
  const state = useGameStore.getState();
  const doc = state.cipherDocuments.find((d) => d.id === docId);
  if (!doc || doc.isDecoded) return false;

  // 检查猜测是否正确
  const correctPlain = Object.entries(doc.cipherMap).find(([, c]) => c === cipherChar)?.[0];
  if (!correctPlain) return false;

  if (guess.toLowerCase() === correctPlain) {
    // 猜对了，添加到已知字符
    if (!doc.knownChars.includes(correctPlain)) {
      useGameStore.getState().updateCipherDocument(docId, {
        knownChars: [...doc.knownChars, correctPlain],
      });
    }
    // 检查是否全部破译
    const allChars = new Set(doc.encryptedText.replace(/[^a-zA-Z]/g, '').toLowerCase().split(''));
    const knownSet = new Set([...doc.knownChars, correctPlain]);
    const allKnown = Array.from(allChars).every((c) => knownSet.has(c));

    if (allKnown) {
      useGameStore.getState().updateCipherDocument(docId, { isDecoded: true });
      applyCipherReward(doc);
      useUIStore.getState().addNotification({
        type: 'success',
        message: `${doc.language}文献破译完成！获得奖励`,
      });
      useGameStore.getState().recordChronicle({
        category: 'culture',
        title: '文献破译完成',
        description: `成功破译${doc.language}文献`,
        impact: `获得${doc.reward.amount}个${doc.reward.id}`,
      });
    }
    return true;
  }
  return false;
}

// 应用破译奖励
function applyCipherReward(doc: CipherDocument): void {
  switch (doc.reward.type) {
    case 'currency':
      useGameStore.setState((s) => ({
        rebirth: { ...s.rebirth, currency: s.rebirth.currency + doc.reward.amount },
      }));
      break;
    case 'tech':
      useGameStore.setState((s) => ({
        tech: { ...s.tech, researched: [...s.tech.researched, doc.reward.id] },
      }));
      break;
    case 'relic':
      useGameStore.setState((s) => ({
        relics: [...s.relics, { defId: doc.reward.id, count: doc.reward.amount, equipped: false }],
      }));
      break;
    case 'troop':
      useGameStore.setState((s) => ({
        troops: [...s.troops, { defId: doc.reward.id, count: doc.reward.amount, inProduction: 0, productionProgress: 0 }],
      }));
      break;
  }
}

// 获取破译进度
export function getCipherProgress(doc: CipherDocument): number {
  const allChars = new Set(doc.encryptedText.replace(/[^a-zA-Z]/g, '').toLowerCase().split(''));
  const knownSet = new Set(doc.knownChars);
  let known = 0;
  allChars.forEach((c) => {
    if (knownSet.has(c)) known++;
  });
  return allChars.size > 0 ? known / allChars.size : 0;
}

// 获取破译统计
export function getCipherStats(state: GameState): {
  total: number;
  decoded: number;
  byDifficulty: { easy: number; medium: number; hard: number };
} {
  const docs = state.cipherDocuments;
  return {
    total: docs.length,
    decoded: docs.filter((d) => d.isDecoded).length,
    byDifficulty: {
      easy: docs.filter((d) => d.difficulty === 'easy').length,
      medium: docs.filter((d) => d.difficulty === 'medium').length,
      hard: docs.filter((d) => d.difficulty === 'hard').length,
    },
  };
}
