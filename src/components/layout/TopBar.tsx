import { useGameStore } from '@/store/gameStore';
import { RESOURCE_INFO, SEASON_INFO, WEATHER_INFO } from '@/utils/constants';
import { formatNumber } from '@/utils/format';
import { getLegitimacyLevel } from '@/game/systems/legitimacySystem';
import type { ResourceType } from '@/game/types';
import { motion } from 'framer-motion';

const DISPLAY_RESOURCES: ResourceType[] = ['food', 'wood', 'stone', 'metal', 'gold', 'knowledge', 'population'];

export function TopBar() {
  const resources = useGameStore((state) => state.resources);
  const banner = useGameStore((state) => state.banner);
  const legitimacy = useGameStore((state) => state.legitimacy);
  const season = useGameStore((state) => state.season);
  const gameState = useGameStore.getState();
  const legitLevel = getLegitimacyLevel(gameState);
  const seasonInfo = SEASON_INFO[season.current];
  const weatherInfo = WEATHER_INFO[season.weather];

  return (
    <header className="h-16 bg-ancient-900/90 backdrop-blur-md border-b border-ancient-600/40 flex items-center px-4 gap-2 overflow-x-auto">
      {/* 帝国旗帜 */}
      <div className="flex items-center gap-2 mr-4 pr-4 border-r border-ancient-600/40">
        <div
          className="w-10 h-12 rounded-sm shadow-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: banner.bgColor }}
        >
          {banner.pattern === 'eagle' ? '🦅' : banner.pattern === 'dragon' ? '🐉' : '🦁'}
        </div>
        <div className="hidden md:block">
          <div className="text-royal-300 font-display text-sm font-semibold">放置帝国</div>
          <div className="text-ancient-400 text-xs">永恒的统治者</div>
        </div>
      </div>

      {/* 资源显示 */}
      <div className="flex items-center gap-2 flex-1">
        {DISPLAY_RESOURCES.map((resType) => {
          const info = RESOURCE_INFO[resType];
          const value = resources[resType];
          return (
            <motion.div
              key={resType}
              className="resource-badge whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              title={info.name}
            >
              <span className="text-lg">{info.icon}</span>
              <span className={`font-mono text-sm ${info.color}`}>{formatNumber(value)}</span>
            </motion.div>
          );
        })}
      </div>

      {/* 合法性 */}
      <div className="flex items-center gap-1 px-2 border-l border-ancient-600/40" title={`合法性：${legitLevel.name}`}>
        <span className="text-lg">⚖️</span>
        <div className="hidden md:block">
          <div className={`text-xs font-medium ${legitLevel.color}`}>{legitLevel.name}</div>
          <div className="text-xs text-ancient-400">{Math.floor(legitimacy.value)}/100</div>
        </div>
      </div>

      {/* 季节天气 */}
      <div className="flex items-center gap-1 px-2 border-l border-ancient-600/40" title={`${seasonInfo.name}季 · ${weatherInfo.name}`}>
        <span className="text-lg">{seasonInfo.icon}</span>
        <span className="text-lg">{weatherInfo.icon}</span>
        <div className="hidden md:block">
          <div className={`text-xs font-medium ${seasonInfo.color}`}>{seasonInfo.name}季</div>
          <div className="text-xs text-ancient-400">{weatherInfo.name}</div>
        </div>
      </div>
    </header>
  );
}
