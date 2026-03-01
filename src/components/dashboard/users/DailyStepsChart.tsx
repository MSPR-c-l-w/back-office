import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { UserMetrics } from "./mocks";

type Props = { data: UserMetrics["dailySteps"] };

export function DailyStepsChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Quotidienne (7 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
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
      </CardContent>
    </Card>
  );
}
