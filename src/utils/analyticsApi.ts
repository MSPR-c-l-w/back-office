import api from "./axios";
import type {
  DemographicsConversion,
  EngagementSummary,
  EngagementTimeseriesPoint,
  NutritionTrendItem,
  ProgressionPoint,
} from "./interfaces/analytics";

export async function fetchEngagementSummary(
  days = 7
): Promise<EngagementSummary> {
  const { data } = await api.get<EngagementSummary>(
    "/analytics/engagement/summary",
    {
      params: { days },
    }
  );
  return data;
}

export async function fetchEngagementTimeseries(
  days = 30
): Promise<EngagementTimeseriesPoint[]> {
  const { data } = await api.get<EngagementTimeseriesPoint[]>(
    "/analytics/engagement/timeseries",
    { params: { days } }
  );
  return data;
}

export async function fetchProgression(weeks = 8): Promise<ProgressionPoint[]> {
  const { data } = await api.get<ProgressionPoint[]>("/analytics/progression", {
    params: { weeks },
  });
  return data;
}

export async function fetchDemographicsConversion(): Promise<DemographicsConversion> {
  const { data } = await api.get<DemographicsConversion>(
    "/analytics/demographics-conversion"
  );
  return data;
}

export async function fetchNutritionTrends(): Promise<NutritionTrendItem[]> {
  const { data } = await api.get<NutritionTrendItem[]>(
    "/analytics/nutrition-trends"
  );
  return data;
}
