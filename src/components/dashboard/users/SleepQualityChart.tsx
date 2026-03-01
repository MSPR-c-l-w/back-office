import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { UserMetrics } from "./mocks";

type Props = { data: UserMetrics["sleepQuality"] };

export function SleepQualityChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualité du Sommeil (7 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" stroke="#4A5568" />
            <YAxis yAxisId="left" stroke="#4A5568" />
            <YAxis yAxisId="right" orientation="right" stroke="#4A5568" />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="hours"
              stroke="#7FD8BE"
              strokeWidth={3}
              name="Heures"
              dot={{ fill: "#7FD8BE", r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="quality"
              stroke="#4A90E2"
              strokeWidth={3}
              name="Qualité (%)"
              dot={{ fill: "#4A90E2", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
