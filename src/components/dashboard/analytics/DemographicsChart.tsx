import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import type { AgeBucket } from "@/utils/interfaces/analytics";

type Props = {
  buckets: AgeBucket[];
};

export function DemographicsChart({ buckets }: Props) {
  const data = buckets.map((b) => ({
    label: b.label,
    total: b.total,
    male: b.male,
    female: b.female,
    other: b.other,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} stackOffset="none">
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="label" stroke="#4A5568" />
        <YAxis stroke="#4A5568" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
          }}
          labelStyle={{ color: "#4A5568" }}
        />
        <Legend />
        <Bar dataKey="male" stackId="gender" fill="#4A90E2" name="Hommes" />
        <Bar dataKey="female" stackId="gender" fill="#FF887B" name="Femmes" />
        <Bar
          dataKey="other"
          stackId="gender"
          fill="#A0AEC0"
          name="Autres / Non spécifié"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
