import { UsersTableCard } from "@/components/dashboard/users/UsersTableCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { useUsersList } from "@/hooks/useUsersList";
import { useRequireRole } from "@/hooks/useRequireRole";
import { getUsersSummary } from "@/utils/usersApi";
import type { UsersSummary } from "@/utils/usersApi";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const UsersPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");
  const router = useRouter();
  const page = Number(router.query.page) || DEFAULT_PAGE;
  const limit = Number(router.query.limit) || DEFAULT_LIMIT;

  const { data, total, loading, error, refetch } = useUsersList({
    page,
    limit,
  });

  const [usersSummary, setUsersSummary] = useState<UsersSummary | null>(null);
  const [usersSummaryLoading, setUsersSummaryLoading] = useState(true);
  const [usersSummaryError, setUsersSummaryError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    getUsersSummary()
      .then((summary) => {
        if (cancelled) return;
        setUsersSummary(summary);
        setUsersSummaryError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setUsersSummary(null);
        setUsersSummaryError(
          e instanceof Error
            ? e.message
            : "Impossible de charger les utilisateurs."
        );
      })
      .finally(() => {
        if (cancelled) return;
        setUsersSummaryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");

  const filteredRows = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
      return matchesSearch && matchesPlan;
    });
  }, [data, searchQuery, filterPlan]);

  const hasActiveFilter = searchQuery.trim() !== "" || filterPlan !== "all";
  const totalPages = hasActiveFilter
    ? 1
    : Math.max(1, Math.ceil(total / limit));
  const startIndex = total === 0 ? 0 : hasActiveFilter ? 0 : (page - 1) * limit;
  const filteredCount = hasActiveFilter ? filteredRows.length : total;

  const handlePageChange = (newPage: number) => {
    router.push(
      { pathname: "/users", query: { ...router.query, page: newPage, limit } },
      undefined,
      { shallow: true }
    );
  };

  const handleSelectUser = (user: { id: number }) => {
    router.push(`/users/${user.id}`);
  };

  return (
    <div className="space-y-6">
      <UsersStatsCards
        summary={usersSummary}
        loading={usersSummaryLoading}
        error={usersSummaryError}
        allUsersForExtras={allUsers}
      />

      <UsersTableCard
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterPlan={filterPlan}
        onFilterPlanChange={setFilterPlan}
        paginatedUsers={filteredRows}
        filteredCount={filteredCount}
        currentPage={hasActiveFilter ? 1 : page}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onSelectUser={handleSelectUser}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
};

UsersPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Utilisateurs">{page}</PageLayout>;
};

export default UsersPage;
