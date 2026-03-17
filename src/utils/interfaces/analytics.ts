export type EngagementSummary = {
  days: number;
  averageDailyActivityMinutesPerUser: number;
  averageDailyCaloriesBurnedPerUser: number;
  averageIntensityPercent: number;
  totalActiveUsers: number;
};

export type EngagementTimeseriesPoint = {
  date: string;
  steps: number;
  calories: number;
  sleep: number;
};

export type ProgressionPoint = {
  week: string;
  progression: number;
  satisfaction: number;
};

export type AgeBucket = {
  label: string;
  total: number;
  male: number;
  female: number;
  other: number;
};

export type PlanConversionItem = {
  name: string;
  users: number;
};

export type DemographicsConversion = {
  ageBuckets: AgeBucket[];
  planConversion: PlanConversionItem[];
};

export type NutritionTrendItem = {
  profile: string;
  users: number;
  avgCalories: number;
  avgProtein: number;
};
