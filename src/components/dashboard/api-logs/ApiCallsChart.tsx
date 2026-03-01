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
            <SelectTrigger className="w-32">
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={apiCallsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" stroke="#4A5568" />
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
            <Bar
              yAxisId="left"
              dataKey="calls"
              fill="#4A90E2"
              name="Appels"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="errors"
              fill="#FF887B"
              name="Erreurs"
              radius={[8, 8, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              stroke="#7FD8BE"
              strokeWidth={3}
              name="Latence (ms)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
