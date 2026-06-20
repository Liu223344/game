import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BUILDINGS, getBuildingProduction } from '@/game/data/buildings';
import { TICK_INTERVAL, AUTO_SAVE_INTERVAL } from '@/utils/constants';
import { updateTroopProduction } from '@/game/systems/troopSystem';
import { updateResearch } from '@/game/systems/techSystem';
import { updateWonderConstruction } from '@/game/systems/wonderSystem';
import { triggerRandomEvent, checkFestivalEvents } from '@/game/systems/eventSystem';
import { processAutomation } from '@/game/systems/automationSystem';
import { updateRulerAge, processRulerDeath, tryGenerateHeir, getRulerProductionMultiplier } from '@/game/systems/dynastySystem';
import { updateLegitimacy, checkLegitimacyEvents, getLegitimacyMultiplier } from '@/game/systems/legitimacySystem';
import { updateSeason, getCombinedWeatherMultiplier } from '@/game/systems/seasonSystem';
import { updateCulture, checkCultureAnnexation } from '@/game/systems/cultureSystem';
import { updateEcology, getEcologyFoodMultiplier } from '@/game/systems/ecologySystem';
import { processAIEmpireActions, initializeDiplomacy } from '@/game/systems/diplomacySystem';
import { checkRandomDisaster, updateDisasters } from '@/game/systems/disasterSystem';
import { updateMultiverseExploration } from '@/game/systems/multiverseSystem';
import type { BuildingType, ResourceState } from '@/game/types';

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const lastTickRef = useRef(Date.now());
  const lastSaveRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      const state = useGameStore.getState();
      const gameSpeed = state.gameSpeed;
      const effectiveDelta = deltaSeconds * gameSpeed;

      // 资源产出（应用合法性、季节、天气、统治者、生态加成）
      const resourceGains: Partial<Record<keyof ResourceState, number>> = {};
      const legitMult = getLegitimacyMultiplier(state);
      const rulerMult = getRulerProductionMultiplier(state);
      const ecoFoodMult = getEcologyFoodMultiplier(state);
      Object.entries(state.buildings).forEach(([type, buildingState]) => {
        if (!buildingState.isActive || buildingState.level === 0) return;
        const building = BUILDINGS[type as BuildingType];
        if (!building.produces) return;
        const production = getBuildingProduction(building, buildingState.level);
        const seasonWeatherMult = getCombinedWeatherMultiplier(state, building.produces);
        // 食物额外应用生态加成
        const ecoMult = building.produces === 'food' ? ecoFoodMult : 1.0;
        resourceGains[building.produces] =
          (resourceGains[building.produces] || 0) +
          production * effectiveDelta * legitMult * rulerMult * seasonWeatherMult * ecoMult;
      });

      // 应用资源产出
      if (Object.keys(resourceGains).length > 0) {
        const newResources = { ...state.resources };
        for (const [res, amount] of Object.entries(resourceGains)) {
          newResources[res as keyof ResourceState] += amount as number;
        }
        useGameStore.setState({ resources: newResources });
      }

      // 更新兵种生产
      updateTroopProduction(effectiveDelta);

      // 更新科技研究
      updateResearch(effectiveDelta);

      // 更新奇观建造
      updateWonderConstruction(effectiveDelta);

      // 处理AI自动化
      processAutomation(effectiveDelta);

      // 王朝继承系统：更新统治者年龄
      updateRulerAge(effectiveDelta);
      // 检查统治者死亡
      processRulerDeath();
      // 尝试生成继承人（每5年）
      tryGenerateHeir();

      // 合法性系统：自然恢复与事件检查
      updateLegitimacy(effectiveDelta);
      checkLegitimacyEvents(useGameStore.getState());

      // 季节天气系统：推进时间
      updateSeason(effectiveDelta);

      // 文化影响力系统：累积文化值，检查归附
      updateCulture(effectiveDelta);
      checkCultureAnnexation(useGameStore.getState());

      // 生态系统：更新生态值，检查事件
      updateEcology(effectiveDelta);

      // 外交系统：初始化AI帝国（首次），处理AI行动
      if (state.diplomacy.empires.length === 0 && state.playTime > 60) {
        initializeDiplomacy();
      }
      processAIEmpireActions(effectiveDelta);

      // 灾害系统：随机触发与更新
      checkRandomDisaster(effectiveDelta);
      updateDisasters(effectiveDelta);

      // 多元宇宙系统：探索进度更新
      updateMultiverseExploration(effectiveDelta);

      // 随机事件触发（每10秒检查一次）
      if (Math.floor(state.playTime) % 10 === 0) {
        triggerRandomEvent();
        checkFestivalEvents();
      }

      // 更新游戏时间
      tick(effectiveDelta);

      // 自动存档
      if (now - lastSaveRef.current >= AUTO_SAVE_INTERVAL) {
        lastSaveRef.current = now;
        saveGame();
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tick]);
}

// 存档
export function saveGame() {
  try {
    const state = useGameStore.getState();
    const saveData = {
      ...state,
      lastSave: Date.now(),
    };
    localStorage.setItem('idle-empire-save', JSON.stringify(saveData));
  } catch (e) {
    console.error('存档失败:', e);
  }
}

// 读档
export function loadGame(): boolean {
  const saveStr = localStorage.getItem('idle-empire-save');
  if (!saveStr) return false;
  try {
    const data = JSON.parse(saveStr);
    useGameStore.getState().loadState(data);
    return true;
  } catch {
    return false;
  }
}

// 计算离线收益
export function calculateOfflineProgress(): { resources: Partial<ResourceState>; duration: number } | null {
  const state = useGameStore.getState();
  const now = Date.now();
  const lastSave = state.lastSave;
  const offlineSeconds = Math.min((now - lastSave) / 1000, 24 * 3600); // 最多24小时

  if (offlineSeconds < 60) return null; // 不足1分钟不计

  const resourceGains: Partial<Record<keyof ResourceState, number>> = {};
  Object.entries(state.buildings).forEach(([type, buildingState]) => {
    if (!buildingState.isActive || buildingState.level === 0) return;
    const building = BUILDINGS[type as BuildingType];
    if (!building.produces) return;
    const production = getBuildingProduction(building, buildingState.level);
    // 离线效率50%
    resourceGains[building.produces] = (resourceGains[building.produces] || 0) + production * offlineSeconds * 0.5;
  });

  return { resources: resourceGains as Partial<ResourceState>, duration: offlineSeconds };
}
