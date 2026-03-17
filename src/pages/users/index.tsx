import { UsersTableCard } from "@/components/dashboard/users/UsersTableCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { useUsersList, type UsersPlanFilter } from "@/hooks/useUsersList";
import { useRequireRole } from "@/hooks/useRequireRole";
import { NextPageWithLayout } from "@/utils/types/globals";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { UsersStatsCards } from "@/components/dashboard/users/UsersStatsCards";
import { useUsersStats } from "@/hooks/useUsersStats";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const UsersPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");
  const router = useRouter();
  const page = Number(router.query.page) || DEFAULT_PAGE;
  const limit = Number(router.query.limit) || DEFAULT_LIMIT;

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useUsersStats();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<UsersPlanFilter | "all">("all");

  const { data, total, loading, error, refetch } = useUsersList({
    page,
    limit,
    search: searchQuery,
    plan: filterPlan === "all" ? undefined : filterPlan,
  });

  const listError =
    error === "Impossible de charger la liste des utilisateurs." ? null : error;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = total === 0 ? 0 : (page - 1) * limit;
  const filteredCount = total;

  const handlePageChange = (newPage: number) => {
    router.push(
      { pathname: "/users", query: { ...router.query, page: newPage, limit } },
      undefined,
      { shallow: true }
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    void router.push(
      { pathname: "/users", query: { ...router.query, page: 1, limit } },
      undefined,
      { shallow: true }
    );
  };

  const handleFilterPlanChange = (value: UsersPlanFilter | "all") => {
    setFilterPlan(value);
    void router.push(
      { pathname: "/users", query: { ...router.query, page: 1, limit } },
      undefined,
      { shallow: true }
    );
  };

  const handleSelectUser = (user: { id: number }) => {
    router.push(`/users/${user.id}`);
  };

  return (
    <div className="space-y-6">
      {statsError && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between"
          role="alert"
        >
          <span>{statsError}</span>
          <button
            type="button"
            onClick={refetchStats}
            className="text-[#4A90E2] hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}

      <div aria-live="polite">
        <UsersStatsCards
          totalUsers={stats?.totalUsers ?? 0}
          activeUsers={stats?.activeUsers ?? 0}
          premiumUsers={stats?.premiumUsers ?? 0}
          b2bUsers={stats?.b2bUsers ?? 0}
          loading={statsLoading}
        />
      </div>

      <UsersTableCard
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterPlan={filterPlan}
        onFilterPlanChange={handleFilterPlanChange}
        paginatedUsers={data}
        filteredCount={filteredCount}
        currentPage={page}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onSelectUser={handleSelectUser}
        loading={loading}
        error={listError}
        onRetry={refetch}
      />
    </div>
  );
};

UsersPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Utilisateurs">{page}</PageLayout>;
};

export default UsersPage;
