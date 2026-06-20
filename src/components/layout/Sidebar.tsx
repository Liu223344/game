import { useUIStore } from '@/store/uiStore';
import { PANEL_INFO } from '@/utils/constants';
import type { PanelType } from '@/game/types';
import { motion } from 'framer-motion';

const PANELS: PanelType[] = [
  'buildings',
  'troops',
  'combat',
  'worldmap',
  'tech',
  'wonders',
  'ruler',
  'rebirth',
  'codex',
  'chronicle',
  'diplomacy',
  'multiverse',
  'cipher',
  'stats',
  'settings',
];

export function Sidebar() {
  const currentPanel = useUIStore((state) => state.currentPanel);
  const setPanel = useUIStore((state) => state.setPanel);

  return (
    <aside className="w-20 md:w-56 bg-ancient-900/80 backdrop-blur-md border-r border-ancient-600/40 flex flex-col py-4 overflow-y-auto">
      <nav className="flex flex-col gap-1 px-2" role="navigation" aria-label="主导航">
        {PANELS.map((panel) => {
          const info = PANEL_INFO[panel];
          const isActive = currentPanel === panel;
          return (
            <motion.button
              key={panel}
              type="button"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-item w-full text-left ${isActive ? 'nav-item-active' : ''}`}
              onClick={() => setPanel(panel)}
              aria-label={info.name}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl">{info.icon}</span>
              <span className="hidden md:inline font-medium">{info.name}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}
