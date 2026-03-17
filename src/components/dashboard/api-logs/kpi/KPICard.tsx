import { Card, CardContent } from "@/components/ui/card";
import { KPICardType } from "../mocks";
import { TrendingUp } from "lucide-react";

interface Props {
  kpi: KPICardType;
}

export const KpiCard = ({ kpi }: Props) => {
  return (
    <Card key={kpi.label}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#475569]">{kpi.label}</p>
            <p className="text-3xl font-bold text-[#4A5568] mt-2">
              {kpi.value}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp
                className="w-4 h-4"
                style={{ color: kpi.color }}
                aria-hidden="true"
              />
              <span
                className="text-sm font-semibold"
                style={{ color: "#1F2937" }}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${kpi.color}20` }}
          >
            <kpi.icon
              className="w-6 h-6"
              style={{ color: kpi.color }}
              aria-hidden="true"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
