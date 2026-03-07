import { PageLayout } from '@/components/layout/PageLayout';
import { useRequireRole } from '@/hooks/useRequireRole';
import { NextPageWithLayout } from '@/utils/types/globals';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import api from '@/utils/axios';
import type { User } from '@/utils/interfaces/user';
import { UserDetailView } from '@/components/dashboard/users/UserDetailView';

type DetailUser = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  objective: string;
  plan: 'Freemium' | 'Premium' | 'B2B';
  status: 'active' | 'inactive';
  joinDate: string;
  lastActivity: string;
  avatar?: string;
};

function mapApiUserToDetailUser(apiUser: User): DetailUser {
  const name = [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || '—';
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
      ? apiUser.created_at.toLocaleDateString('fr-FR')
      : new Date((apiUser as unknown as { created_at: string }).created_at).toLocaleDateString('fr-FR');
  const updatedAt =
    apiUser.updated_at instanceof Date
      ? apiUser.updated_at
      : new Date((apiUser as unknown as { updated_at: string }).updated_at);
  const diffMs = Date.now() - updatedAt.getTime();
  const diffH = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffH / 24);
  const lastActivity =
    diffH < 24 ? `Il y a ${diffH} h` : `Il y a ${diffDays} j`;

  return {
    id: apiUser.id,
    name,
    email: apiUser.email,
    age,
    gender: apiUser.gender ?? '—',
    objective: '—',
    plan: 'Freemium',
    status: apiUser.is_active ? 'active' : 'inactive',
    joinDate,
    lastActivity,
  };
}

const UserDetailPage: NextPageWithLayout = () => {
  useRequireRole('ADMIN');
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [user, setUser] = useState<DetailUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: apiUser } = await api.get<User>(`/users/${id}`);
      setUser(mapApiUserToDetailUser(apiUser));
    } catch (err: unknown) {
      const status =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number; data?: { message?: string } } })
              .response?.status
          : undefined;
      const apiMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined;

      if (status === 403) {
        setError(
          apiMessage === 'YOU_MUST_BE_AN_COACH'
            ? 'Vous devez être un coach pour accéder à cette page.'
            : 'Accès refusé.'
        );
      } else if (status === 404) {
        setError('Utilisateur introuvable.');
      } else {
        setError('Une erreur est survenue. Réessayez.');
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
    router.push('/users');
  };

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
        <p className="text-red-600">{error ?? 'Utilisateur introuvable.'}</p>
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

  return <UserDetailView user={user} onBack={handleBack} />;
};

UserDetailPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Détail utilisateur">{page}</PageLayout>;
};

export default UserDetailPage;