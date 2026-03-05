import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import { DatasetType } from "./mocks";

interface Props {
  dataset: DatasetType;
  selectedDataset: string;
  setSelectedDataset: (id: string) => void;
}

export const DatasetCard = ({
  dataset,
  selectedDataset,
  setSelectedDataset,
}: Props) => {
  return (
    <Card
      key={dataset.id}
      className={`cursor-pointer transition-all ${
        selectedDataset === dataset.id
          ? "ring-2 ring-[#4A90E2]"
          : "hover:shadow-md"
      }`}
      onClick={() => setSelectedDataset(dataset.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedDataset(dataset.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={selectedDataset === dataset.id}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#4A90E2] bg-opacity-10 flex items-center justify-center flex-shrink-0">
              <Database className="w-4 h-4 text-[#4A90E2]" aria-hidden="true" />
            </div>
            <h4 className="font-semibold text-[#4A5568] truncate">
              {dataset.name}
            </h4>
          </div>
          {dataset.status === "warning" && (
            <AlertCircle
              className="w-5 h-5 text-[#FFB88C] flex-shrink-0"
              aria-label="Avertissement"
            />
          )}
          {dataset.status === "success" && (
            <CheckCircle
              className="w-5 h-5 text-[#5CC58C] flex-shrink-0"
              aria-label="Aucun problème"
            />
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4A5568] opacity-70">Anomalies</span>
          <Badge variant={dataset.issues > 0 ? "destructive" : "secondary"}>
            {dataset.issues}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-[#4A5568] opacity-70">Dernière sync</span>
          <span className="text-[#4A5568]">{dataset.lastSync}</span>
        </div>
      </CardContent>
    </Card>
  );
};
