import { DataManagementView } from "@/components/dashboard/DataManagementView";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";

const DataPage: NextPageWithLayout = () => {
  return <DataManagementView />;
};

DataPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion & Nettoyage">{page}</PageLayout>;
};

export default DataPage;