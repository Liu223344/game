import { useUIStore } from '@/store/uiStore';
import { BuildingsPanel } from '@/components/panels/BuildingsPanel';
import { TroopsPanel } from '@/components/panels/TroopsPanel';
import { CombatPanel } from '@/components/panels/CombatPanel';
import { WorldMapPanel } from '@/components/panels/WorldMapPanel';
import { TechPanel } from '@/components/panels/TechPanel';
import { WondersPanel } from '@/components/panels/WondersPanel';
import { RebirthPanel } from '@/components/panels/RebirthPanel';
import { CodexPanel } from '@/components/panels/CodexPanel';
import { RulerPanel } from '@/components/panels/RulerPanel';
import { ChroniclePanel } from '@/components/panels/ChroniclePanel';
import { DiplomacyPanel } from '@/components/panels/DiplomacyPanel';
import { MultiversePanel } from '@/components/panels/MultiversePanel';
import { CipherPanel } from '@/components/panels/CipherPanel';
import { StatsPanel } from '@/components/panels/StatsPanel';
import { SettingsPanel } from '@/components/panels/SettingsPanel';
import { Notifications } from '@/components/ui/Notifications';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanelType } from '@/game/types';

const PANEL_COMPONENTS: Record<PanelType, React.ComponentType> = {
  buildings: BuildingsPanel,
  troops: TroopsPanel,
  combat: CombatPanel,
  worldmap: WorldMapPanel,
  tech: TechPanel,
  wonders: WondersPanel,
  ruler: RulerPanel,
  rebirth: RebirthPanel,
  codex: CodexPanel,
  chronicle: ChroniclePanel,
  diplomacy: DiplomacyPanel,
  multiverse: MultiversePanel,
  cipher: CipherPanel,
  stats: StatsPanel,
  settings: SettingsPanel,
};

export function MainContent() {
  const currentPanel = useUIStore((state) => state.currentPanel);
  const PanelComponent = PANEL_COMPONENTS[currentPanel];

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPanel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <PanelComponent />
        </motion.div>
      </AnimatePresence>
      <Notifications />
    </main>
  );
}
