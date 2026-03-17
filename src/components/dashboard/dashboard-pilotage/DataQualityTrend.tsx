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
    <div
      role="img"
      aria-describedby="data-quality-trend-summary"
      aria-label="Graphique d’évolution de la qualité des données"
    >
      <LineChart data={dataQualityTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
        <XAxis dataKey="date" stroke="#334155" />
        <YAxis stroke="#334155" domain={[95, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #CBD5E1",
          }}
          labelStyle={{ color: "#1F2937" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="quality"
          stroke="#1D4ED8"
          strokeWidth={3}
          name="Qualité (%)"
          dot={{ fill: "#1D4ED8", r: 4 }}
        />
      </LineChart>
      <div id="data-quality-trend-summary" className="sr-only">
        <p>Résumé textuel de la qualité des données.</p>
        <ul>
          {dataQualityTrend.map((item) => (
            <li key={item.date}>
              {item.date}: {item.quality} pour cent
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
