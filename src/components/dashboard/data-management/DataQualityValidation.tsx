"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api from "@/utils/axios";

const DEFAULT_PAGE_SIZE = 20;

export type PipelineId = "nutrition" | "exercise" | "health-profile";

export interface StagingRowDto {
  id: string;
  cleaned_data: Record<string, unknown>;
  anomalies?: unknown[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  pipeline: PipelineId;
  pipelineLabel: string;
  refreshSignal?: number;
  onDataChanged?: () => void;
}

function formatCleanedDataSummary(data: Record<string, unknown>): string {
  const parts: string[] = [];
  if (data.name != null) parts.push(String(data.name));
  if (data.category != null) parts.push(String(data.category));
  if (data.user_id != null) parts.push(`user_id: ${data.user_id}`);
  if (data.bmi != null) parts.push(`BMI: ${data.bmi}`);
  if (data.physical_activity_level != null)
    parts.push(String(data.physical_activity_level));
  if (parts.length === 0) return JSON.stringify(data).slice(0, 80);
  return parts.join(" · ");
}

export const DataQualityValidation = ({
  pipeline,
  pipelineLabel,
  refreshSignal,
  onDataChanged,
}: Props) => {
  const [rows, setRows] = useState<StagingRowDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = DEFAULT_PAGE_SIZE;
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailRow, setDetailRow] = useState<StagingRowDto | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit + 1;
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
        `/etl/staging?${params.toString()}`
      );
      setRows(Array.isArray(data?.items) ? data.items : []);
      setTotal(typeof data?.total === "number" ? data.total : 0);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur lors du chargement des lignes"
      );
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [pipeline, search, page, limit]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows, refreshSignal]);

  useEffect(() => {
    setPage(1);
  }, [pipeline]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [selectAllLoading, setSelectAllLoading] = useState(false);

  const toggleAll = async () => {
    if (selectedIds.size === total && total > 0) {
      setSelectedIds(new Set());
      return;
    }
    if (total === 0) return;
    setSelectAllLoading(true);
    try {
      const params = new URLSearchParams({
        pipeline,
        page: "1",
        limit: String(total),
      });
      if (search.trim()) params.set("search", search.trim());
      const { data } = await api.get<{ items: StagingRowDto[]; total: number }>(
        `/etl/staging?${params.toString()}`
      );
      const items = Array.isArray(data?.items) ? data.items : [];
      setSelectedIds(new Set(items.map((r) => r.id)));
    } finally {
      setSelectAllLoading(false);
    }
  };

  const updateStatus = async (
    ids: string[],
    status: "APPROVED" | "REJECTED"
  ) => {
    if (ids.length === 0) return;
    setActionLoading(true);
    try {
      await api.patch("/etl/staging/status", { pipeline, ids, status });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      await fetchRows();
      onDataChanged?.();
    } finally {
      setActionLoading(false);
    }
  };

  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, newPage)));
  };

  const handleAcceptSelection = () => {
    updateStatus(Array.from(selectedIds), "APPROVED");
  };

  const handleRejectSelection = () => {
    updateStatus(Array.from(selectedIds), "REJECTED");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle>
            Lignes à valider (sans anomalies) — {pipelineLabel}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Rechercher une ligne..."
                className="pl-10 w-64"
                aria-label="Rechercher une ligne"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
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
                    <TableHead className="w-12">
                      <Checkbox
                        aria-label="Sélectionner toutes les lignes (intégralité)"
                        checked={total > 0 && selectedIds.size === total}
                        onCheckedChange={toggleAll}
                        disabled={selectAllLoading || total === 0}
                      />
                    </TableHead>
                    <TableHead>Résumé</TableHead>
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
                        Aucune ligne sans anomalie à valider.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(row.id)}
                            onCheckedChange={() => toggleOne(row.id)}
                            aria-label={`Sélectionner la ligne ${row.id}`}
                          />
                        </TableCell>
                        <TableCell className="text-[#4A5568]">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {formatCleanedDataSummary(row.cleaned_data)}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-900"
                              aria-label={`Détail de la ligne ${row.id}`}
                              onClick={() => setDetailRow(row)}
                            >
                              Détail
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#5CC58C] hover:bg-[#4db57a]"
                              aria-label={`Accepter la ligne ${row.id}`}
                              disabled={actionLoading}
                              onClick={() => updateStatus([row.id], "APPROVED")}
                            >
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-[#FF887B] hover:bg-[#ff7066]"
                              aria-label={`Rejeter la ligne ${row.id}`}
                              disabled={actionLoading}
                              onClick={() => updateStatus([row.id], "REJECTED")}
                            >
                              Rejeter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {total > 0 && (
              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-slate-600">
                  Lignes {start} – {end} sur {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 bg-white text-slate-800"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
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
                    onClick={() => goToPage(page + 1)}
                    aria-label="Page suivante"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {selectedIds.size > 0 && (
              <div className="mt-4 p-4 bg-[#4A90E2] bg-opacity-10 rounded-lg flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-[#4A5568]">
                  <span className="font-semibold">{selectedIds.size}</span>{" "}
                  ligne
                  {selectedIds.size > 1 ? "s" : ""} sélectionnée
                  {selectedIds.size > 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-[#5CC58C] hover:bg-[#4db57a]"
                    disabled={actionLoading}
                    onClick={handleAcceptSelection}
                  >
                    Accepter la sélection
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-[#FF887B] hover:bg-[#ff7066]"
                    disabled={actionLoading}
                    onClick={handleRejectSelection}
                  >
                    Rejeter la sélection
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <Dialog
        open={!!detailRow}
        onOpenChange={(open) => !open && setDetailRow(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Détail de la ligne
            </DialogTitle>
          </DialogHeader>
          {detailRow && (
            <pre className="text-sm font-mono text-slate-800 bg-slate-100 border border-slate-200 rounded-lg p-4 overflow-auto flex-1 min-h-0 text-left whitespace-pre-wrap break-words">
              {JSON.stringify(detailRow, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
