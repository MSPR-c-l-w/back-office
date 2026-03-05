import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { PipelineId, StagingRowDto } from "./DataQualityValidation";

const DEFAULT_PAGE_SIZE = 20;

type StagingAnomaly = {
  field?: string;
  code?: string;
  message?: string;
  severity?: string;
};

interface Props {
  pipeline: PipelineId;
  pipelineLabel: string;
  refreshSignal?: number;
  onDataChanged?: () => void;
}

function asAnomalyList(value: unknown): StagingAnomaly[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === "object");
}

function formatAnomalyBadgeSeverity(severity?: string): string {
  const s = (severity ?? "").toUpperCase();
  if (s === "HIGH")
    return "bg-[#FF887B] bg-opacity-10 text-[#FF887B] border-[#FF887B]";
  if (s === "MEDIUM")
    return "bg-[#FFB88C] bg-opacity-10 text-[#FFB88C] border-[#FFB88C]";
  return "bg-[#7FD8BE] bg-opacity-10 text-[#7FD8BE] border-[#7FD8BE]";
}

export const DataQualityAnomalies = ({
  pipeline,
  pipelineLabel,
  refreshSignal,
  onDataChanged,
}: Props) => {
  const [rows, setRows] = useState<StagingRowDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<StagingRowDto | null>(null);
  const [editedJson, setEditedJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const limit = DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        pipeline,
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      const { data } = await api.get<{ items: StagingRowDto[]; total: number }>(
        `/etl/staging/anomalies?${params.toString()}`
      );
      setRows(Array.isArray(data?.items) ? data.items : []);
      setTotal(typeof data?.total === "number" ? data.total : 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Erreur lors du chargement des anomalies"
      );
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [pipeline, page, search, limit]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows, refreshSignal]);

  useEffect(() => {
    setPage(1);
  }, [pipeline]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const rowAnomalyCount = useMemo(
    () =>
      rows.reduce(
        (acc, row) => acc + asAnomalyList(row.anomalies ?? []).length,
        0
      ),
    [rows]
  );

  const openEditor = (row: StagingRowDto) => {
    setEditingRow(row);
    setEditedJson(JSON.stringify(row.cleaned_data, null, 2));
    setJsonError(null);
  };

  const rejectRow = async (rowId: string) => {
    setActionLoading(true);
    try {
      await api.patch("/etl/staging/status", {
        pipeline,
        ids: [rowId],
        status: "REJECTED",
      });
      await fetchRows();
      onDataChanged?.();
    } finally {
      setActionLoading(false);
    }
  };

  const saveEditedJson = async () => {
    if (!editingRow) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(editedJson);
      setJsonError(null);
    } catch {
      setJsonError("JSON invalide : corrige la syntaxe avant de valider.");
      return;
    }

    setActionLoading(true);
    try {
      await api.patch("/etl/staging/cleaned-data", {
        pipeline,
        id: editingRow.id,
        cleaned_data: parsed,
      });
      setEditingRow(null);
      setEditedJson("");
      await fetchRows();
      onDataChanged?.();
    } catch (e) {
      setJsonError(
        e instanceof Error
          ? e.message
          : "Erreur lors de la sauvegarde et revalidation"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle>Gestion des anomalies — {pipelineLabel}</CardTitle>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Rechercher une ligne..."
              className="pl-10 w-64"
              aria-label="Rechercher une ligne en anomalie"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-[#4A5568]">Chargement...</p>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ligne</TableHead>
                    <TableHead>Anomalies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-[#4A5568] py-8"
                      >
                        Aucune anomalie détectée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => {
                      const anomalies = asAnomalyList(row.anomalies ?? []);
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="text-[#4A5568]">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {JSON.stringify(row.cleaned_data).slice(0, 90)}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {anomalies.map((anomaly, index) => (
                                <Badge
                                  key={`${row.id}-${index}`}
                                  variant="outline"
                                  className={formatAnomalyBadgeSeverity(
                                    anomaly.severity
                                  )}
                                >
                                  {anomaly.field ?? "champ?"}:{" "}
                                  {anomaly.code ?? "ANOMALY"}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-900"
                                onClick={() => openEditor(row)}
                              >
                                Corriger JSON
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="bg-[#FF887B] hover:bg-[#ff7066]"
                                disabled={actionLoading}
                                onClick={() => rejectRow(row.id)}
                              >
                                Rejeter
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {total > 0 && (
              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-slate-600">
                  Lignes {start} – {end} sur {total} (anomalies visibles:{" "}
                  {rowAnomalyCount})
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 bg-white text-slate-800"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Button>
                  <span className="text-sm text-slate-600 px-2">
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 bg-white text-slate-800"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Page suivante"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <Dialog
        open={!!editingRow}
        onOpenChange={(open) => !open && setEditingRow(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Corriger la donnée JSON puis relancer les détecteurs
            </DialogTitle>
          </DialogHeader>
          <textarea
            value={editedJson}
            onChange={(e) => setEditedJson(e.target.value)}
            className="w-full h-72 p-4 bg-[#1e1e1e] text-[#d4d4d4] rounded-lg font-mono text-sm border-2 border-gray-300 focus:border-[#4A90E2] focus:outline-none resize-none transition-colors"
            spellCheck={false}
          />
          {jsonError && (
            <p className="text-sm text-red-600" role="alert">
              {jsonError}
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingRow(null)}>
              Annuler
            </Button>
            <Button
              className="bg-[#5CC58C] hover:bg-[#4db57a] text-white"
              disabled={actionLoading}
              onClick={saveEditedJson}
            >
              Sauvegarder et revalider
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
