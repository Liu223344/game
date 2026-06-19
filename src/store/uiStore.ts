import { create } from 'zustand';
import type { UIState, PanelType, Notification } from '@/game/types';

interface UIStoreActions {
  setPanel: (panel: PanelType) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
}

export const useUIStore = create<UIState & UIStoreActions>((set) => ({
  currentPanel: 'buildings',
  notifications: [],
  modals: [],

  setPanel: (panel) => set({ currentPanel: panel }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        },
      ].slice(-5), // 保留最近5条
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  openModal: (id, data) =>
    set((state) => ({
      modals: [...state.modals, { id, data }],
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    })),
}));
