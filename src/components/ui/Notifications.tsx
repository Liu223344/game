import { useUIStore } from '@/store/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Notification } from '@/game/types';

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

// 单条通知：独立管理自己的定时器，避免新增通知时重置其他通知的倒计时
function NotificationItem({ notification }: { notification: Notification }) {
  const removeNotification = useUIStore((state) => state.removeNotification);

  useEffect(() => {
    const timer = setTimeout(() => removeNotification(notification.id), 4000);
    return () => clearTimeout(timer);
  }, [notification.id, removeNotification]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`px-4 py-3 rounded-lg border backdrop-blur-md text-white shadow-lg max-w-xs pointer-events-auto ${NOTIFICATION_STYLES[notification.type]}`}
    >
      <div className="flex items-center gap-2">
        <span>{NOTIFICATION_ICONS[notification.type]}</span>
        <span className="text-sm">{notification.message}</span>
        <button
          className="ml-auto text-white/60 hover:text-white text-xs"
          onClick={() => removeNotification(notification.id)}
          aria-label="关闭通知"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

export function Notifications() {
  const notifications = useUIStore((state) => state.notifications);

  return (
    <div
      className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}
