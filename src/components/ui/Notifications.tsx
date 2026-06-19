import { useUIStore } from '@/store/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

const NOTIFICATION_STYLES = {
  info: 'bg-knowledge-600/80 border-knowledge-400',
  success: 'bg-green-600/80 border-green-400',
  warning: 'bg-royal-600/80 border-royal-400',
  error: 'bg-war-600/80 border-war-400',
};

const NOTIFICATION_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export function Notifications() {
  const notifications = useUIStore((state) => state.notifications);
  const removeNotification = useUIStore((state) => state.removeNotification);

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => removeNotification(n.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`px-4 py-3 rounded-lg border backdrop-blur-md text-white shadow-lg max-w-xs ${NOTIFICATION_STYLES[notification.type]}`}
          >
            <div className="flex items-center gap-2">
              <span>{NOTIFICATION_ICONS[notification.type]}</span>
              <span className="text-sm">{notification.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
