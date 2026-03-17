import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ConversionType } from "./mocks";

interface Props {
  conversionData: ConversionType[];
}

export const ConversionChart = ({ conversionData }: Props) => {
  return (
    <div
      role="img"
      aria-describedby="conversion-chart-summary"
      aria-label="Graphique de répartition des conversions"
    >
      <PieChart>
        <Pie
          data={conversionData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={5}
          dataKey="value"
          label={(entry) => `${entry.name}: ${entry.value}`}
        >
          {conversionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #CBD5E1",
          }}
        />
      </PieChart>
      <div id="conversion-chart-summary" className="sr-only">
        <p>Résumé textuel des conversions.</p>
        <ul>
          {conversionData.map((item) => (
            <li key={item.name}>
              {item.name}: {item.value} utilisateurs
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
