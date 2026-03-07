import { PlanUpsertModal, PlansTableCard } from "@/components/dashboard/plans";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import type { Plan } from "@/utils/interfaces/plan";
import { deletePlan, listPlans } from "@/utils/plansApi";
import type { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

const PlansPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listPlans()
      .then((data) => {
        if (cancelled) return;
        setPlans(data);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setPlans([]);
        setError("Impossible de charger la liste des plans.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPlans = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return plans.filter((p) => p.name.toLowerCase().includes(q));
  }, [plans, searchQuery]);

  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlans = useMemo(
    () => filteredPlans.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredPlans, startIndex]
  );

  const openCreate = () => {
    setModalPlan(null);
    setModalOpen(true);
  };

  const openDetails = (plan: Plan) => {
    setModalPlan(plan);
    setModalOpen(true);
  };

  const handleSaved = (saved: Plan) => {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      if (!exists) return [saved, ...prev];
      return prev.map((p) => (p.id === saved.id ? saved : p));
    });
  };

  const handleDeleted = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const requestDeleteFromTable = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    setDeleteLoading(true);
    try {
      await deletePlan(planToDelete.id);
      setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      setDeleteConfirmOpen(false);
      setPlanToDelete(null);
    } catch {
      window.alert("Impossible de supprimer le plan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#4A5568]">
              Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#4A5568]">Chargement…</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#4A5568]">
              Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-[#FF887B]">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-[#4A90E2] border-[#4A90E2]"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <PlansTableCard
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            paginatedPlans={paginatedPlans}
            filteredCount={filteredPlans.length}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onCreatePlan={openCreate}
            onSelectPlan={openDetails}
            onDeletePlan={requestDeleteFromTable}
          />

          <PlanUpsertModal
            plan={modalPlan}
            open={modalOpen}
            onOpenChange={setModalOpen}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />

          <ConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={(open) => {
              setDeleteConfirmOpen(open);
              if (!open) setPlanToDelete(null);
            }}
            title="Supprimer le plan"
            description={
              planToDelete
                ? `Confirmer la suppression du plan “${planToDelete.name}” ?`
                : undefined
            }
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            confirmVariant="destructive"
            loading={deleteLoading}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  );
};

PlansPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Plans">{page}</PageLayout>;
};

export default PlansPage;

