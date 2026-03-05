import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataQualityAnomalies } from "@/components/dashboard/data-management/DataQualityAnomalies";
import { DataQualityValidation } from "@/components/dashboard/data-management/DataQualityValidation";
import { DatasetCard } from "@/components/dashboard/data-management/DatasetCard";
import {
  datasets,
  serverStatus,
} from "@/components/dashboard/data-management/mocks";
import { PipelineLog } from "@/components/dashboard/data-management/PipelineLog";
import { ServerStatusCard } from "@/components/dashboard/data-management/ServerStatusCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { useEtlLogs, type PipelineId } from "@/hooks/useEtlLogs";
import api from "@/utils/axios";

const DATASET_TO_PIPELINE: Record<string, PipelineId> = {
  nutrition: "nutrition",
  exercises: "exercise",
  biometry: "health-profile",
};

const PIPELINE_TO_API_PATH: Record<PipelineId, string> = {
  nutrition: "/nutrition/import",
  exercise: "/exercise/import",
  "health-profile": "/health-profile/import",
};

type PipelineDisplayStatus = "idle" | "running" | "success" | "error";

const DataPage: NextPageWithLayout = () => {
  const [launchingByPipeline, setLaunchingByPipeline] = useState<
    Record<PipelineId, boolean>
  >({
    nutrition: false,
    exercise: false,
    "health-profile": false,
  });
  const [runningByPipeline, setRunningByPipeline] = useState<
    Record<PipelineId, boolean>
  >({
    nutrition: false,
    exercise: false,
    "health-profile": false,
  });
  const [statusByPipeline, setStatusByPipeline] = useState<
    Record<PipelineId, PipelineDisplayStatus>
  >({
    nutrition: "idle",
    exercise: "idle",
    "health-profile": "idle",
  });
  const [selectedDataset, setSelectedDataset] = useState("nutrition");
  const [refreshSignal, setRefreshSignal] = useState(0);

  const {
    logs: pipelineLogs,
    clearLogs,
    subscribe,
    isConnected,
  } = useEtlLogs();
  const pipelineId = DATASET_TO_PIPELINE[selectedDataset] ?? "nutrition";
  const isCurrentPipelineRunning = runningByPipeline[pipelineId];
  const isCurrentPipelineLaunching = launchingByPipeline[pipelineId];
  const pipelineStatus = useMemo<PipelineDisplayStatus>(() => {
    if (isCurrentPipelineRunning || isCurrentPipelineLaunching)
      return "running";
    return statusByPipeline[pipelineId];
  }, [
    isCurrentPipelineRunning,
    isCurrentPipelineLaunching,
    pipelineId,
    statusByPipeline,
  ]);

  useEffect(() => {
    subscribe(pipelineId);
  }, [pipelineId, subscribe]);

  const refreshPipelineStatuses = useCallback(async () => {
    try {
      const { data } = await api.get<Record<PipelineId, boolean>>(
        "/etl/pipelines/status"
      );
      setRunningByPipeline({
        nutrition: !!data?.nutrition,
        exercise: !!data?.exercise,
        "health-profile": !!data?.["health-profile"],
      });
    } catch {
      // Pas bloquant pour l'UI: on garde le dernier état connu.
    }
  }, []);

  useEffect(() => {
    refreshPipelineStatuses();
    const timer = setInterval(refreshPipelineStatuses, 2500);
    return () => clearInterval(timer);
  }, [refreshPipelineStatuses]);

  const handleLaunchPipeline = async () => {
    const targetPipeline = pipelineId;
    if (
      runningByPipeline[targetPipeline] ||
      launchingByPipeline[targetPipeline]
    ) {
      return;
    }
    clearLogs(targetPipeline);
    setLaunchingByPipeline((prev) => ({ ...prev, [targetPipeline]: true }));
    setStatusByPipeline((prev) => ({ ...prev, [targetPipeline]: "running" }));
    setRunningByPipeline((prev) => ({ ...prev, [targetPipeline]: true }));
    subscribe(targetPipeline);
    const path = PIPELINE_TO_API_PATH[targetPipeline];
    try {
      await api.post(path);
      setStatusByPipeline((prev) => ({ ...prev, [targetPipeline]: "success" }));
    } catch {
      setStatusByPipeline((prev) => ({ ...prev, [targetPipeline]: "error" }));
    } finally {
      setLaunchingByPipeline((prev) => ({ ...prev, [targetPipeline]: false }));
      await refreshPipelineStatuses();
      setRefreshSignal((value) => value + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#4A5568]">
          Datasets Disponibles
        </h3>
        <Button
          size="default"
          className="bg-[#FF887B] hover:bg-[#ff7066] text-white gap-2"
          onClick={handleLaunchPipeline}
          disabled={isCurrentPipelineRunning || isCurrentPipelineLaunching}
        >
          <Play
            className={`w-4 h-4 ${
              isCurrentPipelineLaunching ? "animate-spin" : ""
            }`}
          />
          {isCurrentPipelineRunning
            ? "Pipeline déjà en cours..."
            : isCurrentPipelineLaunching
              ? "Lancement..."
              : "Lancer le Pipeline ETL"}
        </Button>
      </div>

      <section aria-labelledby="datasets-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              selectedDataset={selectedDataset}
              setSelectedDataset={setSelectedDataset}
            />
          ))}
        </div>
      </section>

      <PipelineLog
        pipelineStatus={pipelineStatus}
        pipelineLogs={pipelineLogs}
        onClear={clearLogs}
        isConnected={isConnected}
      />

      <DataQualityAnomalies
        pipeline={pipelineId}
        pipelineLabel={
          datasets.find((d) => d.id === selectedDataset)?.name ??
          selectedDataset
        }
        refreshSignal={refreshSignal}
        onDataChanged={() => setRefreshSignal((value) => value + 1)}
      />

      <DataQualityValidation
        pipeline={pipelineId}
        pipelineLabel={
          datasets.find((d) => d.id === selectedDataset)?.name ??
          selectedDataset
        }
        refreshSignal={refreshSignal}
        onDataChanged={() => setRefreshSignal((value) => value + 1)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Statut des Serveurs ETL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serverStatus.map((server, index) => (
              <ServerStatusCard key={index} server={server} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

DataPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion & Nettoyage">{page}</PageLayout>;
};

export default DataPage;
