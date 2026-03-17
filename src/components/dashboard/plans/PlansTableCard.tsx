import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Plan } from "@/utils/interfaces/plan";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  paginatedPlans: Plan[];
  filteredCount: number;
  /** True s'il existe au moins un plan en base (avant filtres) */
  hasAnyPlan: boolean;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onCreatePlan: () => void;
  onSelectPlan: (plan: Plan) => void;
  onDeletePlan: (plan: Plan) => void;
};

export function PlansTableCard({
  searchQuery,
  onSearchChange,
  paginatedPlans,
  filteredCount,
  hasAnyPlan,
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onPageChange,
  onCreatePlan,
  onSelectPlan,
  onDeletePlan,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-[#4A5568]">
            Liste des Plans
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-72">
              <label htmlFor="plans-search" className="sr-only">
                Rechercher un plan
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" />
              <Input
                id="plans-search"
                type="search"
                placeholder="Rechercher un plan..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onPageChange(1);
                }}
                className="pl-10"
              />
            </div>
            <Button
              onClick={onCreatePlan}
              className="bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableCaption className="sr-only">
              Tableau des plans avec prix, fonctionnalités et actions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Fonctionnalités</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlans.map((plan) => {
                const shown = plan.features.slice(0, 2);
                const extra = plan.features.length - shown.length;
                return (
                  <TableRow key={plan.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="font-medium text-[#4A5568]">
                        {plan.name}
                      </div>
                      <div className="text-xs text-[#4A5568] opacity-70">
                        ID: {plan.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">
                      {formatPrice(plan.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {shown.map((f, idx) => (
                          <Badge
                            key={`${plan.id}-${idx}`}
                            variant="outline"
                            className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                          >
                            {f}
                          </Badge>
                        ))}
                        {extra > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 border-gray-300"
                          >
                            +{extra}
                          </Badge>
                        )}
                        {plan.features.length === 0 && (
                          <span className="text-sm text-[#4A5568] opacity-70">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectPlan(plan)}
                          className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
                        >
                          Voir détails
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => onDeletePlan(plan)}
                          className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
                          aria-label="Supprimer le plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginatedPlans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-[#4A5568]">
                    {hasAnyPlan
                      ? "Aucun plan ne correspond à vos filtres."
                      : "Aucun plan créé."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#4A5568]">
            {filteredCount === 0
              ? "Affichage 0 sur 0 plans"
              : `Affichage ${startIndex + 1}-${Math.min(
                  startIndex + itemsPerPage,
                  filteredCount
                )} sur ${filteredCount} plans`}
          </p>
          <nav
            className="flex items-center gap-2"
            aria-label="Pagination des plans"
          >
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
                    aria-current={currentPage === pageNum ? "page" : undefined}
                    aria-label={`Aller à la page ${pageNum}`}
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
          </nav>
        </div>
      </CardContent>
    </Card>
  );
}
