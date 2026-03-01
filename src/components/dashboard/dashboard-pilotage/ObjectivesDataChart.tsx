import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ObjectivesDataType } from "./mocks";

interface Props {
  objectivesData: ObjectivesDataType[];
}

export const ObjectivesDataChart = ({ objectivesData }: Props) => {
  return (
    <PieChart>
      <Pie
        data={objectivesData}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        label={(entry) => entry.name}
      >
        {objectivesData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
      />
    </PieChart>
  );
};
