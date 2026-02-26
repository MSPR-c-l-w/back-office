import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Routes } from "@/utils/types/globals";
import { useAuth } from "@/hooks/useAuth";

type SidebarProps = {
    routes: Routes[]
}

export const Sidebar = ({ routes }: SidebarProps) => {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    if (loading) return <p>Chargement...</p>;

    return (
        <aside
        className="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="px-6 h-[92px] border-b border-gray-200 flex flex-col justify-center">
          <h1 className="text-xl font-bold text-[#4A5568] leading-tight">HealthAI Coach</h1>
          <p className="text-sm text-[#4A5568] opacity-70 mt-1">Back-office Admin</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2" role="list">
            {routes.map((item) => {
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
              <p className="text-sm font-medium text-[#4A5568]">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-[#4A5568] opacity-70">{user?.role?.name}</p>
            </div>
          </div>
        </div>
      </aside>
    )
}