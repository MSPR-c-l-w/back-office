import {
  allUsers,
  UserDetailModal,
  UsersStatsCards,
  UsersTableCard,
} from "@/components/dashboard/users";
import { PageLayout } from "@/components/layout/PageLayout";
import { useRequireRole } from "@/hooks/useRequireRole";
import { getUsersSummary } from "@/utils/usersApi";
import type { UsersSummary } from "@/utils/usersApi";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

const UsersPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");

  const [usersSummary, setUsersSummary] = useState<UsersSummary | null>(null);
  const [usersSummaryLoading, setUsersSummaryLoading] = useState(true);
  const [usersSummaryError, setUsersSummaryError] = useState<string | null>(null);

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
          e instanceof Error ? e.message : "Impossible de charger les utilisateurs."
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
  const [selectedUser, setSelectedUser] =
    useState<Parameters<typeof UserDetailModal>[0]["user"]>(null);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
      return matchesSearch && matchesPlan;
    });
  }, [searchQuery, filterPlan]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = useMemo(
    () => filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredUsers, startIndex]
  );

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
        paginatedUsers={paginatedUsers}
        filteredCount={filteredUsers.length}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onSelectUser={setSelectedUser}
      />

      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

UsersPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Utilisateurs">{page}</PageLayout>;
};

export default UsersPage;
