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
    <div
      role="img"
      aria-describedby="analytics-evolution-summary"
      aria-label="Graphique d’évolution des pas, calories et sommeil"
    >
      <AreaChart data={engagementData}>
        <defs>
          <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#B91C1C" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
        <XAxis dataKey="date" stroke="#334155" />
        <YAxis yAxisId="left" stroke="#334155" />
        <YAxis yAxisId="right" orientation="right" stroke="#334155" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #CBD5E1",
          }}
          labelStyle={{ color: "#1F2937" }}
        />
        <Legend />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="steps"
          stroke="#1D4ED8"
          strokeWidth={2}
          fill="url(#colorSteps)"
          name="Pas"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="calories"
          stroke="#B91C1C"
          strokeWidth={2}
          fill="url(#colorCalories)"
          name="Calories"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="sleep"
          stroke="#0F766E"
          strokeWidth={3}
          name="Sommeil (h)"
          dot={{ fill: "#0F766E", r: 4 }}
        />
      </AreaChart>
      <div id="analytics-evolution-summary" className="sr-only">
        <p>Résumé textuel de l’évolution des métriques.</p>
        <ul>
          {engagementData.map((item) => (
            <li key={item.date}>
              {item.date}: {item.steps} pas, {item.calories} calories,{" "}
              {item.sleep} heures de sommeil
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
