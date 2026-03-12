import {
  ExerciseUpsertModal,
  ExercisesTableCard,
} from "@/components/dashboard/exercises";
import { PageLayout } from "@/components/layout/PageLayout";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  deleteExercise,
  getExercise,
  listExercises,
  searchExercises,
} from "@/utils/exercisesApi";
import type { Exercise } from "@/utils/interfaces/exercise";
import type { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;
const SCAN_PAGE_SIZE = 50;
const SCAN_MAX_PAGES = 200;

const ExercisesPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");

  const [items, setItems] = useState<Exercise[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [banner, setBanner] = useState<{
    kind: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    muscle: "",
    level: "",
    equipment: "",
    category: "",
  });

  const [knownMuscles, setKnownMuscles] = useState<string[]>([]);
  const [knownLevels, setKnownLevels] = useState<string[]>([]);
  const [knownEquipments, setKnownEquipments] = useState<string[]>([]);
  const [knownCategories, setKnownCategories] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);

    const load = async () => {
      try {
        const nameTerm = filters.name.trim().toLowerCase();
        const hasServerFilters =
          filters.muscle.trim() ||
          filters.level.trim() ||
          filters.equipment.trim() ||
          filters.category.trim();

        const fetchPage = async (page: number, limit: number) => {
          return hasServerFilters
            ? await searchExercises({
                muscle: filters.muscle.trim() || undefined,
                level: filters.level.trim() || undefined,
                equipment: filters.equipment.trim() || undefined,
                category: filters.category.trim() || undefined,
                page,
                limit,
              })
            : await listExercises({ page, limit });
        };

        // Filtre "Nom": scan global côté front (le backend ne supporte pas name).
        if (nameTerm.length > 0) {
          const sliceStart = (currentPage - 1) * ITEMS_PER_PAGE;
          const sliceEnd = currentPage * ITEMS_PER_PAGE;

          const pageItems: Exercise[] = [];
          let matchesCount = 0;

          const musclesSet = new Set<string>();
          const levelsSet = new Set<string>();
          const equipmentsSet = new Set<string>();
          const categoriesSet = new Set<string>();

          let backendPage = 1;
          let hasNext = true;

          while (hasNext && backendPage <= SCAN_MAX_PAGES && !cancelled) {
            const res = await fetchPage(backendPage, SCAN_PAGE_SIZE);

            for (const ex of res.items) {
              for (const m of ex.primary_muscles ?? []) musclesSet.add(m);
              for (const m of ex.secondary_muscles ?? []) musclesSet.add(m);
              if (ex.level) levelsSet.add(ex.level);
              if (ex.equipment) equipmentsSet.add(ex.equipment);
              if (ex.category) categoriesSet.add(ex.category);

              if ((ex.name ?? "").toLowerCase().includes(nameTerm)) {
                const idx = matchesCount;
                if (idx >= sliceStart && idx < sliceEnd) pageItems.push(ex);
                matchesCount += 1;
              }
            }

            hasNext = res.items.length === SCAN_PAGE_SIZE;
            backendPage += 1;
          }

          if (cancelled) return;

          setItems(pageItems);
          setTotalCount(matchesCount);
          setTotalPages(
            matchesCount > 0 ? Math.ceil(matchesCount / ITEMS_PER_PAGE) : 0
          );

          setKnownMuscles((prev) => {
            const next = new Set(prev);
            for (const m of musclesSet) next.add(m);
            return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
          });
          setKnownLevels((prev) => {
            const next = new Set(prev);
            for (const v of levelsSet) next.add(v);
            return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
          });
          setKnownEquipments((prev) => {
            const next = new Set(prev);
            for (const v of equipmentsSet) next.add(v);
            return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
          });
          setKnownCategories((prev) => {
            const next = new Set(prev);
            for (const v of categoriesSet) next.add(v);
            return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
          });

          return;
        }

        const res = await fetchPage(currentPage, ITEMS_PER_PAGE);
        if (cancelled) return;

        setItems(res.items);

        if (res.meta.total >= 0) {
          setTotalPages(res.meta.totalPages);
          setTotalCount(res.meta.total);
        } else {
          // Si le backend ne fournit pas de total fiable, on calcule le total via un scan paginé.
          let total = 0;
          let backendPage = 1;
          let hasNext = true;

          while (hasNext && backendPage <= SCAN_MAX_PAGES && !cancelled) {
            const pageRes = await fetchPage(backendPage, SCAN_PAGE_SIZE);
            total += pageRes.items.length;
            hasNext = pageRes.items.length === SCAN_PAGE_SIZE;
            backendPage += 1;
          }

          if (cancelled) return;

          setTotalCount(hasNext ? -1 : total);
          setTotalPages(
            hasNext
              ? Math.max(res.meta.totalPages, currentPage + 1)
              : Math.ceil(total / ITEMS_PER_PAGE)
          );
        }

        setKnownMuscles((prev) => {
          const next = new Set(prev);
          for (const ex of res.items) {
            for (const m of ex.primary_muscles ?? []) next.add(m);
            for (const m of ex.secondary_muscles ?? []) next.add(m);
          }
          return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
        });
        setKnownLevels((prev) => {
          const next = new Set(prev);
          for (const ex of res.items) if (ex.level) next.add(ex.level);
          return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
        });
        setKnownEquipments((prev) => {
          const next = new Set(prev);
          for (const ex of res.items) if (ex.equipment) next.add(ex.equipment);
          return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
        });
        setKnownCategories((prev) => {
          const next = new Set(prev);
          for (const ex of res.items) if (ex.category) next.add(ex.category);
          return Array.from(next).sort((a, b) => a.localeCompare(b, "fr"));
        });
      } catch {
        if (cancelled) return;
        setItems([]);
        setTotalPages(0);
        setTotalCount(0);
        setBanner({
          kind: "error",
          text: "Impossible de charger les exercices.",
        });
      } finally {
        if (cancelled) return;
        setIsFetching(false);
        setInitialLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, filters]);

  const openDetails = async (exercise: Exercise) => {
    setModalExercise(exercise);
    setModalOpen(true);
    try {
      const full = await getExercise(exercise.id);
      setModalExercise(full);
    } catch {
      setBanner({
        kind: "error",
        text: "Impossible de charger le détail de l’exercice.",
      });
    }
  };

  const handleSaved = (saved: Exercise) => {
    setItems((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
  };

  const handleDeleted = (id: number) => {
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  const requestDeleteFromTable = (exercise: Exercise) => {
    setExerciseToDelete(exercise);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!exerciseToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteExercise(exerciseToDelete.id);
      setItems((prev) => prev.filter((e) => e.id !== exerciseToDelete.id));
      setDeleteConfirmOpen(false);
      setExerciseToDelete(null);
      setBanner({ kind: "success", text: "Exercice supprimé." });
    } catch {
      setBanner({ kind: "error", text: "Impossible de supprimer l’exercice." });
    } finally {
      setDeleteLoading(false);
    }
  };

  const tableFilteredCount = useMemo(() => totalCount, [totalCount]);

  return (
    <div className="space-y-6">
      <>
        <ExercisesTableCard
          filters={filters}
          onFiltersChange={setFilters}
          options={{
            muscles: knownMuscles,
            levels: knownLevels,
            equipments: knownEquipments,
            categories: knownCategories,
          }}
          items={items}
          filteredCount={tableFilteredCount}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onSelectExercise={openDetails}
          onDeleteExercise={requestDeleteFromTable}
          banner={
            initialLoading && !banner
              ? { kind: "info", text: "Chargement…" }
              : banner
          }
          onDismissBanner={() => setBanner(null)}
          isFetching={isFetching}
        />

        <ExerciseUpsertModal
          exercise={modalExercise}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />

        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={(open: boolean) => {
            setDeleteConfirmOpen(open);
            if (!open) setExerciseToDelete(null);
          }}
          title="Supprimer l’exercice"
          description={
            exerciseToDelete
              ? `Confirmer la suppression de “${exerciseToDelete.name}” ?`
              : undefined
          }
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          confirmVariant="destructive"
          loading={deleteLoading}
          onConfirm={confirmDelete}
        />
      </>
    </div>
  );
};

ExercisesPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Exercices">{page}</PageLayout>;
};

export default ExercisesPage;
