/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnomalieType, DatasetType } from "./mocks";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  datasets: DatasetType[];
  selectedDataset: string;
  anomalies: AnomalieType[];
  selectedAnomalies: any;
  setSelectedAnomalies: (prev: any) => void;
  openModal: (anomaly: AnomalieType) => void;
}

export const DataQualityAnomalies = ({
  datasets,
  selectedDataset,
  anomalies,
  selectedAnomalies,
  setSelectedAnomalies,
  openModal,
}: Props) => {
  const toggleAnomaly = (id: number) => {
    setSelectedAnomalies((prev: number[]) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle>
            Gestion des Anomalies -{" "}
            {datasets.find((d) => d.id === selectedDataset)?.name}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Rechercher une anomalie..."
                className="pl-10 w-64"
                aria-label="Rechercher une anomalie"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="duplicate">Doublons</SelectItem>
                <SelectItem value="missing">Manquants</SelectItem>
                <SelectItem value="outlier">Aberrants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox aria-label="Sélectionner toutes les anomalies" />
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Champ</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies
                .filter(
                  (a) =>
                    a.dataset ===
                    datasets.find((d) => d.id === selectedDataset)?.name
                )
                .map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAnomalies.includes(anomaly.id)}
                        onCheckedChange={() => toggleAnomaly(anomaly.id)}
                        aria-label={`Sélectionner l'anomalie ${anomaly.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                      >
                        {anomaly.type === "duplicate" && "Doublon"}
                        {anomaly.type === "missing" && "Manquant"}
                        {anomaly.type === "outlier" && "Aberrant"}
                        {anomaly.type === "format" && "Format"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">
                      {anomaly.dataset}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm font-mono text-[#4A5568] bg-gray-100 px-2 py-1 rounded">
                        {anomaly.field}
                      </code>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">
                      {anomaly.description}
                      <span className="ml-2 text-xs text-[#4A5568] opacity-70">
                        ({anomaly.count} occurrence
                        {anomaly.count > 1 ? "s" : ""})
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          anomaly.severity === "high"
                            ? "bg-[#FF887B] bg-opacity-10 text-[#FF887B] border-[#FF887B]"
                            : anomaly.severity === "medium"
                              ? "bg-[#FFB88C] bg-opacity-10 text-[#FFB88C] border-[#FFB88C]"
                              : "bg-[#7FD8BE] bg-opacity-10 text-[#7FD8BE] border-[#7FD8BE]"
                        }
                      >
                        {anomaly.severity === "high" && "Élevée"}
                        {anomaly.severity === "medium" && "Moyenne"}
                        {anomaly.severity === "low" && "Faible"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-[#5CC58C] hover:bg-[#4db57a]"
                          aria-label={`Résoudre l'anomalie ${anomaly.id}`}
                          onClick={() => openModal(anomaly)}
                        >
                          Résoudre
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-[#FF887B] hover:bg-[#ff7066]"
                          aria-label={`Rejeter l'anomalie ${anomaly.id}`}
                        >
                          Rejeter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {selectedAnomalies.length > 0 && (
          <div className="mt-4 p-4 bg-[#4A90E2] bg-opacity-10 rounded-lg flex items-center justify-between">
            <p className="text-sm text-[#4A5568]">
              <span className="font-semibold">{selectedAnomalies.length}</span>{" "}
              anomalie{selectedAnomalies.length > 1 ? "s" : ""} sélectionnée
              {selectedAnomalies.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              <Button className="bg-[#5CC58C] hover:bg-[#4db57a]">
                Valider la sélection
              </Button>
              <Button
                variant="destructive"
                className="bg-[#FF887B] hover:bg-[#ff7066]"
              >
                Rejeter la sélection
              </Button>
              <Button variant="outline">Corriger automatiquement</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
