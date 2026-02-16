import { BackOfficeLayout } from '@/components/layout/BackOfficeLayout';
import { ApiLogsView } from '@/components/ApiLogsView';

export default function ApiLogsPage() {
  return (
    <BackOfficeLayout pageTitle="API & Logs">
      <ApiLogsView />
    </BackOfficeLayout>
  );
}
