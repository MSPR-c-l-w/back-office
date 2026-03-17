import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopExerciseStats } from "@/utils/exercisesApi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PIE_COLORS = ["#4A90E2", "#5CC58C", "#7FD8BE", "#FF887B", "#A855F7"];

type Props = {
  items: TopExerciseStats[];
  loading?: boolean;
};

const chartDataFromItems = (items: TopExerciseStats[]) =>
  items.map((item, index) => ({
    name: item.exerciseName,
    value: item.count,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

export function TopExercisesCard({ items, loading }: Props) {
  const chartData = chartDataFromItems(items);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exercices les plus pratiqués</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-[#4A5568] opacity-70">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[#4A5568] opacity-70">
            Aucune donnée disponible.
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                  }}
                  formatter={(value?: number) => [
                    `${value ?? 0} séance${(value ?? 0) > 1 ? "s" : ""}`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden
                    />
                    <span className="text-sm text-[#4A5568]">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#4A5568]">
                    {item.value.toLocaleString()} séance
                    {item.value > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
