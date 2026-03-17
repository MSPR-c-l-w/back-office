import {
  NutritionTableCard,
  NutritionUpsertModal,
} from "@/components/dashboard/nutrition";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import type { Nutrition } from "@/utils/interfaces/nutrition";
import { deleteNutrition, listAllNutritions } from "@/utils/nutritionApi";
import type { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

const NutritionPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");

  const [nutritions, setNutritions] = useState<Nutrition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMealType, setFilterMealType] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalNutrition, setModalNutrition] = useState<Nutrition | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [nutritionToDelete, setNutritionToDelete] = useState<Nutrition | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listAllNutritions()
      .then((data) => {
        if (cancelled) return;
        setNutritions(data);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setNutritions([]);
        setError("Impossible de charger la liste des nutriments.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    nutritions.forEach((n) => n.category && set.add(n.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [nutritions]);

  const mealTypeOptions = useMemo(() => {
    const set = new Set<string>();
    nutritions.forEach((n) => n.meal_type_name && set.add(n.meal_type_name));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [nutritions]);

  const filteredNutritions = useMemo(() => {
    let result = nutritions;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.meal_type_name.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== "all") {
      result = result.filter((n) => n.category === filterCategory);
    }
    if (filterMealType !== "all") {
      result = result.filter((n) => n.meal_type_name === filterMealType);
    }
    return result;
  }, [nutritions, searchQuery, filterCategory, filterMealType]);

  const totalCount = filteredNutritions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNutritions = useMemo(
    () => filteredNutritions.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredNutritions, startIndex]
  );

  const openDetails = (nutrition: Nutrition) => {
    setModalNutrition(nutrition);
    setModalOpen(true);
  };

  const handleSaved = (saved: Nutrition) => {
    setNutritions((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
  };

  const handleDeleted = (id: number) => {
    setNutritions((prev) => prev.filter((n) => n.id !== id));
  };

  const requestDeleteFromTable = (nutrition: Nutrition) => {
    setNutritionToDelete(nutrition);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!nutritionToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteNutrition(nutritionToDelete.id);
      setNutritions((prev) =>
        prev.filter((n) => n.id !== nutritionToDelete.id)
      );
      setDeleteConfirmOpen(false);
      setNutritionToDelete(null);
    } catch {
      window.alert("Impossible de supprimer le nutriment.");
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
              Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#4A5568]">Chargement…</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#4A5568]">
              Nutrition
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
          <NutritionTableCard
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterCategoryChange={setFilterCategory}
            categoryOptions={categoryOptions}
            filterMealType={filterMealType}
            onFilterMealTypeChange={setFilterMealType}
            mealTypeOptions={mealTypeOptions}
            paginatedNutritions={paginatedNutritions}
            filteredCount={totalCount}
            hasAnyNutrition={nutritions.length > 0}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onSelectNutrition={openDetails}
            onDeleteNutrition={requestDeleteFromTable}
          />

          <NutritionUpsertModal
            nutrition={modalNutrition}
            open={modalOpen}
            onOpenChange={setModalOpen}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />

          <ConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={(open) => {
              setDeleteConfirmOpen(open);
              if (!open) setNutritionToDelete(null);
            }}
            title="Supprimer le nutriment"
            description={
              nutritionToDelete
                ? `Confirmer la suppression de “${nutritionToDelete.name}” ?`
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

NutritionPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Nutrition">{page}</PageLayout>;
};

export default NutritionPage;
