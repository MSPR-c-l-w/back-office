import { ApiLogsView } from "@/components/dashboard/ApiLogsView";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";

const ApiLogsPage: NextPageWithLayout = () => {
  return <ApiLogsView />;
};

ApiLogsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="API & Logs">{page}</PageLayout>;
};

export default ApiLogsPage;
