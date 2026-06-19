// 放置帝国 - 季节天气系统
import { useGameStore } from '@/store/gameStore';
import { SEASON_INFO, WEATHER_INFO } from '@/utils/constants';
import type { Season, WeatherType, ResourceType, GameState } from '@/game/types';

// 季节对特定资源的产出倍数
export function getSeasonMultiplier(season: Season, resource: ResourceType): number {
  if (season === 'spring') {
    if (resource === 'food') return 1.3;
    if (resource === 'wood') return 1.2;
    return 1.0;
  }
  if (season === 'summer') {
    if (resource === 'stone') return 1.2;
    return 1.0;
  }
  if (season === 'autumn') {
    if (resource === 'gold') return 1.2;
    if (resource === 'knowledge') return 1.1;
    return 1.0;
  }
  // winter
  return 0.8;
}

// 天气对资源的影响
export function getWeatherMultiplier(weather: WeatherType, resource: ResourceType): number {
  if (weather === 'sunny') return 1.0;
  if (weather === 'rainstorm') {
    if (resource === 'food') return 0.9;
    return 1.0;
  }
  if (weather === 'drought') {
    if (resource === 'food') return 0.7;
    return 1.0;
  }
  if (weather === 'blizzard') return 0.7;
  // aurora
  if (resource === 'knowledge') return 1.5;
  return 1.0;
}

// 天气对战斗防守的加成
export function getWeatherCombatBonus(weather: WeatherType): number {
  if (weather === 'blizzard') return 1.2;
  return 1.0;
}

// 更新季节（每tick调用）
export function updateSeason(deltaSeconds: number): void {
  const days = Math.floor(deltaSeconds);
  if (days > 0) {
    useGameStore.getState().advanceSeason(days);
  }
}

// 获取季节天气显示信息
export function getSeasonWeatherInfo(state: GameState): {
  seasonName: string;
  seasonIcon: string;
  weatherName: string;
  weatherIcon: string;
} {
  const seasonInfo = SEASON_INFO[state.season.current];
  const weatherInfo = WEATHER_INFO[state.season.weather];
  return {
    seasonName: seasonInfo.name,
    seasonIcon: seasonInfo.icon,
    weatherName: weatherInfo.name,
    weatherIcon: weatherInfo.icon,
  };
}

// 获取综合产出倍数（季节 × 天气）
export function getCombinedWeatherMultiplier(state: GameState, resource: ResourceType): number {
  const seasonMult = getSeasonMultiplier(state.season.current, resource);
  const weatherMult = getWeatherMultiplier(state.season.weather, resource);
  return seasonMult * weatherMult;
}
