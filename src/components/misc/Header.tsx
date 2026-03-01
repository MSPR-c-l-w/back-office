import { Badge, Bell, LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";

type HeaderProps = {
  notifications_count: number;
  pageTitle: string;
  onMenuClick?: () => void;
};

export const Header = ({
  notifications_count,
  pageTitle,
  onMenuClick,
}: HeaderProps) => {
  const { logout } = useAuth();

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
        >
          <Menu className="h-6 w-6 text-[#4A5568]" aria-hidden="true" />
        </Button>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold leading-tight text-[#4A5568] truncate">
            {pageTitle}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-[#4A5568] opacity-70 hidden sm:block">
            Supervision et pilotage des données de santé
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`${notifications_count} notifications non lues`}
        >
          <Bell className="h-6 w-6 text-[#4A5568]" aria-hidden="true" />
          {notifications_count > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-[#FFB88C] p-0 hover:bg-[#FFB88C]">
              {notifications_count}
            </Badge>
          )}
        </Button>
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
