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

function formatIsoDateLabel(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  } catch {
    return iso;
  }
}

export const EvolutionChart = ({ engagementData }: Props) => {
  return (
    <div
      role="img"
      aria-describedby="analytics-evolution-summary"
      aria-label="Graphique d’évolution de l’activité, des calories et des utilisateurs actifs"
    >
      <AreaChart
        data={engagementData}
        margin={{ top: 10, right: 70, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#B91C1C" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
        <XAxis
          dataKey="date"
          stroke="#334155"
          tickFormatter={formatIsoDateLabel}
        />
        <YAxis
          yAxisId="duration"
          stroke="#334155"
          tickFormatter={(v) => `${v}h`}
        />
        <YAxis
          yAxisId="calories"
          orientation="right"
          stroke="#334155"
          tickFormatter={(v) => `${Number(v).toLocaleString("fr-FR")}`}
          width={60}
        />
        <YAxis
          yAxisId="active"
          orientation="right"
          stroke="#0F766E"
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #CBD5E1",
          }}
          labelStyle={{ color: "#1F2937" }}
          labelFormatter={(value) => formatIsoDateLabel(String(value))}
          formatter={(value: unknown, name: unknown) => {
            const metric = String(name ?? "");
            const n = typeof value === "number" ? value : Number(value);
            const safe = Number.isFinite(n) ? n : 0;

            if (metric === "Durée (h)") return [`${safe.toFixed(1)} h`, metric];
            if (metric === "Calories")
              return [
                `${Math.round(safe).toLocaleString("fr-FR")} kcal`,
                metric,
              ];
            if (metric === "Utilisateurs actifs (%)")
              return [`${Math.round(safe)} %`, metric];

            return [String(value ?? ""), metric];
          }}
        />
        <Legend />
        <Area
          yAxisId="duration"
          type="monotone"
          dataKey="totalDurationHours"
          stroke="#1D4ED8"
          strokeWidth={2}
          fill="url(#colorDuration)"
          name="Durée (h)"
        />
        <Area
          yAxisId="calories"
          type="monotone"
          dataKey="totalCalories"
          stroke="#B91C1C"
          strokeWidth={2}
          fill="url(#colorCalories)"
          name="Calories"
        />
        <Line
          yAxisId="active"
          type="monotone"
          dataKey="activeUsersPercent"
          stroke="#0F766E"
          strokeWidth={3}
          name="Utilisateurs actifs (%)"
          dot={{ fill: "#0F766E", r: 4 }}
        />
      </AreaChart>
      <div id="analytics-evolution-summary" className="sr-only">
        <p>Résumé textuel de l’évolution des métriques.</p>
        <ul>
          {engagementData.map((item) => (
            <li key={item.date}>
              {formatIsoDateLabel(item.date)}: {item.totalDurationHours} heures
              d&apos;activité, {item.totalCalories} calories,{" "}
              {item.activeUsersPercent}% d&apos;utilisateurs actifs
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
