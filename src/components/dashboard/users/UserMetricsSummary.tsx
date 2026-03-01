import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Target } from "lucide-react";
import type { UserMetrics } from "./mocks";

type Props = { metrics: UserMetrics };

export function UserMetricsSummary({ metrics }: Props) {
  const { currentMetrics } = metrics;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <Activity className="w-8 h-8 text-[#4A90E2] mb-2" />
          <div className="text-sm text-[#4A5568] opacity-70">Pas Moyens</div>
          <div className="text-2xl font-bold text-[#4A5568] mt-1">
            {currentMetrics.avgSteps.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Activity className="w-8 h-8 text-[#FF887B] mb-2" />
          <div className="text-sm text-[#4A5568] opacity-70">Calories/jour</div>
          <div className="text-2xl font-bold text-[#4A5568] mt-1">
            {currentMetrics.avgCalories}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Activity className="w-8 h-8 text-[#7FD8BE] mb-2" />
          <div className="text-sm text-[#4A5568] opacity-70">Sommeil Moyen</div>
          <div className="text-2xl font-bold text-[#4A5568] mt-1">
            {currentMetrics.avgSleep}h
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Target className="w-8 h-8 text-[#5CC58C] mb-2" />
          <div className="text-sm text-[#4A5568] opacity-70">Progression</div>
          <div className="text-2xl font-bold text-[#4A5568] mt-1">
            {currentMetrics.goalProgress}%
          </div>
          <Progress value={currentMetrics.goalProgress} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
