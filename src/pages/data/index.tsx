import { BackOfficeLayout } from '@/components/layout/BackOfficeLayout';
import { DataManagementView } from '@/components/DataManagementView';

export default function DataPage() {
  return (
    <BackOfficeLayout pageTitle="Gestion & Nettoyage">
      <DataManagementView />
    </BackOfficeLayout>
  );
}
