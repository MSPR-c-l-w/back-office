import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { ConversionChart } from "@/components/dashboard/analytics/ConversionChart";
import { ConversionLegend } from "@/components/dashboard/analytics/ConversionLegend";
import { EngagementCard } from "@/components/dashboard/analytics/EngagementCard";
import { EvolutionChart } from "@/components/dashboard/analytics/EvolutionChart";
import {
  conversionData,
  engagementData,
  engagementMetrics,
  nutritionTrends,
  progressionData,
} from "@/components/dashboard/analytics/mocks";
import { NutritionTrendsTable } from "@/components/dashboard/analytics/NutritionTrendsTable";
import { ProgressionChart } from "@/components/dashboard/analytics/ProgressionChart";
import { PageLayout } from "@/components/layout/PageLayout";

const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>
            Évolution de l&apos;Engagement (7 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <EvolutionChart engagementData={engagementData} />
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Répartition Démographique & Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ConversionChart conversionData={conversionData} />
            </ResponsiveContainer>
            <ConversionLegend items={conversionData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Tendances Nutritionnelles par Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <NutritionTrendsTable nutritionTrends={nutritionTrends} />
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
