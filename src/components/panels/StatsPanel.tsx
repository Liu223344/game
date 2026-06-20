// 放置帝国 - 统计面板
import { useGameStore } from '@/store/gameStore';
import { formatPlayTime } from '@/utils/format';
import { CapitalView } from '@/components/visual/CapitalView';
import { getCurrentEra } from '@/game/systems/techSystem';
import { getLegitimacyLevel } from '@/game/systems/legitimacySystem';
import { getEcologyLevel } from '@/game/systems/ecologySystem';
import { getCultureLevel } from '@/game/systems/cultureSystem';
import { getDiplomacySummary } from '@/game/systems/diplomacySystem';
import { getMultiverseProgress } from '@/game/systems/multiverseSystem';
import { getCipherStats } from '@/game/systems/cipherSystem';
import { SEASON_INFO, WEATHER_INFO, RESOURCE_INFO, RARE_RESOURCE_INFO } from '@/utils/constants';

export function StatsPanel() {
  const playTime = useGameStore((state) => state.playTime);
  const resources = useGameStore((state) => state.resources);
  const buildings = useGameStore((state) => state.buildings);
  const tech = useGameStore((state) => state.tech);
  const rebirth = useGameStore((state) => state.rebirth);
  const ruler = useGameStore((state) => state.ruler);
  const legitimacy = useGameStore((state) => state.legitimacy);
  const season = useGameStore((state) => state.season);
  const culture = useGameStore((state) => state.culture);
  const ecology = useGameStore((state) => state.ecology);
  const chronicle = useGameStore((state) => state.chronicle);
  const disasters = useGameStore((state) => state.disasters);
  const gameState = useGameStore.getState();

  const era = getCurrentEra();
  const totalBuildings = Object.values(buildings).reduce((sum, b) => sum + b.level, 0);
  const activeBuildings = Object.values(buildings).filter((b) => b.isActive).length;
  const legitLevel = getLegitimacyLevel(gameState);
  const ecoLevel = getEcologyLevel(gameState);
  const cultLevel = getCultureLevel(gameState);
  const dipSummary = getDiplomacySummary(gameState);
  const multiverseProgress = getMultiverseProgress(gameState);
  const cipherStats = getCipherStats(gameState);
  const seasonInfo = SEASON_INFO[season.current];
  const weatherInfo = WEATHER_INFO[season.weather];
  const reignYears = Math.floor((playTime - ruler.reignStart) / 480);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">统计</h2>
        <p className="text-ancient-400 text-sm">你的帝国数据概览</p>
      </div>

      <CapitalView />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 基础数据 */}
        <div className="game-panel">
          <h3 className="text-royal-300 font-display mb-3">基础数据</h3>
          <div className="space-y-2 text-sm">
            <StatRow label="当前时代" value={era} />
            <StatRow label="游戏时长" value={formatPlayTime(playTime)} />
            <StatRow label="转生次数" value={rebirth.totalRebirths.toString()} />
            <StatRow label="已研究科技" value={tech.researched.length.toString()} />
            <StatRow label="建筑总等级" value={totalBuildings.toString()} />
            <StatRow label="活跃建筑" value={activeBuildings.toString()} />
            <StatRow label="转生货币" value={rebirth.currency.toString()} />
          </div>
        </div>

        {/* 资源总量 */}
        <div className="game-panel">
          <h3 className="text-royal-300 font-display mb-3">资源总量</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(resources).map(([key, value]) => (
              <StatRow
                key={key}
                label={RESOURCE_INFO[key as keyof typeof RESOURCE_INFO]?.name || RARE_RESOURCE_INFO[key as keyof typeof RARE_RESOURCE_INFO]?.name || key}
                value={value.toFixed(0)}
              />
            ))}
          </div>
        </div>

        {/* 统治者与王朝 */}
        <div className="game-panel">
          <h3 className="text-royal-300 font-display mb-3">👑 统治者与王朝</h3>
          <div className="space-y-2 text-sm">
            <StatRow label="当前统治者" value={`${ruler.name} (${ruler.age}岁)`} />
            <StatRow label="王朝代数" value={`第${ruler.dynastyCount + 1}代`} />
            <StatRow label="在位年数" value={`${reignYears}年`} />
            <StatRow label="体力/智力/魅力" value={`${ruler.stamina}/${ruler.intelligence}/${ruler.charisma}`} />
            <StatRow label="继承人数量" value={ruler.heirs.length.toString()} />
            <StatRow label="状态" value={ruler.isAlive ? '在世' : '已驾崩'} />
          </div>
        </div>

        {/* 合法性与季节 */}
        <div className="game-panel">
          <h3 className="text-royal-300 font-display mb-3">⚖️ 合法性与环境</h3>
          <div className="space-y-2 text-sm">
            <StatRow label="合法性" value={`${Math.floor(legitimacy.value)}/100 (${legitLevel.name})`} />
            <StatRow label="当前季节" value={`${seasonInfo.icon} ${seasonInfo.name}季`} />
            <StatRow label="当前天气" value={`${weatherInfo.icon} ${weatherInfo.name}`} />
            <StatRow label="生态值" value={`${Math.floor(ecology.value)}/100 (${ecoLevel.name})`} />
            <StatRow label="荒漠化领地" value={ecology.degradedTerritories.length.toString()} />
            <StatRow label="文化值" value={`${Math.floor(culture.value)} (${cultLevel.name})`} />
            <StatRow label="文化影响半径" value={culture.influenceRange.toString()} />
          </div>
        </div>

        {/* 外交与军事 */}
        <div className="game-panel">
          <h3 className="text-royal-300 font-display mb-3">🤝 外交与军事</h3>
          <div className="space-y-2 text-sm">
            <StatRow label="现存帝国" value={dipSummary.aliveEmpires.toString()} />
            <StatRow label="盟友" value={dipSummary.allies.toString()} />
            <StatRow label="敌对" value={dipSummary.enemies.toString()} />
            <StatRow label="贸易次数" value={gameState.diplomacy.tradeHistory.length.toString()} />
            <StatRow label="总兵力" value={gameState.troops.reduce((s, t) => s + t.count, 0).toString()} />
            <StatRow label="活跃灾害" value={disasters.filter((d) => d.isActive).length.toString()} />
          </div>
        </div>

        {/* 探索与收集 */}
        <div className="game-panel">
          <h3 className="text-royal-300 font-display mb-3">📜 探索与收集</h3>
          <div className="space-y-2 text-sm">
            <StatRow label="编年史条目" value={chronicle.length.toString()} />
            <StatRow label="已占领领地" value={gameState.territories.filter((t) => t.owned).length.toString()} />
            <StatRow label="已建奇观" value={gameState.wonders.filter((w) => w.built).length.toString()} />
            <StatRow label="已收集遗物" value={gameState.relics.length.toString()} />
            <StatRow label="多元宇宙进度" value={`${multiverseProgress.completed}/${multiverseProgress.total}`} />
            <StatRow label="密码文献" value={`${cipherStats.decoded}/${cipherStats.total} 已破译`} />
            <StatRow label="时代印记" value={gameState.eraImprints.length.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ancient-400">{label}</span>
      <span className="text-ancient-100 font-mono">{value}</span>
    </div>
  );
}
