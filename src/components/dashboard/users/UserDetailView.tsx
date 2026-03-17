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
import type { CSSProperties } from "react";

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
  onEdit?: () => void;
  onDelete?: () => void;
}

export function UserDetailView({
  user,
  onBack,
  onEdit,
  onDelete,
}: UserDetailViewProps) {
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
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#4A90E2] hover:text-[#3a7bc8] hover:bg-[#4A90E2] hover:bg-opacity-10"
            aria-label="Retour à la liste des utilisateurs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Retour à la liste
          </Button>
          {onEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onEdit}
                className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
              >
                Modifier
              </Button>
              {onDelete && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
                >
                  Supprimer
                </Button>
              )}
            </div>
          )}
        </div>
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
              <p className="mt-2 text-[#475569]">
                {user.email} • Membre depuis le {user.joinDate}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge
                  className={
                    user.plan === "Premium"
                      ? "bg-[#166534] text-white hover:bg-[#166534]"
                      : user.plan === "B2B"
                        ? "bg-[#0F766E] text-white hover:bg-[#0F766E]"
                        : "bg-[#475569] text-white hover:bg-[#475569]"
                  }
                >
                  {user.plan}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    user.status === "active"
                      ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
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
              <div className="text-sm text-[#475569]">Âge</div>
              <div className="text-2xl font-bold text-[#4A5568] mt-1">
                {user.age} ans
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#475569]">Genre</div>
              <div className="text-2xl font-bold text-[#4A5568] mt-1">
                {user.gender === "F" ? "Féminin" : "Masculin"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#475569]">Objectif</div>
              <div className="text-lg font-semibold text-[#4A5568] mt-1">
                {user.objective}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-[#475569]">Dernière activité</div>
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
                  <div className="text-sm text-[#475569]">Pas Moyens</div>
                  <div className="text-3xl font-bold text-[#4A5568] mt-2">
                    {metrics.currentMetrics.avgSteps.toLocaleString()}
                  </div>
                  <p className="mt-1 text-sm text-[#475569]">pas/jour</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#DBEAFE]">
                  <Activity
                    className="w-6 h-6 text-[#1D4ED8]"
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
                  <div className="text-sm text-[#475569]">
                    Calories Moyennes
                  </div>
                  <div className="text-3xl font-bold text-[#4A5568] mt-2">
                    {metrics.currentMetrics.avgCalories}
                  </div>
                  <p className="mt-1 text-sm text-[#475569]">kcal/jour</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FEE2E2]">
                  <Activity
                    className="w-6 h-6 text-[#B91C1C]"
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
                  <div className="text-sm text-[#475569]">
                    Progression Objectif
                  </div>
                  <div className="text-3xl font-bold text-[#4A5568] mt-2">
                    {metrics.currentMetrics.goalProgress}%
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#DCFCE7]">
                  <Target
                    className="w-6 h-6 text-[#166534]"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <Progress
                value={metrics.currentMetrics.goalProgress}
                className="h-2"
                aria-label={`Progression de l'objectif : ${metrics.currentMetrics.goalProgress} pourcent`}
                style={{ "--progress-background": "#166534" } as CSSProperties}
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
                aria-describedby="user-daily-steps-summary"
                aria-label="Graphique en barres montrant l'activité quotidienne de l'utilisateur comparée à son objectif de 10000 pas sur les 7 derniers jours."
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.dailySteps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                    <XAxis dataKey="date" stroke="#334155" />
                    <YAxis stroke="#334155" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #CBD5E1",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="steps"
                      fill="#1D4ED8"
                      name="Pas"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="goal"
                      fill="#166534"
                      name="Objectif"
                      radius={[8, 8, 0, 0]}
                      opacity={0.3}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div id="user-daily-steps-summary" className="sr-only">
                <ul>
                  {metrics.dailySteps.map((item) => (
                    <li key={item.date}>
                      {item.date}: {item.steps} pas sur un objectif de{" "}
                      {item.goal}
                    </li>
                  ))}
                </ul>
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
                aria-describedby="user-weekly-calories-summary"
                aria-label="Graphique linéaire montrant les calories consommées et brûlées de l'utilisateur sur 4 semaines."
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.weeklyCalories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                    <XAxis dataKey="week" stroke="#334155" />
                    <YAxis stroke="#334155" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #CBD5E1",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumed"
                      stroke="#B91C1C"
                      strokeWidth={3}
                      name="Consommées"
                      dot={{ fill: "#B91C1C", r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="burned"
                      stroke="#166534"
                      strokeWidth={3}
                      name="Brûlées"
                      dot={{ fill: "#166534", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div id="user-weekly-calories-summary" className="sr-only">
                <ul>
                  {metrics.weeklyCalories.map((item) => (
                    <li key={item.week}>
                      {item.week}: {item.consumed} calories consommées et{" "}
                      {item.burned} calories brûlées
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
