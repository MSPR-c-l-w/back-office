import { BackOfficeLayout } from '@/components/layout/BackOfficeLayout';
import { UsersView } from '@/components/UsersView';

export default function UsersPage() {
  return (
    <BackOfficeLayout pageTitle="Gestion Utilisateurs">
      <UsersView />
    </BackOfficeLayout>
  );
}
