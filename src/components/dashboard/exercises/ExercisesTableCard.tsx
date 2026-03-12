import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Exercise } from "@/utils/interfaces/exercise";
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";

type Banner = { kind: "success" | "error" | "info"; text: string } | null;

export type ExerciseSearchFilters = {
  name: string;
  muscle: string;
  level: string;
  equipment: string;
  category: string;
};

type Options = {
  muscles: string[];
  levels: string[];
  equipments: string[];
  categories: string[];
};

type Props = {
  filters: ExerciseSearchFilters;
  onFiltersChange: (next: ExerciseSearchFilters) => void;
  options: Options;
  items: Exercise[];
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSelectExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exercise: Exercise) => void;
  banner: Banner;
  onDismissBanner: () => void;
  isFetching: boolean;
};

export function ExercisesTableCard({
  filters,
  onFiltersChange,
  options,
  items,
  filteredCount,
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onPageChange,
  onSelectExercise,
  onDeleteExercise,
  banner,
  onDismissBanner,
  isFetching,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-[#4A5568]">
            Gestion Exercices
          </CardTitle>
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" />
                <Input
                  placeholder="Nom (ex: sit-up)"
                  value={filters.name}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, name: e.target.value });
                    onPageChange(1);
                  }}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" />
                <Input
                  placeholder="Muscle (ex: biceps)"
                  value={filters.muscle}
                  list="exercise-muscle-options"
                  onChange={(e) => {
                    onFiltersChange({ ...filters, muscle: e.target.value });
                    onPageChange(1);
                  }}
                  className="pl-10"
                />
                <datalist id="exercise-muscle-options">
                  {options.muscles.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
              <Input
                placeholder="Niveau (ex: débutant)"
                value={filters.level}
                list="exercise-level-options"
                onChange={(e) => {
                  onFiltersChange({ ...filters, level: e.target.value });
                  onPageChange(1);
                }}
              />
              <datalist id="exercise-level-options">
                {options.levels.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
              <Input
                placeholder="Équipement (ex: barre)"
                value={filters.equipment}
                list="exercise-equipment-options"
                onChange={(e) => {
                  onFiltersChange({ ...filters, equipment: e.target.value });
                  onPageChange(1);
                }}
              />
              <datalist id="exercise-equipment-options">
                {options.equipments.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
              <Input
                placeholder="Catégorie (ex: force)"
                value={filters.category}
                list="exercise-category-options"
                onChange={(e) => {
                  onFiltersChange({ ...filters, category: e.target.value });
                  onPageChange(1);
                }}
              />
              <datalist id="exercise-category-options">
                {options.categories.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
            {isFetching && (
              <div className="mt-2 text-xs text-[#4A5568]/70">Chargement…</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {banner && (
          <div
            className={[
              "mb-4 rounded-md border px-4 py-3 text-sm flex items-start justify-between gap-3",
              banner.kind === "success"
                ? "bg-[#5CC58C]/10 border-[#5CC58C]/30 text-[#2F855A]"
                : banner.kind === "error"
                  ? "bg-[#FF887B]/10 border-[#FF887B]/30 text-[#C53030]"
                  : "bg-[#4A90E2]/10 border-[#4A90E2]/30 text-[#2B6CB0]",
            ].join(" ")}
            role="status"
          >
            <span className="min-w-0">{banner.text}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-inherit"
              onClick={onDismissBanner}
            >
              Fermer
            </Button>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercice</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Muscles</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((ex) => (
                <TableRow key={ex.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="font-medium text-[#4A5568]">{ex.name}</div>
                    <div className="text-xs text-[#4A5568] opacity-70">
                      ID: {ex.id}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#4A5568]">{ex.level}</TableCell>
                  <TableCell className="text-[#4A5568]">
                    {ex.category}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(ex.primary_muscles ?? []).slice(0, 2).map((m) => (
                        <Badge
                          key={`${ex.id}-${m}`}
                          variant="outline"
                          className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                        >
                          {m}
                        </Badge>
                      ))}

                      {(ex.secondary_muscles ?? []).slice(0, 2).map((m) => (
                        <Badge
                          key={`${ex.id}-sec-${m}`}
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-gray-300"
                        >
                          {m}
                        </Badge>
                      ))}

                      {(() => {
                        const prim = (ex.primary_muscles ?? []).length;
                        const sec = (ex.secondary_muscles ?? []).length;
                        const shown = Math.min(2, prim) + Math.min(2, sec);
                        const remaining = prim + sec - shown;
                        return remaining > 0 ? (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 border-gray-300"
                          >
                            +{remaining}
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {ex.equipment ? (
                      <Badge
                        variant="outline"
                        className="bg-[#5CC58C] bg-opacity-10 text-[#2F855A] border-[#5CC58C]"
                      >
                        {ex.equipment}
                      </Badge>
                    ) : (
                      <span className="text-[#4A5568] opacity-70">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectExercise(ex)}
                        className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
                      >
                        Voir détails
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => onDeleteExercise(ex)}
                        className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
                        aria-label="Supprimer l'exercice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-[#4A5568]">
                    Aucun exercice trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#4A5568]">
            {filteredCount === 0
              ? "Affichage 0 exercice"
              : filteredCount < 0
                ? `Affichage ${startIndex + 1}-${startIndex + items.length}`
                : `Affichage ${startIndex + 1}-${Math.min(
                    startIndex + itemsPerPage,
                    filteredCount
                  )} sur ${filteredCount} exercices`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={
                      currentPage === pageNum
                        ? "bg-[#4A90E2] hover:bg-[#4A90E2]/90"
                        : "bg-white"
                    }
                    disabled={totalPages === 0}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="bg-white"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
