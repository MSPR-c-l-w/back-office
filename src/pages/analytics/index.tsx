import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
} from "recharts";
import {
  conversionData,
  engagementData,
  engagementMetrics,
  nutritionTrends,
  progressionData,
} from "@/components/dashboard/analytics/mocks";
import { EngagementCard } from "@/components/dashboard/analytics/EngagementCard";
import { EvolutionChart } from "@/components/dashboard/analytics/EvolutionChart";
import { ProgressionChart } from "@/components/dashboard/analytics/ProgressionChart";
import { ConversionChart } from "@/components/dashboard/analytics/ConversionChart";
import { NutritionTrendsTable } from "@/components/dashboard/analytics/NutritionTrendsTable";


const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <section aria-labelledby="engagement-metrics">
        <h3
          id="engagement-metrics"
          className="text-lg font-semibold text-[#4A5568] mb-4"
        >
          Indicateurs d&apos;Engagement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engagementMetrics.map((metric) => (
            <EngagementCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      {/* Engagement Evolution */}
      <Card>
        <CardHeader>
          <CardTitle>
            Évolution de l&apos;Engagement (7 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <EvolutionChart engagementData={engagementData}/>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Moyenne */}
        <Card>
          <CardHeader>
            <CardTitle>Progression Moyenne des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ProgressionChart progressionData={progressionData} />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Premium vs B2B */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition Démographique & Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ConversionChart conversionData={conversionData} />
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {conversionData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    ></div>
                    <span className="text-sm text-[#4A5568]">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#4A5568]">
                    {item.value.toLocaleString()} utilisateurs
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Trends */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tendances Nutritionnelles par Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <NutritionTrendsTable nutritionTrends={nutritionTrends}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

AnalyticsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Analytics Business">{page}</PageLayout>;
};

export default AnalyticsPage;