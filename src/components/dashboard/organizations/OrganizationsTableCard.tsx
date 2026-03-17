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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Organization } from "@/utils/interfaces/organization";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

function formatDate(value: unknown) {
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  typeOptions: string[];
  paginatedOrganizations: Organization[];
  filteredCount: number;
  /** True s'il existe au moins une organisation en base (avant filtres / pagination) */
  hasAnyOrganization: boolean;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onCreateOrganization: () => void;
  onSelectOrganization: (organization: Organization) => void;
  onDeleteOrganization: (organization: Organization) => void;
};

export function OrganizationsTableCard({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  typeOptions,
  paginatedOrganizations,
  filteredCount,
  hasAnyOrganization,
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onPageChange,
  onCreateOrganization,
  onSelectOrganization,
  onDeleteOrganization,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-[#4A5568]">
            Liste des Organisations
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <label htmlFor="organizations-search" className="sr-only">
                Rechercher une organisation
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" />
              <Input
                id="organizations-search"
                type="search"
                placeholder="Rechercher une organisation..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onPageChange(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value) => {
                onFilterTypeChange(value);
                onPageChange(1);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Filtrer les organisations par type"
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={onCreateOrganization}
              className="bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle organisation
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableCaption className="sr-only">
              Tableau des organisations avec type, branding, statut et actions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Organisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branding</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créée</TableHead>
                <TableHead>Mise à jour</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrganizations.map((org) => {
                const logoUrl = org.branding_config?.logoUrl;
                const primaryColor = org.branding_config?.primaryColor;
                const initials = org.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join("");

                return (
                  <TableRow key={org.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={logoUrl}
                            alt=""
                            aria-hidden="true"
                          />
                          <AvatarFallback className="bg-[#4A90E2] text-white">
                            {initials || "OR"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#4A5568]">
                            {org.name}
                          </div>
                          <div className="text-xs text-[#4A5568] opacity-70">
                            ID: {org.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">{org.type}</TableCell>
                    <TableCell className="text-[#4A5568]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={{
                              backgroundColor: primaryColor ?? "transparent",
                            }}
                          />
                          <span className="text-xs">{primaryColor ?? "—"}</span>
                        </div>
                        {logoUrl ? (
                          <a
                            className="text-xs text-[#4A90E2] hover:underline truncate max-w-56"
                            href={logoUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Ouvrir le logo de l’organisation dans un nouvel onglet"
                          >
                            {logoUrl}
                          </a>
                        ) : (
                          <span className="text-xs opacity-70">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          org.is_active
                            ? "bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]"
                            : "bg-gray-200 text-gray-600 border-gray-300"
                        }
                      >
                        {org.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#4A5568] text-sm">
                      {formatDate(org.created_at)}
                    </TableCell>
                    <TableCell className="text-[#4A5568] text-sm">
                      {formatDate(org.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectOrganization(org)}
                          className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
                        >
                          Voir détails
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => onDeleteOrganization(org)}
                          className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
                          aria-label="Supprimer l'organisation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginatedOrganizations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-[#4A5568]">
                    {hasAnyOrganization
                      ? "Aucune organisation ne correspond à vos filtres."
                      : "Aucune organisation créée."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#4A5568]">
            {filteredCount === 0
              ? "Affichage 0 sur 0 organisations"
              : `Affichage ${startIndex + 1}-${Math.min(
                  startIndex + itemsPerPage,
                  filteredCount
                )} sur ${filteredCount} organisations`}
          </p>
          <nav
            className="flex items-center gap-2"
            aria-label="Pagination des organisations"
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
