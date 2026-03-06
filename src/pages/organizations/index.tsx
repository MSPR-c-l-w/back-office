import {
  OrganizationUpsertModal,
  OrganizationsTableCard,
} from "@/components/dashboard/organizations";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import type { Organization } from "@/utils/interfaces/organization";
import {
  deleteOrganization,
  listOrganizations,
} from "@/utils/organizationsApi";
import type { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

const OrganizationsPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrganization, setModalOrganization] =
    useState<Organization | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listOrganizations()
      .then((data) => {
        if (cancelled) return;
        setOrganizations(data);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setOrganizations([]);
        setError("Impossible de charger la liste des organisations.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const typeOptions = useMemo(() => {
    return Array.from(
      new Set(organizations.map((o) => o.type).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "fr"));
  }, [organizations]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        org.name.toLowerCase().includes(q) ||
        org.type.toLowerCase().includes(q);
      const matchesType = filterType === "all" || org.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [organizations, searchQuery, filterType]);

  const totalPages = Math.ceil(filteredOrganizations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrganizations = useMemo(
    () => filteredOrganizations.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredOrganizations, startIndex]
  );

  const openCreate = () => {
    setModalOrganization(null);
    setModalOpen(true);
  };

  const openDetails = (org: Organization) => {
    setModalOrganization(org);
    setModalOpen(true);
  };

  const handleDeleteFromTable = (org: Organization) => {
    setOrganizationToDelete(org);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!organizationToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteOrganization(organizationToDelete.id);
      setOrganizations((prev) =>
        prev.filter((o) => o.id !== organizationToDelete.id)
      );
      setDeleteConfirmOpen(false);
      setOrganizationToDelete(null);
    } catch {
      window.alert("Impossible de supprimer l’organisation.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaved = (saved: Organization) => {
    setOrganizations((prev) => {
      const exists = prev.some((o) => o.id === saved.id);
      if (!exists) return [saved, ...prev];
      return prev.map((o) => (o.id === saved.id ? saved : o));
    });
  };

  const handleDeleted = (id: number) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#4A5568]">
              Organisations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#4A5568]">Chargement…</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#4A5568]">
              Organisations
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
          <OrganizationsTableCard
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            typeOptions={typeOptions}
            paginatedOrganizations={paginatedOrganizations}
            filteredCount={filteredOrganizations.length}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onCreateOrganization={openCreate}
            onSelectOrganization={openDetails}
            onDeleteOrganization={handleDeleteFromTable}
          />

          <OrganizationUpsertModal
            organization={modalOrganization}
            open={modalOpen}
            onOpenChange={setModalOpen}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />

          <ConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={(open) => {
              setDeleteConfirmOpen(open);
              if (!open) setOrganizationToDelete(null);
            }}
            title="Supprimer l’organisation"
            description={
              organizationToDelete
                ? `Confirmer la suppression de “${organizationToDelete.name}” ?`
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

OrganizationsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion Organisations">{page}</PageLayout>;
};

export default OrganizationsPage;
