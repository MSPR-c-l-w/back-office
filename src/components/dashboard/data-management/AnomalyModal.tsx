/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { AnomalieType, DatasetType } from "./mocks";
import {
  useJsonChangeHandler,
  useResolveAnomaly,
} from "./useAnomalyResolution";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (e: any) => void;
  currentAnomaly: AnomalieType | null;
  setCurrentAnomaly: (nextAnomaly: any) => void;
  hasJsonChanged: boolean;
  jsonValue: string;
  setOriginalJsonValue: (e: any) => void;
  setJsonValue: (e: any) => void;
  setHasJsonChanged: (e: any) => void;
  originalJsonValue: string;
  closeModal: () => void;
  setSelectedAnomalies: (prev: any) => void;
  anomalies: AnomalieType[];
  datasets: DatasetType[];
  selectedDataset: string;
}

export const AnomalyModal = ({
  isModalOpen,
  setIsModalOpen,
  currentAnomaly,
  setCurrentAnomaly,
  hasJsonChanged,
  jsonValue,
  setJsonValue,
  setHasJsonChanged,
  originalJsonValue,
  setOriginalJsonValue,
  closeModal,
  setSelectedAnomalies,
  anomalies,
  datasets,
  selectedDataset,
}: Props) => {
  const handleJsonChange = useJsonChangeHandler(
    originalJsonValue,
    setJsonValue,
    setHasJsonChanged
  );

  const { resolveAnomaly } = useResolveAnomaly({
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
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF887B] bg-opacity-10 flex items-center justify-center">
                <AlertCircle
                  className="w-5 h-5 text-[#FF887B]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <DialogTitle className="text-xl text-[#4A5568]">
                  Résolution de l&apos;Anomalie
                </DialogTitle>
                <DialogDescription className="text-[#4A5568] opacity-70">
                  Modifiez les données JSON pour corriger l&apos;anomalie
                  détectée
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations de l'anomalie */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8FAFB] rounded-lg">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#4A5568] opacity-70 uppercase tracking-wide">
                Type
              </p>
              <Badge
                variant="outline"
                className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2] w-fit"
              >
                {currentAnomaly?.type === "duplicate" && "Doublon"}
                {currentAnomaly?.type === "missing" && "Manquant"}
                {currentAnomaly?.type === "outlier" && "Aberrant"}
                {currentAnomaly?.type === "format" && "Format"}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#4A5568] opacity-70 uppercase tracking-wide">
                Dataset
              </p>
              <p className="text-sm font-semibold text-[#4A5568]">
                {currentAnomaly?.dataset}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#4A5568] opacity-70 uppercase tracking-wide">
                Champ concerné
              </p>
              <code className="text-sm font-mono text-[#4A5568] bg-white px-2 py-1 rounded border border-gray-200 w-fit">
                {currentAnomaly?.field}
              </code>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#4A5568] opacity-70 uppercase tracking-wide">
                Sévérité
              </p>
              <Badge
                variant="outline"
                className={
                  currentAnomaly?.severity === "high"
                    ? "bg-[#FF887B] bg-opacity-10 text-[#FF887B] border-[#FF887B] w-fit"
                    : currentAnomaly?.severity === "medium"
                      ? "bg-[#FFB88C] bg-opacity-10 text-[#FFB88C] border-[#FFB88C] w-fit"
                      : "bg-[#7FD8BE] bg-opacity-10 text-[#7FD8BE] border-[#7FD8BE] w-fit"
                }
              >
                {currentAnomaly?.severity === "high" && "Élevée"}
                {currentAnomaly?.severity === "medium" && "Moyenne"}
                {currentAnomaly?.severity === "low" && "Faible"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#4A5568] opacity-70 uppercase tracking-wide">
              Description
            </p>
            <div className="p-3 bg-[#FFB88C] bg-opacity-10 border-l-4 border-[#FFB88C] rounded">
              <p className="text-sm text-[#4A5568]">
                {currentAnomaly?.description}
                <span className="ml-2 text-xs opacity-70">
                  ({currentAnomaly?.count ?? 0} occurrence
                  {(currentAnomaly?.count ?? 0) > 1 ? "s" : ""})
                </span>
              </p>
            </div>
          </div>

          {/* Éditeur JSON */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p
                id="anomaly-json-editor-label"
                className="text-xs text-[#4A5568] opacity-70 uppercase tracking-wide"
              >
                Données JSON
              </p>
              {hasJsonChanged && (
                <Badge
                  variant="outline"
                  className="bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]"
                >
                  ✓ Modifié
                </Badge>
              )}
            </div>
            <div className="relative">
              <textarea
                id="anomaly-json-editor"
                value={jsonValue}
                onChange={handleJsonChange}
                className="w-full h-48 p-4 bg-[#1e1e1e] text-[#d4d4d4] rounded-lg font-mono text-sm border-2 border-gray-300 focus:border-[#4A90E2] focus:outline-none resize-none transition-colors"
                placeholder="Modifier les données JSON ici..."
                spellCheck={false}
                aria-labelledby="anomaly-json-editor-label"
                aria-describedby="anomaly-json-editor-help"
              />
            </div>
            <p id="anomaly-json-editor-help" className="text-xs text-[#4A5568]">
              Modifiez le JSON puis validez pour appliquer la correction.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-[#4A5568] opacity-70">
            {hasJsonChanged
              ? "Cliquez sur Valider pour appliquer les modifications"
              : "Modifiez les données pour activer la validation"}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={closeModal}
              className="border-gray-300 text-[#4A5568] hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button
              className={
                hasJsonChanged
                  ? "bg-[#5CC58C] hover:bg-[#4db57a] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
              disabled={!hasJsonChanged}
              onClick={resolveAnomaly}
            >
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
