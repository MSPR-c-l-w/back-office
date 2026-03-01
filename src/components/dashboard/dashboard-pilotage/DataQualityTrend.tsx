import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataQualityTrendType } from "./mocks";

interface Props {
  dataQualityTrend: DataQualityTrendType[];
}

export const DataQualityTrend = ({ dataQualityTrend }: Props) => {
  return (
    <LineChart data={dataQualityTrend}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
      <XAxis dataKey="date" stroke="#4A5568" />
      <YAxis stroke="#4A5568" domain={[95, 100]} />
      <Tooltip
        contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
        labelStyle={{ color: "#4A5568" }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="quality"
        stroke="#4A90E2"
        strokeWidth={3}
        name="Qualité (%)"
        dot={{ fill: "#4A90E2", r: 4 }}
      />
    </LineChart>
  );
};
