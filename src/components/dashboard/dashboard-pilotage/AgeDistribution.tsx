import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
} from "recharts";
import { AgeDistributionType } from "./mocks";

interface Props {
  ageDistribution: AgeDistributionType[];
}

export const AgeDistribution = ({ ageDistribution }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par Âge</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ageDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#4A5568" />
            <YAxis stroke="#4A5568" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
              }}
              labelStyle={{ color: "#4A5568" }}
            />
            <Bar
              dataKey="value"
              fill="#4A90E2"
              name="Utilisateurs"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
