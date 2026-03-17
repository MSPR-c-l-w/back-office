import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { ConversionChart } from "@/components/dashboard/analytics/ConversionChart";
import { ConversionLegend } from "@/components/dashboard/analytics/ConversionLegend";
import { DemographicsChart } from "@/components/dashboard/analytics/DemographicsChart";
import { EngagementCard } from "@/components/dashboard/analytics/EngagementCard";
import { EvolutionChart } from "@/components/dashboard/analytics/EvolutionChart";
import { NutritionTrendsTable } from "@/components/dashboard/analytics/NutritionTrendsTable";
import { ProgressionChart } from "@/components/dashboard/analytics/ProgressionChart";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  fetchDemographicsConversion,
  fetchEngagementSummary,
  fetchEngagementTimeseries,
  fetchNutritionTrends,
  fetchProgression,
} from "@/utils/analyticsApi";
import type {
  DemographicsConversion,
  EngagementSummary,
  EngagementTimeseriesPoint,
  NutritionTrendItem,
  ProgressionPoint,
} from "@/utils/interfaces/analytics";
import { useEffect, useState } from "react";
import { Activity, Flame, Gauge } from "lucide-react";
import type {
  EngagementMetricType,
  ConversionType,
} from "@/components/dashboard/analytics/mocks";

const AnalyticsPage: NextPageWithLayout = () => {
  const [engagementSummary, setEngagementSummary] =
    useState<EngagementSummary | null>(null);
  const [engagementTimeseries, setEngagementTimeseries] = useState<
    EngagementTimeseriesPoint[]
  >([]);
  const [progressionData, setProgressionData] = useState<ProgressionPoint[]>(
    []
  );
  const [nutritionTrends, setNutritionTrends] = useState<NutritionTrendItem[]>(
    []
  );
  const [demographics, setDemographics] =
    useState<DemographicsConversion | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [
        summary,
        timeseries,
        progression,
        nutrition,
        demographicsResponse,
      ] = await Promise.all([
        fetchEngagementSummary(7),
        fetchEngagementTimeseries(30),
        fetchProgression(8),
        fetchNutritionTrends(),
        fetchDemographicsConversion(),
      ]);
      if (cancelled) return;
      setEngagementSummary(summary);
      setEngagementTimeseries(timeseries);
      setProgressionData(progression);
      setNutritionTrends(nutrition);
      setDemographics(demographicsResponse);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const engagementMetrics: EngagementMetricType[] = engagementSummary
    ? [
        {
          label: "Activité Moyenne",
          value:
            engagementSummary.averageDailyActivityMinutesPerUser.toLocaleString(
              "fr-FR"
            ),
          unit: "min/jour",
          trend: "",
          icon: Activity,
          color: "#4A90E2",
        },
        {
          label: "Calories Brûlées",
          value:
            engagementSummary.averageDailyCaloriesBurnedPerUser.toLocaleString(
              "fr-FR"
            ),
          unit: "kcal/jour",
          trend: "",
          icon: Flame,
          color: "#FF887B",
        },
        {
          label: "Intensité Moyenne",
          value: `${engagementSummary.averageIntensityPercent}`,
          unit: "%",
          trend: "",
          icon: Gauge,
          color: "#7FD8BE",
        },
      ]
    : [];

  const conversionData: ConversionType[] =
    demographics?.planConversion.map((item, index) => {
      const colors = ["#4A90E2", "#5CC58C", "#7FD8BE", "#FF887B", "#A855F7"];
      return {
        name: item.name,
        value: item.users,
        color: colors[index % colors.length],
      };
    }) ?? [];

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
          <ResponsiveContainer width="100%" height={440}>
            <EvolutionChart engagementData={engagementTimeseries} />
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
            <CardTitle>Répartition Démographique par Âge & Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <DemographicsChart buckets={demographics?.ageBuckets ?? []} />
          </CardContent>
        </Card>
      </div>

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
