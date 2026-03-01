import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { KPIDataType } from "./mocks";

interface Props {
    kpi: KPIDataType
}

export const KpiCard = ({ kpi }: Props) => {
  return (
    <Card key={kpi.label}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#4A5568] opacity-70">{kpi.label}</p>
            <p className="text-2xl font-bold text-[#4A5568] mt-1">
              {kpi.value}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp
                className="w-4 h-4 flex-shrink-0"
                style={{ color: kpi.color }}
                aria-hidden="true"
              />
              <span
                className="text-sm font-semibold"
                style={{ color: kpi.color }}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${kpi.color}20` }}
          >
            <kpi.icon
              className="w-5 h-5"
              style={{ color: kpi.color }}
              aria-hidden="true"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
