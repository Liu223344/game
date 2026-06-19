import { useState } from 'react';
import type { ReactNode } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TROOPS } from '@/game/data/troops';
import { SUPER_TROOPS } from '@/game/data/superTroops';
import { TECHS } from '@/game/data/techs';
import { CIVILIZATIONS } from '@/game/data/civilizations';
import { RELICS, getRelicsBySet, getAllSetIds } from '@/game/data/relics';
import { EVENTS } from '@/game/data/events';
import { formatNumber } from '@/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  TroopDef,
  TechDef,
  CivilizationDef,
  RelicDef,
  GameEvent,
} from '@/game/types';

// 标签页类型
type CodexTab = 'troops' | 'techs' | 'civilizations' | 'relics' | 'events';

// 标签页信息
const TAB_INFO: Record<CodexTab, { label: string; icon: string }> = {
  troops: { label: '兵种', icon: '⚔️' },
  techs: { label: '科技', icon: '🔬' },
  civilizations: { label: '文明', icon: '🏛️' },
  relics: { label: '遗物', icon: '💎' },
  events: { label: '事件', icon: '📜' },
};

// 标签页顺序
const TAB_ORDER: CodexTab[] = ['troops', 'techs', 'civilizations', 'relics', 'events'];

// 稀有度样式
const RARITY_STYLES: Record<string, { label: string; className: string }> = {
  common: { label: '普通', className: 'text-gray-300' },
  rare: { label: '稀有', className: 'text-blue-300' },
  epic: { label: '史诗', className: 'text-purple-300' },
  legendary: { label: '传说', className: 'text-yellow-300' },
  mythic: { label: '神话', className: 'text-pink-300' },
};

// 兵种类别名称
const TROOP_CLASS_NAMES: Record<string, string> = {
  infantry: '步兵',
  archer: '弓兵',
  cavalry: '骑兵',
  siege: '攻城',
  myth: '神话',
  future: '未来',
  commander: '指挥官',
  hidden: '隐藏',
};

// 事件类型名称
const EVENT_TYPE_NAMES: Record<string, string> = {
  merchant: '商人',
  festival: '节日',
  disaster: '灾难',
  discovery: '发现',
  mystery: '神秘',
};

export function CodexPanel() {
  const codex = useGameStore((state) => state.codex);
  const relics = useGameStore((state) => state.relics);
  const [activeTab, setActiveTab] = useState<CodexTab>('troops');

  // 所有数据
  const allTroops = [...Object.values(TROOPS), ...Object.values(SUPER_TROOPS)];
  const allTechs = Object.values(TECHS);
  const allCivilizations = Object.values(CIVILIZATIONS);
  const allRelics = Object.values(RELICS);
  const allEvents = Object.values(EVENTS);

  // 各分类已发现数量
  const discoveredCounts = {
    troops: codex.discoveredTroops.length,
    techs: codex.discoveredTechs.length,
    civilizations: codex.discoveredCivilizations.length,
    relics: codex.discoveredRelics.length,
    events: codex.discoveredEvents.length,
  };

  // 各分类总数
  const totalCounts = {
    troops: allTroops.length,
    techs: allTechs.length,
    civilizations: allCivilizations.length,
    relics: allRelics.length,
    events: allEvents.length,
  };

  // 总完成度
  const totalDiscovered = Object.values(discoveredCounts).reduce((a, b) => a + b, 0);
  const totalItems = Object.values(totalCounts).reduce((a, b) => a + b, 0);
  const completionRate = totalItems > 0 ? totalDiscovered / totalItems : 0;

  // 已拥有的遗物ID集合（用于套装进度）
  const ownedRelicIds = new Set(
    relics.filter((r) => r.count > 0).map((r) => r.defId)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">图鉴</h2>
        <p className="text-ancient-400 text-sm">记录你发现的一切</p>
      </div>

      {/* 完成度总览 */}
      <div className="game-panel">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-ancient-400">图鉴完成度</div>
            <div className="text-xl font-mono text-royal-300">
              {totalDiscovered} / {totalItems}
            </div>
          </div>
          <div className="text-2xl font-display text-royal-300">
            {(completionRate * 100).toFixed(1)}%
          </div>
        </div>
        <ProgressBar
          value={completionRate}
          color="gold"
          height="md"
          showPercent
        />
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 flex-wrap">
        {TAB_ORDER.map((tab) => {
          const info = TAB_INFO[tab];
          const discovered = discoveredCounts[tab];
          const total = totalCounts[tab];
          return (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-royal-600 text-royal-50 border border-royal-400/50'
                  : 'bg-ancient-700 text-ancient-200 hover:bg-ancient-600 border border-ancient-600/40'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
              <span className="text-xs opacity-80">
                {discovered}/{total}
              </span>
            </button>
          );
        })}
      </div>

      {/* 标签页内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'troops' && (
            <CodexGrid
              items={allTroops}
              discoveredIds={new Set(codex.discoveredTroops)}
              renderDiscovered={(item) => <TroopInfo troop={item} />}
              getLabel={(item) => item.name}
            />
          )}

          {activeTab === 'techs' && (
            <CodexGrid
              items={allTechs}
              discoveredIds={new Set(codex.discoveredTechs)}
              renderDiscovered={(item) => <TechInfo tech={item} />}
              getLabel={(item) => item.name}
            />
          )}

          {activeTab === 'civilizations' && (
            <CodexGrid
              items={allCivilizations}
              discoveredIds={new Set(codex.discoveredCivilizations)}
              renderDiscovered={(item) => <CivilizationInfo civ={item} />}
              getLabel={(item) => item.name}
            />
          )}

          {activeTab === 'relics' && (
            <div className="space-y-4">
              {/* 套装进度 */}
              <RelicSetProgress ownedRelicIds={ownedRelicIds} />
              {/* 遗物列表 */}
              <CodexGrid
                items={allRelics}
                discoveredIds={new Set(codex.discoveredRelics)}
                renderDiscovered={(item) => <RelicInfo relic={item} owned={ownedRelicIds.has(item.id)} />}
                getLabel={(item) => item.name}
              />
            </div>
          )}

          {activeTab === 'events' && (
            <CodexGrid
              items={allEvents}
              discoveredIds={new Set(codex.discoveredEvents)}
              renderDiscovered={(item) => <EventInfo event={item} />}
              getLabel={(item) => item.name}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============ 通用图鉴网格 ============
interface CodexGridProps<T> {
  items: T[];
  discoveredIds: Set<string>;
  renderDiscovered: (item: T) => ReactNode;
  getLabel: (item: T) => string;
}

function CodexGrid<T extends { id: string }>({
  items,
  discoveredIds,
  renderDiscovered,
  getLabel,
}: CodexGridProps<T>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item) => {
        const discovered = discoveredIds.has(item.id);
        return (
          <motion.div
            key={item.id}
            className={`game-panel ${!discovered ? 'opacity-60' : ''}`}
            whileHover={{ scale: discovered ? 1.01 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {discovered ? (
              renderDiscovered(item)
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-3xl grayscale">❓</span>
                <div>
                  <div className="font-semibold text-ancient-400">未发现</div>
                  <div className="text-xs text-ancient-500">
                    {getLabel(item).replace(/./g, '?')}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ============ 兵种信息 ============
function TroopInfo({ troop }: { troop: TroopDef }) {
  const rarity = troop.rarity ? RARITY_STYLES[troop.rarity] : null;
  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">{troop.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{troop.name}</span>
            {rarity && (
              <span className={`text-xs px-2 py-0.5 rounded bg-ancient-700 ${rarity.className}`}>
                {rarity.label}
              </span>
            )}
          </div>
          <div className="text-xs text-ancient-500 mt-0.5">
            {TROOP_CLASS_NAMES[troop.class] || troop.class}
            {troop.isLegendary && <span className="ml-1 text-yellow-400">★传奇</span>}
            {troop.isSuperTroop && <span className="ml-1 text-pink-400">★超级</span>}
          </div>
        </div>
      </div>
      <p className="text-xs text-ancient-400 mb-2">{troop.description}</p>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">攻击</div>
          <div className="text-red-400 font-mono">{formatNumber(troop.attack)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">防御</div>
          <div className="text-blue-400 font-mono">{formatNumber(troop.defense)}</div>
        </div>
        <div className="bg-ancient-900/40 rounded px-1 py-1">
          <div className="text-ancient-500">生命</div>
          <div className="text-green-400 font-mono">{formatNumber(troop.hp)}</div>
        </div>
      </div>
    </div>
  );
}

// ============ 科技信息 ============
function TechInfo({ tech }: { tech: TechDef }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">{tech.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{tech.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-ancient-300">
              {tech.era}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-ancient-400 mb-2">{tech.description}</p>
      {tech.knowledge && (
        <div className="text-xs text-blue-300 bg-knowledge-900/20 border border-knowledge-700/30 rounded px-2 py-1 mb-1">
          <span className="text-knowledge-400">📖 知识:</span> {tech.knowledge}
        </div>
      )}
      {tech.historicalEvent && (
        <div className="text-xs text-royal-300 bg-royal-900/20 border border-royal-700/30 rounded px-2 py-1">
          <span className="text-royal-400">📜 历史:</span> {tech.historicalEvent}
        </div>
      )}
    </div>
  );
}

// ============ 文明信息 ============
function CivilizationInfo({ civ }: { civ: CivilizationDef }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">{civ.icon}</span>
        <div className="flex-1">
          <span className="font-semibold text-ancient-100">{civ.name}</span>
        </div>
      </div>
      <p className="text-xs text-ancient-400 mb-2">{civ.description}</p>
      <div className="space-y-1">
        {civ.bonuses.map((bonus, i) => (
          <div key={i} className="text-xs text-royal-300 flex items-start gap-1">
            <span>•</span>
            <span>{bonus.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ 遗物信息 ============
function RelicInfo({ relic, owned }: { relic: RelicDef; owned: boolean }) {
  const rarity = RARITY_STYLES[relic.rarity];
  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className={`text-3xl ${!owned ? 'opacity-50' : ''}`}>{relic.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{relic.name}</span>
            <div className="flex gap-1">
              {owned && (
                <span className="text-xs px-2 py-0.5 rounded bg-green-900/40 text-green-300 border border-green-700/40">
                  已拥有
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded bg-ancient-700 ${rarity.className}`}>
                {rarity.label}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-ancient-400 mb-2">{relic.description}</p>
      <div className="text-xs text-royal-300 mb-1">
        <span className="text-ancient-400">效果:</span> {relic.effect}
      </div>
      {relic.setBonus && (
        <div className="text-xs text-purple-300 bg-purple-900/20 border border-purple-700/30 rounded px-2 py-1">
          <span className="text-purple-400">💎 套装:</span> {relic.setBonus}
        </div>
      )}
    </div>
  );
}

// ============ 遗物套装进度 ============
function RelicSetProgress({ ownedRelicIds }: { ownedRelicIds: Set<string> }) {
  const setIds = getAllSetIds();
  if (setIds.length === 0) return null;

  return (
    <div className="game-panel">
      <h3 className="text-sm font-display text-purple-300 mb-3 flex items-center gap-2">
        <span>💎</span> 遗物套装进度
      </h3>
      <div className="space-y-3">
        {setIds.map((setId) => {
          const setRelics = getRelicsBySet(setId);
          const ownedCount = setRelics.filter((r) => ownedRelicIds.has(r.id)).length;
          const isComplete = ownedCount === setRelics.length;
          return (
            <div key={setId}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={isComplete ? 'text-purple-300' : 'text-ancient-300'}>
                  {setRelics[0]?.setBonus?.split('：')[0] || setId}
                  {isComplete && <span className="ml-1 text-green-400">✓</span>}
                </span>
                <span className="text-ancient-400">
                  {ownedCount} / {setRelics.length}
                </span>
              </div>
              <ProgressBar
                value={ownedCount}
                max={setRelics.length}
                color={isComplete ? 'purple' : 'gold'}
                height="sm"
              />
              <div className="flex gap-1 mt-1">
                {setRelics.map((r) => (
                  <span
                    key={r.id}
                    className={`text-lg ${ownedRelicIds.has(r.id) ? '' : 'grayscale opacity-40'}`}
                    title={ownedRelicIds.has(r.id) ? r.name : '未拥有'}
                  >
                    {r.icon}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ 事件信息 ============
function EventInfo({ event }: { event: GameEvent }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl">📜</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ancient-100">{event.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-ancient-300">
              {EVENT_TYPE_NAMES[event.type] || event.type}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-ancient-400 mb-2">{event.description}</p>
      <div className="text-xs text-ancient-400">
        <span className="text-ancient-500">选项数:</span> {event.choices.length}
      </div>
    </div>
  );
}
