import { Activity, Flame, LucideProps, Moon } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type EngagementType = {
  date: string;
  steps: number;
  calories: number;
  sleep: number;
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
  { date: "01/02", steps: 8234, calories: 2145, sleep: 7.2 },
  { date: "02/02", steps: 9521, calories: 2389, sleep: 6.8 },
  { date: "03/02", steps: 7892, calories: 2012, sleep: 7.5 },
  { date: "04/02", steps: 10234, calories: 2567, sleep: 7.1 },
  { date: "05/02", steps: 11456, calories: 2789, sleep: 8.0 },
  { date: "06/02", steps: 9876, calories: 2456, sleep: 7.3 },
  { date: "07/02", steps: 8945, calories: 2234, sleep: 6.9 },
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
    value: "9,451",
    unit: "pas/jour",
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
    label: "Sommeil Moyen",
    value: "7.3",
    unit: "heures",
    trend: "+0.5h",
    icon: Moon,
    color: "#7FD8BE",
  },
];
