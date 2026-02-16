import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Database, BarChart3, Server, Bell, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const NAV_CONFIG = [
  { path: '/', label: 'Dashboard de Pilotage', icon: LayoutDashboard },
  { path: '/users', label: 'Gestion Utilisateurs', icon: UsersIcon },
  { path: '/data', label: 'Gestion & Nettoyage', icon: Database },
  { path: '/analytics', label: 'Analytics Business', icon: BarChart3 },
  { path: '/api-logs', label: 'API & Logs', icon: Server },
] as const;

const NOTIFICATIONS_COUNT = 3;

type BackOfficeLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export function BackOfficeLayout({ children, pageTitle }: BackOfficeLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFB]">
      {/* Sidebar */}
      <aside
        className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="px-6 h-[92px] border-b border-gray-200 flex flex-col justify-center">
          <h1 className="text-xl font-bold text-[#4A5568] leading-tight">HealthAI Coach</h1>
          <p className="text-sm text-[#4A5568] opacity-70 mt-1">Back-office Admin</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2" role="list">
            {NAV_CONFIG.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? router.pathname === '/'
                  : router.pathname === item.path || router.pathname.startsWith(item.path + '/');
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      'inline-flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90'
                        : 'text-[#4A5568] hover:bg-gray-100'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-[#4A90E2] text-white">DS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#4A5568]">Data Scientist</p>
              <p className="text-xs text-[#4A5568] opacity-70">Utilisateur connecté</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className="flex h-[92px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8"
          role="banner"
        >
          <div>
            <h2 className="text-2xl font-bold leading-tight text-[#4A5568]">{pageTitle}</h2>
            <p className="mt-1 text-sm text-[#4A5568] opacity-70">
              Supervision et pilotage des données de santé
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`${NOTIFICATIONS_COUNT} notifications non lues`}
          >
            <Bell className="h-6 w-6 text-[#4A5568]" aria-hidden="true" />
            {NOTIFICATIONS_COUNT > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-[#FFB88C] p-0 hover:bg-[#FFB88C]">
                {NOTIFICATIONS_COUNT}
              </Badge>
            )}
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-auto p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
