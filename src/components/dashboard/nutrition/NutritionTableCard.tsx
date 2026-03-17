import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Nutrition } from "@/utils/interfaces/nutrition";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Trash2,
} from "lucide-react";

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  categoryOptions: string[];
  filterMealType: string;
  onFilterMealTypeChange: (value: string) => void;
  mealTypeOptions: string[];
  paginatedNutritions: Nutrition[];
  filteredCount: number;
  hasAnyNutrition: boolean;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSelectNutrition: (nutrition: Nutrition) => void;
  onDeleteNutrition: (nutrition: Nutrition) => void;
};

export function NutritionTableCard({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterCategoryChange,
  categoryOptions,
  filterMealType,
  onFilterMealTypeChange,
  mealTypeOptions,
  paginatedNutritions,
  filteredCount,
  hasAnyNutrition,
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onPageChange,
  onSelectNutrition,
  onDeleteNutrition,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-[#4A5568]">
            Liste des Nutriments
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" />
              <Input
                type="search"
                placeholder="Rechercher un nutriment..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onPageChange(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={(value) => {
                onFilterCategoryChange(value);
                onPageChange(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categoryOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterMealType}
              onValueChange={(value) => {
                onFilterMealTypeChange(value);
                onPageChange(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type de repas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {mealTypeOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
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
                <TableHead>Nutriment</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Type de repas</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Protéines</TableHead>
                <TableHead>Glucides</TableHead>
                <TableHead>Lipides</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNutritions.map((n) => (
                <TableRow key={n.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="font-medium text-[#4A5568]">{n.name}</div>
                    <div className="text-xs text-[#4A5568] opacity-70">
                      ID: {n.id}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#4A5568]">{n.category}</TableCell>
                  <TableCell>
                    {n.meal_type_name ? (
                      <Badge
                        variant="outline"
                        className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                      >
                        {n.meal_type_name}
                      </Badge>
                    ) : (
                      <span className="text-[#4A5568] opacity-70">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[#4A5568]">
                    {n.calories_kcal} kcal
                  </TableCell>
                  <TableCell className="text-[#4A5568]">
                    {n.protein_g} g
                  </TableCell>
                  <TableCell className="text-[#4A5568]">
                    {n.carbohydrates_g} g
                  </TableCell>
                  <TableCell className="text-[#4A5568]">{n.fat_g} g</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectNutrition(n)}
                        className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
                      >
                        Voir détails
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => onDeleteNutrition(n)}
                        className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
                        aria-label="Supprimer le nutriment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedNutritions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-[#4A5568]">
                    {hasAnyNutrition
                      ? "Aucun nutriment ne correspond à vos filtres."
                      : "Aucun nutriment en base."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#4A5568]">
            {filteredCount === 0
              ? "Affichage 0 sur 0 nutriments"
              : `Affichage ${startIndex + 1}-${Math.min(
                  startIndex + itemsPerPage,
                  filteredCount
                )} sur ${filteredCount} nutriments`}
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
