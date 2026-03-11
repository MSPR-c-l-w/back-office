import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { UserListItem } from "@/utils/types/users";

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPlan: string;
  onFilterPlanChange: (value: string) => void;
  paginatedUsers: UserListItem[];
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSelectUser: (user: UserListItem) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function UsersTableCard({
  searchQuery,
  onSearchChange,
  filterPlan,
  onFilterPlanChange,
  paginatedUsers,
  filteredCount,
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onPageChange,
  onSelectUser,
  loading,
  error,
  onRetry,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-[#4A5568]">
            Liste des Utilisateurs
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" />
              <Input
                type="search"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onPageChange(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={filterPlan}
              onValueChange={(value) => {
                onFilterPlanChange(value);
                onPageChange(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="Freemium">Freemium</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="B2B">B2B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 mb-4 flex items-center justify-between">
            <p className="text-sm text-red-800">{error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Réessayer
              </Button>
            )}
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Objectif</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-[#4A90E2] text-white">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-[#4A5568]">
                              {user.name}
                            </div>
                            <div className="text-xs text-[#4A5568] opacity-70">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#4A5568]">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-[#4A5568]">
                        {user.age} ans
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                        >
                          {user.objective}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.plan === "Premium"
                              ? "bg-[#5CC58C] hover:bg-[#5CC58C]"
                              : user.plan === "B2B"
                                ? "bg-[#7FD8BE] hover:bg-[#7FD8BE]"
                                : "bg-gray-400 hover:bg-gray-400"
                          }
                        >
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]"
                              : "bg-gray-200 text-gray-600 border-gray-300"
                          }
                        >
                          {user.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#4A5568] text-sm">
                        {user.lastActivity}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectUser(user)}
                          className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white focus-visible:ring-[#4A90E2]/50"
                        >
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#4A5568]">
            Affichage {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredCount)} sur{" "}
            {filteredCount} utilisateurs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-white text-[#4A5568] border-[#E2E8F0] hover:bg-gray-50 hover:text-[#4A5568]"
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
                        ? "bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90 hover:text-white"
                        : "bg-white text-[#4A5568] border-[#E2E8F0] hover:bg-gray-50 hover:text-[#4A5568]"
                    }
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
              disabled={currentPage === totalPages}
              className="bg-white text-[#4A5568] border-[#E2E8F0] hover:bg-gray-50 hover:text-[#4A5568]"
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
