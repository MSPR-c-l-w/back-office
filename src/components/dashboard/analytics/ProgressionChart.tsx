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
    <LineChart data={progressionData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
      <XAxis dataKey="week" stroke="#4A5568" />
      <YAxis stroke="#4A5568" domain={[0, 100]} />
      <Tooltip
        contentStyle={{
          backgroundColor: "white",
          border: "1px solid #E2E8F0",
        }}
        labelStyle={{ color: "#4A5568" }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="progressionPercent"
        stroke="#4A90E2"
        strokeWidth={3}
        name="Progression (%)"
        dot={{ fill: "#4A90E2", r: 5 }}
      />
      <Line
        type="monotone"
        dataKey="satisfactionPercent"
        stroke="#5CC58C"
        strokeWidth={3}
        name="Satisfaction (%)"
        dot={{ fill: "#5CC58C", r: 5 }}
      />
    </LineChart>
  );
};
