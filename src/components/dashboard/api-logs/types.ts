import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type ApiLogsRange = "1h" | "24h" | "7j" | "30j";

export type ApiCallPoint = {
  time: string;
  calls: number;
  errors: number;
  latency: number;
};

export type EndpointStat = {
  endpoint: string;
  calls: number;
  avgLatency: number;
  errors: number;
  successRate: number;
};

export type ServerStatus = {
  name: string;
  status: "online" | "warning";
  uptime: string;
  requestsPerHour: string;
  cpuPercent: number;
  memoryPercent: number;
  lastRestart: string;
  loadAvg1m: number;
};

export type EtlRecentLog = {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
};

export type KPICard = {
  label: string;
  value: string;
  trend?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
};
