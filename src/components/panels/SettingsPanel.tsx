// 放置帝国 - 设置面板
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { GAME_VERSION, AUTO_SAVE_INTERVAL } from '@/utils/constants';

const SAVE_KEY = 'idle-empire-save';
const SPEED_OPTIONS = [1, 2, 3, 5];

export function SettingsPanel() {
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const resetGame = useGameStore((state) => state.resetGame);
  const addNotification = useUIStore.getState().addNotification;

  const setGameSpeed = (speed: number) => {
    useGameStore.setState({ gameSpeed: speed });
    addNotification({ type: 'info', message: `游戏速度已设为 ${speed}x` });
  };

  const handleManualSave = () => {
    try {
      const state = useGameStore.getState();
      const saveData = JSON.stringify(state);
      localStorage.setItem(SAVE_KEY, saveData);
      localStorage.setItem(`${SAVE_KEY}-time`, String(Date.now()));
      addNotification({ type: 'success', message: '存档成功' });
    } catch {
      addNotification({ type: 'error', message: '存档失败' });
    }
  };

  const handleManualLoad = () => {
    if (!confirm('读取存档将覆盖当前进度，确定继续吗？')) return;
    try {
      const saveData = localStorage.getItem(SAVE_KEY);
      if (!saveData) {
        addNotification({ type: 'warning', message: '没有找到存档' });
        return;
      }
      const data = JSON.parse(saveData);
      useGameStore.getState().loadState(data);
      addNotification({ type: 'success', message: '读档成功' });
    } catch {
      addNotification({ type: 'error', message: '读档失败' });
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
      resetGame();
      localStorage.removeItem(SAVE_KEY);
      addNotification({ type: 'warning', message: '游戏已重置' });
    }
  };

  const handleExport = () => {
    const state = useGameStore.getState();
    const saveData = JSON.stringify(state);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idle-empire-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification({ type: 'success', message: '存档已导出' });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        useGameStore.getState().loadState(data);
        addNotification({ type: 'success', message: '存档已导入' });
      } catch {
        addNotification({ type: 'error', message: '存档导入失败' });
      }
    };
    reader.readAsText(file);
  };

  // 获取上次存档时间
  const lastSaveTime = localStorage.getItem(`${SAVE_KEY}-time`);
  const lastSaveText = lastSaveTime
    ? new Date(Number(lastSaveTime)).toLocaleString('zh-CN')
    : '从未存档';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-royal-300 mb-2">设置</h2>
        <p className="text-ancient-400 text-sm">游戏配置与存档管理</p>
      </div>

      {/* 游戏设置 */}
      <div className="game-panel">
        <h3 className="text-royal-300 font-display mb-3">游戏设置</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-ancient-200">游戏速度</span>
            <div className="flex gap-1">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    gameSpeed === speed
                      ? 'bg-royal-600 text-white'
                      : 'bg-ancient-800 text-ancient-300 hover:bg-ancient-700'
                  }`}
                  onClick={() => setGameSpeed(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ancient-200">存档版本</span>
            <span className="text-ancient-400 font-mono">v{GAME_VERSION}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ancient-200">自动存档间隔</span>
            <span className="text-ancient-400 font-mono">{AUTO_SAVE_INTERVAL / 1000}秒</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ancient-200">上次存档</span>
            <span className="text-ancient-400 font-mono text-xs">{lastSaveText}</span>
          </div>
        </div>
      </div>

      {/* 存档管理 */}
      <div className="game-panel">
        <h3 className="text-royal-300 font-display mb-3">存档管理</h3>
        <div className="flex flex-wrap gap-3">
          <button className="game-button" onClick={handleManualSave}>
            💾 立即存档
          </button>
          <button className="game-button" onClick={handleManualLoad}>
            📂 读取存档
          </button>
          <button className="game-button" onClick={handleExport}>
            📥 导出存档
          </button>
          <label className="game-button cursor-pointer">
            📤 导入存档
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button className="game-button game-button-danger" onClick={handleReset}>
            🗑️ 重置游戏
          </button>
        </div>
        <p className="text-ancient-400 text-xs mt-3">
          游戏每 {AUTO_SAVE_INTERVAL / 1000} 秒自动存档到本地，也可手动存档。导出存档可备份或迁移。
        </p>
      </div>

      {/* 关于 */}
      <div className="game-panel">
        <h3 className="text-royal-300 font-display mb-3">关于</h3>
        <p className="text-ancient-300 text-sm">
          放置帝国 - 一款融合28+差异化特色的放置类游戏
        </p>
        <p className="text-ancient-400 text-xs mt-2">
          灵感来自梅尔沃放置，但全面创新。从远古到未来，建立你的永恒帝国。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ancient-400">
          <div>👑 王朝继承系统</div>
          <div>⚖️ 天命合法性</div>
          <div>📜 帝国编年史</div>
          <div>🌱 季节天气</div>
          <div>🤝 外交AI帝国</div>
          <div>🎨 文化影响力</div>
          <div>🌲 生态平衡</div>
          <div>🌋 灾害链式</div>
          <div>🌌 多元宇宙</div>
          <div>🔐 语言破译</div>
        </div>
      </div>
    </div>
  );
}
