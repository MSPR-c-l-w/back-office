import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { AnomalyModal } from "@/components/dashboard/data-management/AnomalyModal";
import { DataQualityAnomalies } from "@/components/dashboard/data-management/DataQualityAnomalies";
import { DataQualityValidation } from "@/components/dashboard/data-management/DataQualityValidation";
import { DatasetCard } from "@/components/dashboard/data-management/DatasetCard";
import {
  anomalies,
  AnomalieType,
  datasets,
  serverStatus,
} from "@/components/dashboard/data-management/mocks";
import { PipelineLog } from "@/components/dashboard/data-management/PipelineLog";
import { ServerStatusCard } from "@/components/dashboard/data-management/ServerStatusCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { useEtlLogs, type PipelineId } from "@/hooks/useEtlLogs";
import { useEtlPipelineRunning } from "@/contexts/EtlPipelineContext";
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

const DataPage: NextPageWithLayout = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<
    "idle" | "running" | "success" | "error"
  >("idle");
  const [selectedDataset, setSelectedDataset] = useState("nutrition");
  const [selectedAnomalies, setSelectedAnomalies] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasJsonChanged, setHasJsonChanged] = useState(false);
  const [currentAnomaly, setCurrentAnomaly] = useState<AnomalieType | null>(
    null
  );
  const [jsonValue, setJsonValue] = useState("");
  const [originalJsonValue, setOriginalJsonValue] = useState("");

  const { logs: pipelineLogs, clearLogs, subscribe, isConnected } = useEtlLogs();
  const { isPipelineRunning, setPipelineRunning } = useEtlPipelineRunning();
  const pipelineId = DATASET_TO_PIPELINE[selectedDataset] ?? "nutrition";

  useEffect(() => {
    subscribe(pipelineId);
  }, [pipelineId, subscribe]);

  const openModal = (anomaly: AnomalieType) => {
    setCurrentAnomaly(anomaly);
    setJsonValue(JSON.stringify(anomaly.jsonData, null, 2));
    setOriginalJsonValue(JSON.stringify(anomaly.jsonData, null, 2));
    setHasJsonChanged(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAnomaly(null);
    setJsonValue("");
    setOriginalJsonValue("");
    setHasJsonChanged(false);
  };

  const handleLaunchPipeline = async () => {
    if (isPipelineRunning) return;
    clearLogs();
    setPipelineRunning(true);
    setIsLaunching(true);
    setPipelineStatus("running");
    subscribe(pipelineId);
    const path = PIPELINE_TO_API_PATH[pipelineId];
    try {
      await api.post(path);
      setPipelineStatus("success");
    } catch {
      setPipelineStatus("error");
    } finally {
      setIsLaunching(false);
      setPipelineRunning(false);
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
          disabled={isPipelineRunning}
        >
          <Play className={`w-4 h-4 ${isLaunching ? "animate-spin" : ""}`} />
          {isLaunching ? "Lancement..." : "Lancer le Pipeline ETL"}
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
        key={selectedDataset}
        datasets={datasets}
        selectedDataset={selectedDataset}
        anomalies={anomalies}
        selectedAnomalies={selectedAnomalies}
        setSelectedAnomalies={setSelectedAnomalies}
        openModal={openModal}
      />

      <DataQualityValidation
        pipeline={pipelineId}
        pipelineLabel={
          datasets.find((d) => d.id === selectedDataset)?.name ?? selectedDataset
        }
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

      <AnomalyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentAnomaly={currentAnomaly}
        setCurrentAnomaly={setCurrentAnomaly}
        hasJsonChanged={hasJsonChanged}
        jsonValue={jsonValue}
        setOriginalJsonValue={setOriginalJsonValue}
        setJsonValue={setJsonValue}
        setHasJsonChanged={setHasJsonChanged}
        originalJsonValue={originalJsonValue}
        closeModal={closeModal}
        setSelectedAnomalies={setSelectedAnomalies}
        anomalies={anomalies}
        datasets={datasets}
        selectedDataset={selectedDataset}
      />
    </div>
  );
};

DataPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion & Nettoyage">{page}</PageLayout>;
};

export default DataPage;
