// 放置帝国 - 外交面板
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CIVILIZATIONS } from '@/game/data/civilizations';
import {
  formAlliance,
  tradeWithEmpire,
  declareWar,
  makePeace,
  demandTribute,
  getRelationLevel,
  getDiplomacySummary,
} from '@/game/systems/diplomacySystem';
import { motion } from 'framer-motion';
import { RESOURCE_INFO } from '@/utils/constants';
import type { ResourceType } from '@/game/types';

const RESOURCES: ResourceType[] = ['food', 'wood', 'stone', 'metal', 'gold', 'knowledge'];

export function DiplomacyPanel() {
  const diplomacy = useGameStore((state) => state.diplomacy);
  const resources = useGameStore((state) => state.resources);
  const gameState = useGameStore.getState();
  const [tradeEmpire, setTradeEmpire] = useState<string | null>(null);
  const [giveRes, setGiveRes] = useState<ResourceType>('food');
  const [giveAmt, setGiveAmt] = useState(100);
  const [recvRes, setRecvRes] = useState<ResourceType>('gold');

  const summary = getDiplomacySummary(gameState);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
        <span>🤝</span> 外交
      </h2>

      {/* 外交概览 */}
      <div className="game-panel p-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-royal-300">{summary.aliveEmpires}</div>
            <div className="text-xs text-ancient-400">现存帝国</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-green-400">{summary.allies}</div>
            <div className="text-xs text-ancient-400">盟友</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-red-400">{summary.enemies}</div>
            <div className="text-xs text-ancient-400">敌对</div>
          </div>
          <div className="bg-ancient-800/50 p-2 rounded">
            <div className="text-xl font-display text-blue-400">{diplomacy.tradeHistory.length}</div>
            <div className="text-xs text-ancient-400">贸易次数</div>
          </div>
        </div>
      </div>

      {/* AI帝国列表 */}
      {diplomacy.empires.length === 0 ? (
        <div className="game-panel p-8 text-center text-ancient-300">
          尚未发现其他帝国，继续扩张领土将遇到邻邦
        </div>
      ) : (
        <div className="space-y-3">
          {diplomacy.empires.map((empire) => {
            if (!empire.isAlive) return null;
            const civ = CIVILIZATIONS[empire.civilization];
            const relLevel = getRelationLevel(empire.relation);
            const playerArmy = gameState.troops.reduce((s, t) => s + t.count, 0);
            const canDemandTribute = playerArmy >= empire.armySize * 2;
            const isAtWar = empire.relationStatus === 'war';
            const isAlly = empire.relationStatus === 'ally';

            return (
              <motion.div
                key={empire.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="game-panel p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-display text-royal-200">{empire.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-ancient-200">
                        {civ?.name || empire.civilization}
                      </span>
                      {isAtWar && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-900 text-red-200">交战中</span>
                      )}
                      {isAlly && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-900 text-green-200">盟友</span>
                      )}
                    </div>
                    <div className="text-xs text-ancient-400 mt-1">
                      国力 {Math.floor(empire.power)} · 军队 {empire.armySize} · 领地 {empire.territories}
                    </div>
                    <div className="text-xs text-ancient-500 mt-0.5">{empire.lastAction}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${relLevel.color}`}>{relLevel.name}</div>
                    <div className="text-xs text-ancient-400">{empire.relation}/100</div>
                  </div>
                </div>

                {/* 关系条 */}
                <div className="w-full h-2 bg-ancient-900 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      empire.relation >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(Math.abs(empire.relation) / 100) * 100}%` }}
                  />
                </div>

                {/* 外交行动按钮 */}
                <div className="flex flex-wrap gap-2">
                  {!isAlly && !isAtWar && (
                    <button
                      className="game-button text-sm"
                      disabled={empire.relation < 40 || resources.gold < 100}
                      onClick={() => formAlliance(empire.id)}
                      title={empire.relation < 40 ? '关系不足' : '消耗100金币'}
                    >
                      🤝 结盟 (🪙100)
                    </button>
                  )}

                  <button
                    className="game-button text-sm"
                    disabled={empire.tradeCooldown > 0}
                    onClick={() => setTradeEmpire(tradeEmpire === empire.id ? null : empire.id)}
                  >
                    📦 {empire.tradeCooldown > 0 ? `冷却${Math.ceil(empire.tradeCooldown)}s` : '贸易'}
                  </button>

                  {!isAtWar && (
                    <button
                      className="game-button text-sm"
                      onClick={() => declareWar(empire.id)}
                    >
                      ⚔️ 宣战
                    </button>
                  )}

                  {isAtWar && (
                    <button
                      className="game-button text-sm"
                      disabled={resources.gold < 200}
                      onClick={() => makePeace(empire.id)}
                    >
                      🕊️ 议和 (🪙200)
                    </button>
                  )}

                  {!isAtWar && canDemandTribute && (
                    <button
                      className="game-button text-sm"
                      onClick={() => demandTribute(empire.id)}
                    >
                      💰 索贡
                    </button>
                  )}
                </div>

                {/* 贸易界面 */}
                {tradeEmpire === empire.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-ancient-800/50 rounded space-y-2"
                  >
                    <div className="text-sm text-royal-200">贸易交换（比率1:0.8）</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-ancient-400">付出：</span>
                      <select
                        className="bg-ancient-900 text-ancient-100 text-sm rounded px-2 py-1"
                        value={giveRes}
                        onChange={(e) => setGiveRes(e.target.value as ResourceType)}
                        aria-label="付出资源"
                      >
                        {RESOURCES.map((r) => (
                          <option key={r} value={r}>{RESOURCE_INFO[r]?.name || r}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="bg-ancient-900 text-ancient-100 text-sm rounded px-2 py-1 w-20"
                        value={giveAmt}
                        onChange={(e) => setGiveAmt(Math.max(1, Number(e.target.value)))}
                        min={1}
                        aria-label="付出数量"
                      />
                      <span className="text-xs text-ancient-400">换取：</span>
                      <select
                        className="bg-ancient-900 text-ancient-100 text-sm rounded px-2 py-1"
                        value={recvRes}
                        onChange={(e) => setRecvRes(e.target.value as ResourceType)}
                        aria-label="换取资源"
                      >
                        {RESOURCES.map((r) => (
                          <option key={r} value={r}>{RESOURCE_INFO[r]?.name || r}</option>
                        ))}
                      </select>
                      <span className="text-xs text-green-400">≈ {Math.floor(giveAmt * 0.8)}</span>
                      <button
                        className="game-button text-sm"
                        disabled={resources[giveRes] < giveAmt}
                        onClick={() => {
                          if (tradeWithEmpire(empire.id, giveRes, giveAmt, recvRes)) {
                            setTradeEmpire(null);
                          }
                        }}
                      >
                        确认
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
