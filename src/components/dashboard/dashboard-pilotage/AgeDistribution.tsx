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
        <div
          role="img"
          aria-describedby="age-distribution-summary"
          aria-label="Graphique de répartition des utilisateurs par tranche d’âge"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="name" stroke="#334155" />
              <YAxis stroke="#334155" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #CBD5E1",
                }}
                labelStyle={{ color: "#1F2937" }}
              />
              <Bar
                dataKey="value"
                fill="#1D4ED8"
                name="Utilisateurs"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div id="age-distribution-summary" className="sr-only">
          <p>Résumé textuel de la répartition par âge.</p>
          <ul>
            {ageDistribution.map((item) => (
              <li key={item.name}>
                {item.name}: {item.value} utilisateurs
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
