import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-1
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'gold' | 'blue' | 'red' | 'green' | 'purple';
  height?: 'sm' | 'md' | 'lg';
}

const COLOR_CLASSES = {
  gold: 'from-royal-500 to-royal-300',
  blue: 'from-knowledge-500 to-knowledge-300',
  red: 'from-war-500 to-war-300',
  green: 'from-green-500 to-green-300',
  purple: 'from-purple-500 to-purple-300',
};

const HEIGHT_CLASSES = {
  sm: 'h-1.5',
  md: 'h-3',
  lg: 'h-5',
};

export function ProgressBar({
  value,
  max = 1,
  label,
  showPercent = false,
  color = 'gold',
  height = 'md',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between mb-1 text-xs text-ancient-300">
          {label && <span>{label}</span>}
          {showPercent && <span>{percent.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full ${HEIGHT_CLASSES[height]} bg-ancient-900/60 rounded-full overflow-hidden border border-ancient-700/40`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${COLOR_CLASSES[color]} progress-bar-fill rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
