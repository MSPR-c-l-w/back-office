"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppNotification = {
  id: string;
  type: "error" | "warning" | "success" | "info";
  title: string;
  message: string;
  createdAt: string;
  source: "etl" | "dashboard" | "system";
  read?: boolean;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  pushNotification: (notification: AppNotification) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [announcement, setAnnouncement] = useState("");

  const pushNotification = useCallback((notification: AppNotification) => {
    setNotifications((prev) => {
      const existing = prev.some((item) => item.id === notification.id);
      if (existing) {
        return prev;
      }
      setAnnouncement(`${notification.title}. ${notification.message}`);
      const next = [notification, ...prev];
      return next.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    pushNotification,
    markAllAsRead,
    removeNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return ctx;
}
