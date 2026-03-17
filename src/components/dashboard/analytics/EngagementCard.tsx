import { Card, CardContent } from "@/components/ui/card";
import { EngagementMetricType } from "./mocks";
import { TrendingUp } from "lucide-react";

interface Props {
  metric: EngagementMetricType;
}

export const EngagementCard = ({ metric }: Props) => {
  return (
    <Card key={metric.label}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-[#475569]">{metric.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-[#4A5568]">
                {metric.value}
              </p>
              <span className="text-sm text-[#475569]">{metric.unit}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp
                className="w-4 h-4"
                style={{ color: metric.color }}
                aria-hidden="true"
              />
              <span
                className="text-sm font-semibold"
                style={{ color: "#1F2937" }}
              >
                {metric.trend}
              </span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${metric.color}20` }}
          >
            <metric.icon
              className="w-6 h-6"
              style={{ color: metric.color }}
              aria-hidden="true"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
