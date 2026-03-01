import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserMetrics } from "./mocks";
import type { UserListItem } from "./mocks";
import { DailyStepsChart } from "./DailyStepsChart";
import { SleepQualityChart } from "./SleepQualityChart";
import { UserMetricsSummary } from "./UserMetricsSummary";
import { WeeklyCaloriesChart } from "./WeeklyCaloriesChart";

type Props = {
  user: UserListItem | null;
  onClose: () => void;
};

export function UserDetailModal({ user, onClose }: Props) {
  if (!user) return null;

  const metrics = getUserMetrics(user.id);

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-[#4A90E2] text-white text-xl">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{user.name}</DialogTitle>
              <DialogDescription>
                {user.email} • Membre depuis le {user.joinDate}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Âge</div>
                <div className="text-2xl font-bold text-[#4A5568] mt-1">{user.age} ans</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Objectif</div>
                <div className="text-lg font-semibold text-[#4A5568] mt-1">{user.objective}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Plan</div>
                <Badge className="mt-2 bg-[#5CC58C] hover:bg-[#5CC58C]">{user.plan}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Statut</div>
                <Badge
                  className="mt-2"
                  variant={user.status === "active" ? "default" : "secondary"}
                >
                  {user.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <UserMetricsSummary metrics={metrics} />

          <DailyStepsChart data={metrics.dailySteps} />
          <WeeklyCaloriesChart data={metrics.weeklyCalories} />
          <SleepQualityChart data={metrics.sleepQuality} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
