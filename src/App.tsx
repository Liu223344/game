import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { EraTransition } from '@/components/visual/EraTransition';
import { useGameLoop, loadGame, calculateOfflineProgress } from '@/hooks/useGameLoop';
import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';
import { formatTime } from '@/utils/format';
import { RESOURCE_INFO } from '@/utils/constants';
import type { ResourceState } from '@/game/types';

function App() {
  useGameLoop();
  const addNotification = useUIStore((state) => state.addNotification);

  // 初始化：加载存档和离线收益
  useEffect(() => {
    const loaded = loadGame();
    if (loaded) {
      const offline = calculateOfflineProgress();
      if (offline && Object.keys(offline.resources).length > 0) {
        // 应用离线收益
        const state = useGameStore.getState();
        const newResources = { ...state.resources };
        for (const [res, amount] of Object.entries(offline.resources)) {
          if (amount && amount > 0) {
            newResources[res as keyof ResourceState] += amount;
          }
        }
        useGameStore.setState({ resources: newResources });

        // 通知玩家
        const gains = Object.entries(offline.resources)
          .filter(([, amount]) => amount && amount > 0)
          .map(([res, amount]) => `${RESOURCE_INFO[res as keyof typeof RESOURCE_INFO]?.icon}+${Math.floor(amount as number)}`)
          .join(' ');
        addNotification({
          type: 'success',
          message: `离线 ${formatTime(offline.duration)}，获得: ${gains}`,
        });
      }
    }
  }, [addNotification]);

  // 页面关闭时保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const state = useGameStore.getState();
        localStorage.setItem('idle-empire-save', JSON.stringify({ ...state, lastSave: Date.now() }));
      } catch (e) {
        console.error('关闭存档失败:', e);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="h-dvh flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <EraTransition />
    </div>
  );
}

export default App;
