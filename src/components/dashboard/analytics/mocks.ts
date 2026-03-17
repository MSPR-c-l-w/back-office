import { Activity, Flame, Gauge, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type EngagementType = {
  date: string;
  totalDurationHours: number;
  totalCalories: number;
  activeUsersPercent: number;
};

export type ProgressionType = {
  week: string;
  progression: number;
  satisfaction: number;
};

export type NutritionTrendType = {
  profile: string;
  users: number;
  avgCalories: number;
  avgProtein: number;
};

export type ConversionType = {
  name: string;
  value: number;
  color: string;
};

export type EngagementMetricType = {
  label: string;
  value: string;
  unit: string;
  trend: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
};

export const engagementData: EngagementType[] = [
  {
    date: "2026-02-01",
    totalDurationHours: 120,
    totalCalories: 240000,
    activeUsersPercent: 40,
  },
  {
    date: "2026-02-02",
    totalDurationHours: 135,
    totalCalories: 260000,
    activeUsersPercent: 45,
  },
  {
    date: "2026-02-03",
    totalDurationHours: 110,
    totalCalories: 220000,
    activeUsersPercent: 38,
  },
  {
    date: "2026-02-04",
    totalDurationHours: 150,
    totalCalories: 280000,
    activeUsersPercent: 50,
  },
  {
    date: "2026-02-05",
    totalDurationHours: 165,
    totalCalories: 300000,
    activeUsersPercent: 52,
  },
  {
    date: "2026-02-06",
    totalDurationHours: 140,
    totalCalories: 260000,
    activeUsersPercent: 47,
  },
  {
    date: "2026-02-07",
    totalDurationHours: 125,
    totalCalories: 245000,
    activeUsersPercent: 42,
  },
];

export const progressionData: ProgressionType[] = [
  { week: "Sem 1", progression: 65, satisfaction: 72 },
  { week: "Sem 2", progression: 71, satisfaction: 75 },
  { week: "Sem 3", progression: 76, satisfaction: 78 },
  { week: "Sem 4", progression: 82, satisfaction: 85 },
  { week: "Sem 5", progression: 87, satisfaction: 88 },
  { week: "Sem 6", progression: 91, satisfaction: 92 },
];

export const nutritionTrends: NutritionTrendType[] = [
  { profile: "Végétarien", users: 3456, avgCalories: 1850, avgProtein: 65 },
  { profile: "Omnivore", users: 5234, avgCalories: 2200, avgProtein: 95 },
  { profile: "Végétalien", users: 1789, avgCalories: 1750, avgProtein: 55 },
  { profile: "Paleo", users: 2345, avgCalories: 2100, avgProtein: 110 },
];

export const conversionData: ConversionType[] = [
  { name: "Premium B2C", value: 2945, color: "#4A90E2" },
  { name: "Marque Blanche B2B", value: 1234, color: "#5CC58C" },
  { name: "Freemium", value: 8274, color: "#7FD8BE" },
];

export const engagementMetrics: EngagementMetricType[] = [
  {
    label: "Activité Moyenne",
    value: "65",
    unit: "min/jour",
    trend: "+12.3%",
    icon: Activity,
    color: "#4A90E2",
  },
  {
    label: "Calories Brûlées",
    value: "2,370",
    unit: "kcal/jour",
    trend: "+8.7%",
    icon: Flame,
    color: "#FF887B",
  },
  {
    label: "Intensité Moyenne",
    value: "73",
    unit: "%",
    trend: "+4.1pts",
    icon: Gauge,
    color: "#7FD8BE",
  },
];
