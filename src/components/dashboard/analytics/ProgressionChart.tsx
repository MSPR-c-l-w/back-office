import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProgressionPoint } from "@/utils/interfaces/analytics";

interface Props {
  progressionData: ProgressionPoint[];
}

export const ProgressionChart = ({ progressionData }: Props) => {
  return (
    <div
      role="img"
      aria-describedby="progression-chart-summary"
      aria-label="Graphique de progression et satisfaction"
    >
      <LineChart data={progressionData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
        <XAxis dataKey="week" stroke="#334155" />
        <YAxis stroke="#334155" domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #CBD5E1",
          }}
          labelStyle={{ color: "#1F2937" }}
          formatter={(value: unknown, name: unknown) => {
            const metric = String(name ?? "");
            const n = typeof value === "number" ? value : Number(value);
            const safe = Number.isFinite(n) ? n : 0;
            return [`${Math.round(safe)} %`, metric];
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="progressionPercent"
          stroke="#1D4ED8"
          strokeWidth={3}
          name="Progression (%)"
          dot={{ fill: "#1D4ED8", r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="satisfactionPercent"
          stroke="#166534"
          strokeWidth={3}
          name="Satisfaction (%)"
          dot={{ fill: "#166534", r: 5 }}
        />
      </LineChart>
      <div id="progression-chart-summary" className="sr-only">
        <p>Résumé textuel de la progression et de la satisfaction.</p>
        <ul>
          {progressionData.map((item) => (
            <li key={item.week}>
              {item.week}: progression {item.progressionPercent} pour cent,
              satisfaction {item.satisfactionPercent} pour cent
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
