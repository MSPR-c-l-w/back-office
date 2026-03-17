import { AlertTriangle, CreditCard, Database, Users } from "lucide-react";
import { KPICard } from "../api-logs/types";

export type KPIDataType = KPICard & {
  status: string;
};

export type AgeDistributionType = {
  name: string;
  value: number;
};

export type DataQualityTrendType = {
  date: string;
  quality: number;
  errors: number;
};

export type ObjectivesDataType = {
  name: string;
  value: number;
  color: string;
};

export type AlertType = {
  id: number;
  type: string;
  message: string;
  time: string;
};

export const kpiData: KPIDataType[] = [
  {
    label: "Qualité des Données",
    value: "98.5%",
    trend: "+2.3%",
    icon: Database,
    color: "#5CC58C",
    status: "success",
  },
  {
    label: "Utilisateurs Actifs",
    value: "12,453",
    trend: "+8.7%",
    icon: Users,
    color: "#4A90E2",
    status: "success",
  },
  {
    label: "Conversion Premium",
    value: "23.4%",
    trend: "+5.1%",
    icon: CreditCard,
    color: "#7FD8BE",
    status: "success",
  },
  {
    label: "Erreurs Pipeline",
    value: "12",
    trend: "-4",
    icon: AlertTriangle,
    color: "#FF887B",
    status: "warning",
  },
];

export const ageDistribution: AgeDistributionType[] = [
  { name: "18-25", value: 2345 },
  { name: "26-35", value: 4123 },
  { name: "36-45", value: 3456 },
  { name: "46-55", value: 1789 },
  { name: "56+", value: 740 },
];

export const dataQualityTrend: DataQualityTrendType[] = [
  { date: "Lun", quality: 97.2, errors: 23 },
  { date: "Mar", quality: 97.8, errors: 18 },
  { date: "Mer", quality: 98.1, errors: 15 },
  { date: "Jeu", quality: 98.5, errors: 12 },
  { date: "Ven", quality: 98.3, errors: 14 },
  { date: "Sam", quality: 98.7, errors: 10 },
  { date: "Dim", quality: 98.5, errors: 12 },
];

export const objectivesData: ObjectivesDataType[] = [
  { name: "Perte de poids", value: 4523, color: "#4A90E2" },
  { name: "Prise de masse", value: 3245, color: "#5CC58C" },
  { name: "Bien-être", value: 2789, color: "#7FD8BE" },
  { name: "Performance", value: 1896, color: "#FFB88C" },
];

export const alerts: AlertType[] = [
  {
    id: 1,
    type: "error",
    message: "Pipeline Nutrition : 8 enregistrements avec valeurs manquantes",
    time: "Il y a 15 min",
  },
  {
    id: 2,
    type: "warning",
    message: "API Biométrie : Latence élevée détectée (>500ms)",
    time: "Il y a 1h",
  },
  {
    id: 3,
    type: "success",
    message: "Nettoyage automatique : 234 doublons supprimés",
    time: "Il y a 2h",
  },
];
