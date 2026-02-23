import { DashboardView } from "@/components/dashboard/DashboardView";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";

const DashboardPage: NextPageWithLayout = () => {
  return <DashboardView />;
};

DashboardPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Dashboard">{page}</PageLayout>;
};

export default DashboardPage;