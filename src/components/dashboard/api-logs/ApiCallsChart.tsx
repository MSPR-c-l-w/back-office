import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiCallType } from "./mocks";
import { useState } from "react";

interface Props {
  apiCallsData: ApiCallType[];
}

export const ApiCallsChart = ({ apiCallsData }: Props) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monitoring des Appels API REST</CardTitle>
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger
              className="w-32"
              aria-label="Sélectionner la période d’analyse des appels API"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7j">7j</SelectItem>
              <SelectItem value="30j">30j</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div
          role="img"
          aria-describedby="api-calls-chart-summary"
          aria-label="Graphique des appels API, erreurs et latence"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiCallsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="time" stroke="#334155" />
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
              <Bar
                yAxisId="left"
                dataKey="calls"
                fill="#1D4ED8"
                name="Appels"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="errors"
                fill="#B91C1C"
                name="Erreurs"
                radius={[8, 8, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="latency"
                stroke="#0F766E"
                strokeWidth={3}
                name="Latence (ms)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div id="api-calls-chart-summary" className="sr-only">
          <p>Résumé textuel des appels API.</p>
          <ul>
            {apiCallsData.map((item) => (
              <li key={item.time}>
                {item.time}: {item.calls} appels, {item.errors} erreurs, latence{" "}
                {item.latency} millisecondes
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
