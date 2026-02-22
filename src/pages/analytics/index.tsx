import { PageLayout } from "@/components/layout/PageLayout";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";

const AnalyticsPage: NextPageWithLayout = () => {
  return <AnalyticsView />;
};

AnalyticsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Analytics Business">{page}</PageLayout>;
};

export default AnalyticsPage;