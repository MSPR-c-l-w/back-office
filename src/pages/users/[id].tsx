import { PageLayout } from "@/components/layout/PageLayout";
import { useRequireRole } from "@/hooks/useRequireRole";
import { NextPageWithLayout } from "@/utils/types/globals";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useEffect, useState } from "react";
import api from "@/utils/axios";
import type { User } from "@/utils/interfaces/user";
import { UserDetailView } from "@/components/dashboard/users/UserDetailView";
import { UserUpdateModal } from "@/components/dashboard/users/UserUpdateModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteUser } from "@/utils/usersApi";

type DetailUser = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  objective: string;
  plan: "Freemium" | "Premium" | "B2B";
  status: "active" | "inactive";
  joinDate: string;
  lastActivity: string;
  avatar?: string;
};

function formatLastActivity(dateInput: Date | string | undefined): string {
  if (!dateInput) return "—";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffH / 24);

  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH} h`;
  return `Il y a ${diffDays} j`;
}

function normalizePlanName(raw?: string): "Freemium" | "Premium" | "B2B" {
  if (!raw) return "Freemium";
  const normalized = raw.trim().toLowerCase();
  if (normalized === "premium") return "Premium";
  if (normalized === "b2b") return "B2B";
  return "Freemium";
}

function mapApiUserToDetailUser(apiUser: User): DetailUser {
  const name =
    [apiUser.first_name, apiUser.last_name].filter(Boolean).join(" ") || "—";
  let age = 0;
  if (apiUser.date_of_birth) {
    const birth = new Date(apiUser.date_of_birth);
    if (!Number.isNaN(birth.getTime())) {
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      age = Math.max(0, age);
    }
  }
  const joinDate =
    apiUser.created_at instanceof Date
      ? apiUser.created_at.toLocaleDateString("fr-FR")
      : new Date(
          (apiUser as unknown as { created_at: string }).created_at
        ).toLocaleDateString("fr-FR");
  const latestSessionAt =
    apiUser.sessions?.[0]?.created_at ?? apiUser.updated_at;
  const objective =
    typeof apiUser.healthProfile?.daily_calories_target === "number"
      ? `${apiUser.healthProfile.daily_calories_target} kcal/j`
      : apiUser.healthProfile?.physical_activity_level?.trim() || "—";

  return {
    id: apiUser.id,
    name,
    email: apiUser.email,
    age,
    gender: apiUser.gender ?? "—",
    objective,
    plan: normalizePlanName(apiUser.subscriptions?.[0]?.plan?.name),
    status: apiUser.is_active ? "active" : "inactive",
    joinDate,
    lastActivity: formatLastActivity(latestSessionAt),
  };
}

const UserDetailPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: apiUser } = await api.get<User>(`/users/${id}`);
      setUser(apiUser);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { status?: number; data?: { message?: string } };
              }
            ).response?.status
          : undefined;
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;

      if (status === 403) {
        setError(
          apiMessage === "YOU_MUST_BE_AN_COACH"
            ? "Vous devez être un coach pour accéder à cette page."
            : "Accès refusé."
        );
      } else if (status === 404) {
        setError("Utilisateur introuvable.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleBack = () => {
    router.push("/users");
  };

  const handleDelete = useCallback(async () => {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteUser(user.id);
      setDeleteOpen(false);
      await router.push("/users");
    } catch {
      setDeleteError("Impossible de supprimer cet utilisateur.");
    } finally {
      setDeleteLoading(false);
    }
  }, [router, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#4A5568]">Chargement...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{error ?? "Utilisateur introuvable."}</p>
        <button
          type="button"
          onClick={handleBack}
          className="text-[#4A90E2] hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const detailUser = mapApiUserToDetailUser(user);

  return (
    <>
      {deleteError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {deleteError}
        </div>
      )}
      <UserDetailView
        user={detailUser}
        onBack={handleBack}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />
      <UserUpdateModal
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={setUser}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cet utilisateur ?"
        description="La suppression le passera en statut supprimé dans la base. Cette action est réversible uniquement depuis le backend."
        confirmLabel="Supprimer"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </>
  );
};

UserDetailPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Détail utilisateur">{page}</PageLayout>;
};

export default UserDetailPage;
