import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EngagementTimeseriesPoint } from "@/utils/interfaces/analytics";

interface Props {
  engagementData: EngagementTimeseriesPoint[];
}

export const EvolutionChart = ({ engagementData }: Props) => {
  return (
    <AreaChart data={engagementData}>
      <defs>
        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FF887B" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#FF887B" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#7FD8BE" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#7FD8BE" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
      <XAxis dataKey="date" stroke="#4A5568" />
      <YAxis yAxisId="left" stroke="#4A5568" />
      <YAxis yAxisId="right" orientation="right" stroke="#4A5568" />
      <Tooltip
        contentStyle={{
          backgroundColor: "white",
          border: "1px solid #E2E8F0",
        }}
        labelStyle={{ color: "#4A5568" }}
      />
      <Legend />
      <Area
        yAxisId="left"
        type="monotone"
        dataKey="totalDurationHours"
        stroke="#4A90E2"
        strokeWidth={2}
        fill="url(#colorSteps)"
        name="Durée totale (h)"
      />
      <Area
        yAxisId="left"
        type="monotone"
        dataKey="totalCalories"
        stroke="#FF887B"
        strokeWidth={2}
        fill="url(#colorCalories)"
        name="Calories"
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="activeUsersPercent"
        stroke="#7FD8BE"
        strokeWidth={3}
        name="Utilisateurs actifs (%)"
        dot={{ fill: "#7FD8BE", r: 4 }}
      />
    </AreaChart>
  );
};
