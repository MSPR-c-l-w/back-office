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
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A90E2] bg-opacity-10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#4A90E2]" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-[#4A5568]">{dataset.name}</h4>
            </div>
          </div>
          {dataset.status === "warning" && (
            <AlertCircle
              className="w-5 h-5 text-[#FFB88C]"
              aria-label="Avertissement"
            />
          )}
          {dataset.status === "success" && (
            <CheckCircle
              className="w-5 h-5 text-[#5CC58C]"
              aria-label="Aucun problème"
            />
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4A5568] opacity-70">Anomalies</span>
          <Badge variant={dataset.issues > 5 ? "destructive" : "secondary"}>
            {dataset.issues}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-[#4A5568] opacity-70">Dernière sync</span>
          <span className="text-[#4A5568]">{dataset.lastSync}</span>
        </div>
      </CardContent>
    </Card>
  );
};
