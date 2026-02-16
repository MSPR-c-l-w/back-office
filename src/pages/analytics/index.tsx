import { BackOfficeLayout } from '@/components/layout/BackOfficeLayout';
import { AnalyticsView } from '@/components/AnalyticsView';

export default function AnalyticsPage() {
  return (
    <BackOfficeLayout pageTitle="Analytics Business">
      <AnalyticsView />
    </BackOfficeLayout>
  );
}
