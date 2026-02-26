import { AnomalyModal } from "@/components/dashboard/data-management/AnomalyModal";
import { DataQualityAnomalies } from "@/components/dashboard/data-management/DataQualityAnomalies";
import { DatasetCard } from "@/components/dashboard/data-management/DatasetCard";
import {
  anomalies,
  AnomalieType,
  datasets,
  pipelineLogs,
  serverStatus,
} from "@/components/dashboard/data-management/mocks";
import { PipelineLog } from "@/components/dashboard/data-management/PipelineLog";
import { ServerStatusCard } from "@/components/dashboard/data-management/ServerStatusCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPageWithLayout } from "@/utils/types/globals";
import { Play } from "lucide-react";
import { ReactElement, useState } from "react";

const DataPage: NextPageWithLayout = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'success' | 'error'>('success');
  const [selectedDataset, setSelectedDataset] = useState("nutrition");
  const [selectedAnomalies, setSelectedAnomalies] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasJsonChanged, setHasJsonChanged] = useState(false);
  const [currentAnomaly, setCurrentAnomaly] = useState<AnomalieType | null>(null);
  const [jsonValue, setJsonValue] = useState('');
  const [originalJsonValue, setOriginalJsonValue] = useState('');

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
    setJsonValue('');
    setOriginalJsonValue('');
    setHasJsonChanged(false);
  };

  const handleLaunchPipeline = () => {
    setIsLaunching(true);
    setPipelineStatus('running');
    setTimeout(() => {
      setIsLaunching(false);
      setPipelineStatus('success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#4A5568]">
            Datasets Disponibles
          </h3>
        </div>
        <Button
          size="default"
          className="bg-[#FF887B] hover:bg-[#ff7066] text-white gap-2"
          onClick={handleLaunchPipeline}
          disabled={isLaunching}
        >
          <Play className={`w-4 h-4 ${isLaunching ? "animate-spin" : ""}`} />
          {isLaunching ? "Lancement..." : "Lancer le Pipeline ETL"}
        </Button>
      </div>

      {/* Datasets Overview */}
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

      {/* Pipeline Logs */}
      <PipelineLog pipelineStatus={pipelineStatus} pipelineLogs={pipelineLogs} />

      {/* Data Quality & Anomalies */}
      <DataQualityAnomalies
        datasets={datasets}
        selectedDataset={selectedDataset}
        anomalies={anomalies}
        selectedAnomalies={selectedAnomalies}
        setSelectedAnomalies={setSelectedAnomalies}
        setJsonValue={setJsonValue}
        setHasJsonChanged={setHasJsonChanged}
        originalJsonValue={originalJsonValue}
        currentAnomaly={currentAnomaly}
        setCurrentAnomaly={setCurrentAnomaly}
        setOriginalJsonValue={setOriginalJsonValue}
        closeModal={closeModal}
        openModal={openModal}
      />

      {/* Server Status */}
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

      {/* Modal for Anomaly Details */}
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
