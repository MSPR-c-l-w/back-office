import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Activity, Target } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Progress } from "@/components/ui/progress";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  objective: string;
  plan: "Freemium" | "Premium" | "B2B";
  status: "active" | "inactive";
  joinDate: string;
  lastActivity: string;
  avatar?: string;
}

interface UserDetailViewProps {
  user: User;
  onBack: () => void;
}

export function UserDetailView({ user, onBack }: UserDetailViewProps) {
  // Mock user metrics data
  const getUserMetrics = (userId: number) => {
    const baseValue = userId * 137;
    return {
      dailySteps: [
        { date: "Lun", steps: 7000 + (baseValue % 3000), goal: 10000 },
        { date: "Mar", steps: 8500 + (baseValue % 2500), goal: 10000 },
        { date: "Mer", steps: 9200 + (baseValue % 1800), goal: 10000 },
        { date: "Jeu", steps: 10500 + (baseValue % 2000), goal: 10000 },
        { date: "Ven", steps: 11200 + (baseValue % 1500), goal: 10000 },
        { date: "Sam", steps: 8900 + (baseValue % 2200), goal: 10000 },
        { date: "Dim", steps: 7500 + (baseValue % 2800), goal: 10000 },
      ],
      weeklyCalories: [
        {
          week: "S1",
          consumed: 1800 + (baseValue % 400),
          burned: 2100 + (baseValue % 300),
        },
        {
          week: "S2",
          consumed: 1950 + (baseValue % 350),
          burned: 2200 + (baseValue % 250),
        },
        {
          week: "S3",
          consumed: 1900 + (baseValue % 300),
          burned: 2300 + (baseValue % 200),
        },
        {
          week: "S4",
          consumed: 2000 + (baseValue % 250),
          burned: 2400 + (baseValue % 150),
        },
      ],
      currentMetrics: {
        avgSteps: 9200 + (baseValue % 2000),
        avgCalories: 2150 + (baseValue % 300),
        goalProgress: 68 + (baseValue % 30),
      },
    };
  };

  const metrics = getUserMetrics(user.id);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#4A90E2] hover:text-[#3a7bc8] hover:bg-[#4A90E2] hover:bg-opacity-10"
          aria-label="Retour à la liste des utilisateurs"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Retour à la liste
        </Button>
      </div>

      {/* User Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={user.avatar}
                alt={`Photo de profil de ${user.name}`}
              />
              <AvatarFallback className="bg-[#4A90E2] text-white text-3xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#4A5568]">{user.name}</h2>
              <p className="text-[#4A5568] opacity-70 mt-2">
                {user.email} • Membre depuis le {user.joinDate}
              </p>
              <div className="flex items-center gap-3 mt-3">
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Info Cards */}
      <section aria-labelledby="user-info-section">
        <h3
          id="user-info-section"
          className="text-lg font-semibold text-[#4A5568] mb-6"
        >
          Informations Générales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#4A5568] opacity-70">Âge</div>
              <div className="text-2xl font-bold text-[#4A5568] mt-1">
                {user.age} ans
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#4A5568] opacity-70">Genre</div>
              <div className="text-2xl font-bold text-[#4A5568] mt-1">
                {user.gender === "F" ? "Féminin" : "Masculin"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#4A5568] opacity-70">Objectif</div>
              <div className="text-lg font-semibold text-[#4A5568] mt-1">
                {user.objective}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#4A5568] opacity-70">
                Dernière activité
              </div>
              <div className="text-lg font-semibold text-[#4A5568] mt-1">
                {user.lastActivity}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics Summary */}
      <section aria-labelledby="metrics-section">
        <h3
          id="metrics-section"
          className="text-lg font-semibold text-[#4A5568] mb-6"
        >
          Métriques de Santé
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Pas Moyens
                  </div>
                  <div className="text-3xl font-bold text-[#4A5568] mt-2">
                    {metrics.currentMetrics.avgSteps.toLocaleString()}
                  </div>
                  <p className="text-sm text-[#4A5568] opacity-70 mt-1">
                    pas/jour
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#4A90E2] bg-opacity-10 flex items-center justify-center">
                  <Activity
                    className="w-6 h-6 text-[#4A90E2]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Calories Moyennes
                  </div>
                  <div className="text-3xl font-bold text-[#4A5568] mt-2">
                    {metrics.currentMetrics.avgCalories}
                  </div>
                  <p className="text-sm text-[#4A5568] opacity-70 mt-1">
                    kcal/jour
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#FF887B] bg-opacity-10 flex items-center justify-center">
                  <Activity
                    className="w-6 h-6 text-[#FF887B]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Progression Objectif
                  </div>
                  <div className="text-3xl font-bold text-[#4A5568] mt-2">
                    {metrics.currentMetrics.goalProgress}%
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#5CC58C] bg-opacity-10 flex items-center justify-center">
                  <Target
                    className="w-6 h-6 text-[#5CC58C]"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <Progress
                value={metrics.currentMetrics.goalProgress}
                className="h-2"
                aria-label={`Progression de l'objectif : ${metrics.currentMetrics.goalProgress} pourcent`}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts */}
      <section aria-labelledby="charts-section">
        <h3
          id="charts-section"
          className="text-lg font-semibold text-[#4A5568] mb-6"
        >
          Analyses d&apos;Activité
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Activité Quotidienne (7 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                role="img"
                aria-label="Graphique en barres montrant l'activité quotidienne de l'utilisateur comparée à son objectif de 10000 pas sur les 7 derniers jours."
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.dailySteps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#4A5568" />
                    <YAxis stroke="#4A5568" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="steps"
                      fill="#4A90E2"
                      name="Pas"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="goal"
                      fill="#5CC58C"
                      name="Objectif"
                      radius={[8, 8, 0, 0]}
                      opacity={0.3}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Calories */}
          <Card>
            <CardHeader>
              <CardTitle>Bilan Calorique (4 dernières semaines)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                role="img"
                aria-label="Graphique linéaire montrant les calories consommées et brûlées de l'utilisateur sur 4 semaines."
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.weeklyCalories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="week" stroke="#4A5568" />
                    <YAxis stroke="#4A5568" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumed"
                      stroke="#FF887B"
                      strokeWidth={3}
                      name="Consommées"
                      dot={{ fill: "#FF887B", r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="burned"
                      stroke="#5CC58C"
                      strokeWidth={3}
                      name="Brûlées"
                      dot={{ fill: "#5CC58C", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
