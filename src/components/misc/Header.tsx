import { Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/contexts/NotificationsContext";

type HeaderProps = {
  pageTitle: string;
  sidebarId?: string;
  notificationsPanelId?: string;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
};

export const Header = ({
  pageTitle,
  sidebarId,
  notificationsPanelId = "notifications-panel",
  onMenuClick,
  isSidebarOpen = false,
}: HeaderProps) => {
  const { logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, removeNotification } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationsPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (
        notificationsRef.current &&
        target instanceof Node &&
        !notificationsRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    notificationsPanelRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        notificationsButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex h-[92px] shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:left-64 lg:px-8"
      role="banner"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          aria-controls={sidebarId}
          aria-expanded={isSidebarOpen}
          aria-haspopup="menu"
        >
          <Menu className="h-6 w-6 text-[#4A5568]" aria-hidden="true" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold leading-tight text-[#4A5568] truncate">
            {pageTitle}
          </h1>
          <p className="mt-0.5 hidden text-xs text-[#475569] sm:block sm:text-sm">
            Supervision et pilotage des données de santé
          </p>
        </div>
      </div>

      <div
        ref={notificationsRef}
        className="relative flex items-center gap-2 shrink-0"
      >
        <Button
          ref={notificationsButtonRef}
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`${unreadCount} notifications non lues`}
          aria-controls={notificationsPanelId}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => {
            setOpen((prev) => !prev);
            if (!open) {
              markAllAsRead();
            }
          }}
        >
          <Bell className="h-6 w-6 text-[#4A5568]" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-[#92400E] p-0 text-white hover:bg-[#78350F]">
              {unreadCount}
            </Badge>
          )}
        </Button>
        {open && (
          <div
            id={notificationsPanelId}
            ref={notificationsPanelRef}
            className="absolute right-0 top-11 z-40 w-80 rounded-lg border bg-white shadow-lg"
            role="dialog"
            aria-label="Notifications"
            tabIndex={-1}
          >
            <ul
              className="max-h-80 overflow-y-auto"
              role="list"
              aria-label="Liste des notifications"
            >
              {notifications.length === 0 ? (
                <li className="p-3 text-sm text-[#475569]">
                  Aucune notification.
                </li>
              ) : (
                notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="flex items-start gap-3 p-3 border-b last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#4A5568]">
                        {notif.title}
                      </p>
                      <p className="mt-1 text-xs text-[#475569]">
                        {notif.message}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-[#4A5568] hover:bg-gray-100"
                      aria-label="Supprimer la notification"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeNotification(notif.id);
                      }}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#4A5568] hover:bg-gray-100"
          onClick={() => logout()}
          aria-label="Se déconnecter"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="ml-2 hidden sm:inline">Se déconnecter</span>
        </Button>
      </div>
    </header>
  );
};
