import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Search, Filter, ChevronLeft, ChevronRight, Activity, TrendingUp, Target, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from './ui/progress';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  objective: string;
  plan: 'Freemium' | 'Premium' | 'B2B';
  status: 'active' | 'inactive';
  joinDate: string;
  lastActivity: string;
  avatar?: string;
}

export function UsersView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const itemsPerPage = 10;

  // Mock users data
  const allUsers: User[] = Array.from({ length: 127 }, (_, i) => ({
    id: i + 1,
    name: `${['Marie', 'Pierre', 'Sophie', 'Thomas', 'Julie', 'Alexandre', 'Emma', 'Lucas', 'Camille', 'Nicolas'][i % 10]} ${['Dubois', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Leroy', 'Moreau', 'Simon'][Math.floor(i / 10) % 10]}`,
    email: `user${i + 1}@healthai.com`,
    age: 18 + (i % 50),
    gender: i % 2 === 0 ? 'F' : 'M',
    objective: ['Perte de poids', 'Prise de masse', 'Bien-être', 'Performance'][i % 4],
    plan: ['Freemium', 'Premium', 'B2B'][i % 3] as 'Freemium' | 'Premium' | 'B2B',
    status: i % 7 === 0 ? 'inactive' : 'active',
    joinDate: new Date(2024, Math.floor(i / 20), (i % 28) + 1).toLocaleDateString('fr-FR'),
    lastActivity: `Il y a ${(i % 24) + 1}h`,
  }));

  // Filter users
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Mock user metrics data
  const getUserMetrics = (userId: number) => {
    const baseValue = userId * 137; // Pour varier les données
    return {
      dailySteps: [
        { date: 'Lun', steps: 7000 + (baseValue % 3000), goal: 10000 },
        { date: 'Mar', steps: 8500 + (baseValue % 2500), goal: 10000 },
        { date: 'Mer', steps: 9200 + (baseValue % 1800), goal: 10000 },
        { date: 'Jeu', steps: 10500 + (baseValue % 2000), goal: 10000 },
        { date: 'Ven', steps: 11200 + (baseValue % 1500), goal: 10000 },
        { date: 'Sam', steps: 8900 + (baseValue % 2200), goal: 10000 },
        { date: 'Dim', steps: 7500 + (baseValue % 2800), goal: 10000 },
      ],
      weeklyCalories: [
        { week: 'S1', consumed: 1800 + (baseValue % 400), burned: 2100 + (baseValue % 300) },
        { week: 'S2', consumed: 1950 + (baseValue % 350), burned: 2200 + (baseValue % 250) },
        { week: 'S3', consumed: 1900 + (baseValue % 300), burned: 2300 + (baseValue % 200) },
        { week: 'S4', consumed: 2000 + (baseValue % 250), burned: 2400 + (baseValue % 150) },
      ],
      sleepQuality: [
        { date: 'Lun', hours: 7.2, quality: 75 },
        { date: 'Mar', hours: 6.8, quality: 68 },
        { date: 'Mer', hours: 7.5, quality: 82 },
        { date: 'Jeu', hours: 8.0, quality: 88 },
        { date: 'Ven', hours: 7.3, quality: 78 },
        { date: 'Sam', hours: 8.5, quality: 90 },
        { date: 'Dim', hours: 7.8, quality: 85 },
      ],
      currentMetrics: {
        avgSteps: 9200 + (baseValue % 2000),
        avgCalories: 2150 + (baseValue % 300),
        avgSleep: 7.4 + (baseValue % 10) / 10,
        goalProgress: 68 + (baseValue % 30),
      }
    };
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
              Total Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4A5568]">{allUsers.length}</div>
            <p className="text-sm text-[#5CC58C] flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              +12.5% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
              Utilisateurs Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4A5568]">
              {allUsers.filter(u => u.status === 'active').length}
            </div>
            <p className="text-sm text-[#5CC58C] flex items-center gap-1 mt-2">
              <Activity className="w-4 h-4" />
              {((allUsers.filter(u => u.status === 'active').length / allUsers.length) * 100).toFixed(1)}% actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
              Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4A5568]">
              {allUsers.filter(u => u.plan === 'Premium').length}
            </div>
            <p className="text-sm text-[#4A90E2] flex items-center gap-1 mt-2">
              <Target className="w-4 h-4" />
              {((allUsers.filter(u => u.plan === 'Premium').length / allUsers.length) * 100).toFixed(1)}% conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
              B2B (Marque Blanche)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4A5568]">
              {allUsers.filter(u => u.plan === 'B2B').length}
            </div>
            <p className="text-sm text-[#7FD8BE] flex items-center gap-1 mt-2">
              <Clock className="w-4 h-4" />
              Entreprises clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={filterPlan} onValueChange={(value) => {
                setFilterPlan(value);
                setCurrentPage(1);
              }}>
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
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-[#4A90E2] text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#4A5568]">{user.name}</div>
                          <div className="text-xs text-[#4A5568] opacity-70">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">{user.email}</TableCell>
                    <TableCell className="text-[#4A5568]">{user.age} ans</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]">
                        {user.objective}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          user.plan === 'Premium' 
                            ? 'bg-[#5CC58C] hover:bg-[#5CC58C]' 
                            : user.plan === 'B2B'
                            ? 'bg-[#7FD8BE] hover:bg-[#7FD8BE]'
                            : 'bg-gray-400 hover:bg-gray-400'
                        }
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          user.status === 'active'
                            ? 'bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#4A5568] text-sm">{user.lastActivity}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                        className="text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
                      >
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[#4A5568]">
              Affichage {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
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
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "bg-[#4A90E2] hover:bg-[#4A90E2]/90" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={selectedUser?.avatar} />
                <AvatarFallback className="bg-[#4A90E2] text-white text-xl">
                  {selectedUser?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{selectedUser?.name}</DialogTitle>
                <DialogDescription>
                  {selectedUser?.email} • Membre depuis le {selectedUser?.joinDate}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-6">
              {/* User Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-[#4A5568] opacity-70">Âge</div>
                    <div className="text-2xl font-bold text-[#4A5568] mt-1">{selectedUser.age} ans</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-[#4A5568] opacity-70">Objectif</div>
                    <div className="text-lg font-semibold text-[#4A5568] mt-1">{selectedUser.objective}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-[#4A5568] opacity-70">Plan</div>
                    <Badge className="mt-2 bg-[#5CC58C] hover:bg-[#5CC58C]">
                      {selectedUser.plan}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-[#4A5568] opacity-70">Statut</div>
                    <Badge 
                      className="mt-2"
                      variant={selectedUser.status === 'active' ? 'default' : 'secondary'}
                    >
                      {selectedUser.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Metrics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(() => {
                  const metrics = getUserMetrics(selectedUser.id);
                  return (
                    <>
                      <Card>
                        <CardContent className="pt-6">
                          <Activity className="w-8 h-8 text-[#4A90E2] mb-2" />
                          <div className="text-sm text-[#4A5568] opacity-70">Pas Moyens</div>
                          <div className="text-2xl font-bold text-[#4A5568] mt-1">
                            {metrics.currentMetrics.avgSteps.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <Activity className="w-8 h-8 text-[#FF887B] mb-2" />
                          <div className="text-sm text-[#4A5568] opacity-70">Calories/jour</div>
                          <div className="text-2xl font-bold text-[#4A5568] mt-1">
                            {metrics.currentMetrics.avgCalories}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <Activity className="w-8 h-8 text-[#7FD8BE] mb-2" />
                          <div className="text-sm text-[#4A5568] opacity-70">Sommeil Moyen</div>
                          <div className="text-2xl font-bold text-[#4A5568] mt-1">
                            {metrics.currentMetrics.avgSleep}h
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <Target className="w-8 h-8 text-[#5CC58C] mb-2" />
                          <div className="text-sm text-[#4A5568] opacity-70">Progression</div>
                          <div className="text-2xl font-bold text-[#4A5568] mt-1">
                            {metrics.currentMetrics.goalProgress}%
                          </div>
                          <Progress value={metrics.currentMetrics.goalProgress} className="mt-2" />
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </div>

              {/* Charts */}
              {(() => {
                const metrics = getUserMetrics(selectedUser.id);
                return (
                  <>
                    {/* Daily Steps */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Activité Quotidienne (7 derniers jours)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={metrics.dailySteps}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="date" stroke="#4A5568" />
                            <YAxis stroke="#4A5568" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                            />
                            <Legend />
                            <Bar dataKey="steps" fill="#4A90E2" name="Pas" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="goal" fill="#5CC58C" name="Objectif" radius={[8, 8, 0, 0]} opacity={0.3} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Calories */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Bilan Calorique (4 dernières semaines)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={metrics.weeklyCalories}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="week" stroke="#4A5568" />
                            <YAxis stroke="#4A5568" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="consumed" 
                              stroke="#FF887B" 
                              strokeWidth={3}
                              name="Consommées"
                              dot={{ fill: '#FF887B', r: 5 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="burned" 
                              stroke="#5CC58C" 
                              strokeWidth={3}
                              name="Brûlées"
                              dot={{ fill: '#5CC58C', r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Sleep Quality */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Qualité du Sommeil (7 derniers jours)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={metrics.sleepQuality}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="date" stroke="#4A5568" />
                            <YAxis yAxisId="left" stroke="#4A5568" />
                            <YAxis yAxisId="right" orientation="right" stroke="#4A5568" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                            />
                            <Legend />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="hours" 
                              stroke="#7FD8BE" 
                              strokeWidth={3}
                              name="Heures"
                              dot={{ fill: '#7FD8BE', r: 5 }}
                            />
                            <Line 
                              yAxisId="right"
                              type="monotone" 
                              dataKey="quality" 
                              stroke="#4A90E2" 
                              strokeWidth={3}
                              name="Qualité (%)"
                              dot={{ fill: '#4A90E2', r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
