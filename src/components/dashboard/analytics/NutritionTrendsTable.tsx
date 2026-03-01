import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NutritionTrendType } from "./mocks";

interface Props {
  nutritionTrends: NutritionTrendType[];
}

export const NutritionTrendsTable = ({ nutritionTrends }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profil Alimentaire</TableHead>
          <TableHead className="text-right">Utilisateurs</TableHead>
          <TableHead className="text-right">Calories Moy.</TableHead>
          <TableHead className="text-right">Protéines Moy.</TableHead>
          <TableHead>Distribution</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nutritionTrends.map((trend, index) => {
          const totalUsers = nutritionTrends.reduce(
            (sum, t) => sum + t.users,
            0
          );
          const percentage = ((trend.users / totalUsers) * 100).toFixed(1);
          return (
            <TableRow key={index}>
              <TableCell className="font-medium text-[#4A5568]">
                {trend.profile}
              </TableCell>
              <TableCell className="text-right text-[#4A5568]">
                {trend.users.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-[#4A5568]">
                {trend.avgCalories} kcal
              </TableCell>
              <TableCell className="text-right text-[#4A5568]">
                {trend.avgProtein}g
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress value={parseFloat(percentage)} className="flex-1" />
                  <span className="text-sm font-semibold text-[#4A5568] w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
