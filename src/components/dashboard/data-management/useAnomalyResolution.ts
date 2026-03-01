import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { AnomalieType, DatasetType } from "./mocks";

/**
 * Gestionnaire de changement pour l’édition JSON (évite la duplication entre
 * AnomalyModal et tout autre composant qui édite le JSON d’anomalie).
 */
export function useJsonChangeHandler(
  originalJsonValue: string,
  setJsonValue: (value: string) => void,
  setHasJsonChanged: (value: boolean) => void
) {
  return useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setJsonValue(value);
      setHasJsonChanged(value !== originalJsonValue);
    },
    [originalJsonValue, setJsonValue, setHasJsonChanged]
  );
}

export type ResolveAnomalyParams = {
  currentAnomaly: AnomalieType | null;
  setSelectedAnomalies: Dispatch<SetStateAction<number[]>>;
  anomalies: AnomalieType[];
  datasets: DatasetType[];
  selectedDataset: string;
  setCurrentAnomaly: (anomaly: AnomalieType | null) => void;
  setJsonValue: (value: string) => void;
  setOriginalJsonValue: (value: string) => void;
  setHasJsonChanged: (value: boolean) => void;
  closeModal: () => void;
};

/**
 * Hook qui centralise la logique de résolution d’anomalie (passage à la
 * suivante ou fermeture du modal). À utiliser dans AnomalyModal (et tout
 * composant réutilisant la même logique).
 */
export function useResolveAnomaly(params: ResolveAnomalyParams) {
  const [resolvedAnomalies, setResolvedAnomalies] = useState<number[]>([]);
  const {
    currentAnomaly,
    setSelectedAnomalies,
    anomalies,
    datasets,
    selectedDataset,
    setCurrentAnomaly,
    setJsonValue,
    setOriginalJsonValue,
    setHasJsonChanged,
    closeModal,
  } = params;

  const resolveAnomaly = useCallback(() => {
    if (!currentAnomaly) return;

    const resolvedAfterThis = [...resolvedAnomalies, currentAnomaly.id];
    setResolvedAnomalies(() => resolvedAfterThis);
    setSelectedAnomalies((prev: number[]) =>
      prev.filter((i) => i !== currentAnomaly.id)
    );

    const datasetName = datasets.find((d) => d.id === selectedDataset)?.name;
    const currentDatasetAnomalies = anomalies.filter(
      (a) => a.dataset === datasetName && !resolvedAfterThis.includes(a.id)
    );

    if (currentDatasetAnomalies.length > 0) {
      const nextAnomaly = currentDatasetAnomalies[0];
      setCurrentAnomaly(nextAnomaly);
      const nextJson = JSON.stringify(nextAnomaly.jsonData, null, 2);
      setJsonValue(nextJson);
      setOriginalJsonValue(nextJson);
      setHasJsonChanged(false);
    } else {
      closeModal();
    }
  }, [
    currentAnomaly,
    resolvedAnomalies,
    anomalies,
    datasets,
    selectedDataset,
    setSelectedAnomalies,
    setCurrentAnomaly,
    setJsonValue,
    setOriginalJsonValue,
    setHasJsonChanged,
    closeModal,
  ]);

  return { resolveAnomaly, resolvedAnomalies };
}
