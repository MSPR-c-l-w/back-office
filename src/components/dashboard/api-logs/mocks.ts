import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type ApiCallType = {
  time: string;
  calls: number;
  errors: number;
  latency: number;
};

export type EndpointType = {
  endpoint: string;
  calls: number;
  avgLatency: number;
  errors: number;
  successRate: number;
};

export type ServerType = {
  name: string;
  status: string;
  uptime: string;
  requests: string;
  cpu: number;
  memory: number;
  lastRestart: string;
};

export type RecentLogType = {
  id: number;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  details: string;
};

export type KPICardType = {
  label: string;
  value: string;
  trend: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
};

export const apiCallsDat: ApiCallType[] = [
  { time: "00:00", calls: 234, errors: 2, latency: 145 },
  { time: "04:00", calls: 156, errors: 1, latency: 132 },
  { time: "08:00", calls: 567, errors: 5, latency: 178 },
  { time: "12:00", calls: 892, errors: 8, latency: 234 },
  { time: "16:00", calls: 745, errors: 6, latency: 198 },
  { time: "20:00", calls: 623, errors: 4, latency: 167 },
];

export const endpointsStats: EndpointType[] = [
  {
    endpoint: "/api/v1/nutrition/meals",
    calls: 12456,
    avgLatency: 145,
    errors: 23,
    successRate: 99.8,
  },
  {
    endpoint: "/api/v1/exercises/workouts",
    calls: 9234,
    avgLatency: 178,
    errors: 12,
    successRate: 99.9,
  },
  {
    endpoint: "/api/v1/biometry/heartrate",
    calls: 15678,
    avgLatency: 234,
    errors: 45,
    successRate: 99.7,
  },
  {
    endpoint: "/api/v1/users/profile",
    calls: 6789,
    avgLatency: 98,
    errors: 5,
    successRate: 99.9,
  },
  {
    endpoint: "/api/v1/analytics/dashboard",
    calls: 4567,
    avgLatency: 567,
    errors: 18,
    successRate: 99.6,
  },
];

export const servers: ServerType[] = [
  {
    name: "API Gateway Principal",
    status: "online",
    uptime: "99.8%",
    requests: "45.2K/h",
    cpu: 67,
    memory: 78,
    lastRestart: "Il y a 12 jours",
  },
  {
    name: "API Gateway Secondaire",
    status: "online",
    uptime: "99.9%",
    requests: "23.4K/h",
    cpu: 45,
    memory: 62,
    lastRestart: "Il y a 8 jours",
  },
  {
    name: "ETL Pipeline Worker 1",
    status: "warning",
    uptime: "98.2%",
    requests: "1.2K/h",
    cpu: 89,
    memory: 91,
    lastRestart: "Il y a 3 heures",
  },
];

export const recentLogs: RecentLogType[] = [
  {
    id: 1,
    timestamp: "2026-02-04 14:23:45",
    level: "error",
    service: "ETL Pipeline",
    message: "Connection timeout to PostgreSQL database",
    details: "Host: db-prod-01.internal:5432",
  },
  {
    id: 2,
    timestamp: "2026-02-04 14:18:12",
    level: "warning",
    service: "API Gateway",
    message: "High latency detected on /api/v1/analytics/dashboard",
    details: "Response time: 1245ms (threshold: 500ms)",
  },
  {
    id: 3,
    timestamp: "2026-02-04 14:15:33",
    level: "info",
    service: "ETL Pipeline",
    message: "Batch processing completed successfully",
    details: "2,345 records processed in 45 seconds",
  },
  {
    id: 4,
    timestamp: "2026-02-04 14:12:08",
    level: "error",
    service: "API Nutrition",
    message: "Validation error: Invalid calorie value",
    details: "user_id: 12345, value: -150 (must be positive)",
  },
  {
    id: 5,
    timestamp: "2026-02-04 14:08:54",
    level: "warning",
    service: "API Biométrie",
    message: "Rate limit approaching for user 67890",
    details: "98/100 requests in current window",
  },
];

export const kpiCards: KPICardType[] = [
  {
    label: "Total Appels API",
    value: "48.9K",
    trend: "+12.5%",
    icon: Activity,
    color: "#4A90E2",
  },
  {
    label: "Taux de Succès",
    value: "99.7%",
    trend: "+0.2%",
    icon: CheckCircle,
    color: "#5CC58C",
  },
  {
    label: "Latence Moyenne",
    value: "187ms",
    trend: "-23ms",
    icon: Clock,
    color: "#7FD8BE",
  },
  {
    label: "Erreurs Totales",
    value: "93",
    trend: "-12",
    icon: AlertTriangle,
    color: "#FF887B",
  },
];
