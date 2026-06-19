// 放置帝国 - 语言破译面板
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  guessChar,
  getCipherProgress,
  getCipherStats,
  discoverCipherDocument,
} from '@/game/systems/cipherSystem';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type { CipherDocument } from '@/game/types';

const DIFFICULTY_INFO = {
  easy: { name: '简单', color: 'text-green-400', rewardMult: 1 },
  medium: { name: '中等', color: 'text-yellow-400', rewardMult: 3 },
  hard: { name: '困难', color: 'text-red-400', rewardMult: 10 },
};

const REWARD_TYPE_INFO = {
  currency: { name: '转生货币', icon: '💎' },
  tech: { name: '隐藏科技', icon: '🔬' },
  relic: { name: '遗物', icon: '🏺' },
  troop: { name: '兵种', icon: '⚔️' },
};

export function CipherPanel() {
  const cipherDocuments = useGameStore((state) => state.cipherDocuments);
  const gameState = useGameStore.getState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guessInput, setGuessInput] = useState('');
  const [selectedCipherChar, setSelectedCipherChar] = useState<string | null>(null);

  const stats = getCipherStats(gameState);
  const selectedDoc = cipherDocuments.find((d) => d.id === selectedId) || null;

  const handleGuess = () => {
    if (!selectedDoc || !selectedCipherChar || !guessInput) return;
    const success = guessChar(selectedDoc.id, selectedCipherChar, guessInput);
    if (success) {
      useGameStore.getState(); // 刷新状态
    }
    setGuessInput('');
    setSelectedCipherChar(null);
  };

  // 渲染加密文本，高亮已知字符
  const renderEncryptedText = (doc: CipherDocument) => {
    return doc.encryptedText.split('').map((char, idx) => {
      // 检查这个加密字符对应的明文是否已知
      const knownPlain = Object.entries(doc.cipherMap).find(
        ([, c]) => c === char
      )?.[0];
      const isKnown = knownPlain && doc.knownChars.includes(knownPlain);

      return (
        <span
          key={idx}
          className={`inline-block mx-0.5 px-1 py-0.5 rounded cursor-pointer transition-colors ${
            isKnown
              ? 'bg-green-900/50 text-green-300'
              : selectedCipherChar === char
              ? 'bg-yellow-900/50 text-yellow-300'
              : 'bg-ancient-800/50 text-ancient-200 hover:bg-ancient-700/50'
          }`}
          onClick={() => {
            // 只能选择未知且在加密映射中的字符
            if (!isKnown && doc.cipherMap && Object.values(doc.cipherMap).includes(char)) {
              setSelectedCipherChar(char);
            }
          }}
        >
          {isKnown ? knownPlain : char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
          <span>📜</span> 语言破译
        </h2>
        <button
          className="game-button text-sm"
          onClick={() => discoverCipherDocument()}
          title="手动发现文献（通常通过战斗掉落获得）"
        >
          🔍 寻找文献
        </button>
      </div>

      {/* 统计概览 */}
      <div className="game-panel p-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-royal-300">{stats.total}</div>
            <div className="text-xs text-ancient-400">总文献</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-green-400">{stats.decoded}</div>
            <div className="text-xs text-ancient-400">已破译</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-yellow-400">{stats.byDifficulty.easy}</div>
            <div className="text-xs text-ancient-400">简单</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-red-400">
              {stats.byDifficulty.hard}
            </div>
            <div className="text-xs text-ancient-400">困难</div>
          </div>
        </div>
      </div>

      {/* 文献列表 / 破译界面 */}
      {cipherDocuments.length === 0 ? (
        <div className="game-panel p-8 text-center text-ancient-300">
          尚未发现任何古老文献，通过战斗或探索领地可获得
        </div>
      ) : !selectedDoc ? (
        <div className="space-y-3">
          {cipherDocuments.map((doc) => {
            const diff = DIFFICULTY_INFO[doc.difficulty];
            const progress = getCipherProgress(doc);
            const rewardInfo = REWARD_TYPE_INFO[doc.reward.type];
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="game-panel p-4 cursor-pointer hover:border-royal-500/50"
                onClick={() => setSelectedId(doc.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-display text-royal-200 flex items-center gap-2">
                      📜 {doc.language}文献
                      <span className={`text-xs ${diff.color}`}>{diff.name}</span>
                      {doc.isDecoded && (
                        <span className="text-xs text-green-400">✓ 已破译</span>
                      )}
                    </h3>
                    <p className="text-xs text-ancient-400 mt-1">
                      奖励：{rewardInfo.icon} {doc.reward.amount} {rewardInfo.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ancient-400">破译进度</div>
                    <div className="text-sm text-royal-300">
                      {Math.floor(progress * 100)}%
                    </div>
                  </div>
                </div>
                <ProgressBar value={progress} max={1} color="purple" height="sm" />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDoc.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {/* 返回按钮 */}
            <button
              className="game-button text-sm"
              onClick={() => {
                setSelectedId(null);
                setSelectedCipherChar(null);
                setGuessInput('');
              }}
            >
              ← 返回列表
            </button>

            <div className="game-panel p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-royal-200">
                  📜 {selectedDoc.language}文献
                  <span className={`text-xs ml-2 ${DIFFICULTY_INFO[selectedDoc.difficulty].color}`}>
                    {DIFFICULTY_INFO[selectedDoc.difficulty].name}
                  </span>
                </h3>
                <div className="text-xs text-ancient-400">
                  进度 {Math.floor(getCipherProgress(selectedDoc) * 100)}%
                </div>
              </div>

              {/* 加密文本展示 */}
              <div className="bg-ancient-900/50 p-4 rounded mb-3">
                <div className="text-xs text-ancient-400 mb-2">
                  点击未知字符进行破译（绿色为已知）：
                </div>
                <div className="text-lg leading-relaxed">
                  {renderEncryptedText(selectedDoc)}
                </div>
              </div>

              {/* 破译输入 */}
              {!selectedDoc.isDecoded && (
                <div className="bg-ancient-800/50 p-3 rounded">
                  {selectedCipherChar ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ancient-300">
                        猜测字符 <span className="text-2xl text-yellow-300 mx-2">{selectedCipherChar}</span> 对应的字母：
                      </span>
                      <input
                        type="text"
                        maxLength={1}
                        className="bg-ancient-900 text-ancient-100 text-center text-xl w-12 h-12 rounded"
                        value={guessInput}
                        onChange={(e) => setGuessInput(e.target.value.toLowerCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                        autoFocus
                      />
                      <button className="game-button text-sm" onClick={handleGuess}>
                        确认
                      </button>
                      <button
                        className="game-button text-sm"
                        onClick={() => {
                          setSelectedCipherChar(null);
                          setGuessInput('');
                        }}
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-ancient-400 text-center">
                      点击上方加密文本中的未知字符开始破译
                    </p>
                  )}
                </div>
              )}

              {/* 已知字符列表 */}
              <div className="mt-3">
                <div className="text-xs text-ancient-400 mb-1">已破译字符：</div>
                <div className="flex flex-wrap gap-1">
                  {selectedDoc.knownChars.map((char) => (
                    <span
                      key={char}
                      className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-sm"
                    >
                      {char}
                    </span>
                  ))}
                  {selectedDoc.knownChars.length === 0 && (
                    <span className="text-xs text-ancient-500">尚无</span>
                  )}
                </div>
              </div>

              {/* 奖励信息 */}
              <div className="mt-3 p-2 bg-yellow-900/20 rounded text-center">
                <span className="text-xs text-yellow-300">
                  奖励：{REWARD_TYPE_INFO[selectedDoc.reward.type].icon}{' '}
                  {selectedDoc.reward.amount} {REWARD_TYPE_INFO[selectedDoc.reward.type].name}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
