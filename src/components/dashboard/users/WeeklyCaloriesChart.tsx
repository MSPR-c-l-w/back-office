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

type Props = { data: UserMetrics["weeklyCalories"] };

export function WeeklyCaloriesChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bilan Calorique (4 dernières semaines)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" stroke="#4A5568" />
            <YAxis stroke="#4A5568" />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
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
      </CardContent>
    </Card>
  );
}
