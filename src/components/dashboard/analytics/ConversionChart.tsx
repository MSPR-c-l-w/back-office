import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ConversionType } from "./mocks";

interface Props {
    conversionData: ConversionType[]
}

export const ConversionChart = ({ conversionData }: Props) => {
  return (
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
          border: "1px solid #E2E8F0",
        }}
      />
    </PieChart>
  );
};
