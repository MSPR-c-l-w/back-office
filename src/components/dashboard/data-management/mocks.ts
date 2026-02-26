export type DatasetType = {
  id: string;
  name: string;
  records: number;
  issues: number;
  status: string;
  lastSync: string;
};

export const datasets: DatasetType[] = [
  {
    id: "nutrition",
    name: "Nutrition",
    records: 45678,
    issues: 12,
    status: "warning",
    lastSync: "15 min",
  },
  {
    id: "exercises",
    name: "Exercices",
    records: 23456,
    issues: 3,
    status: "success",
    lastSync: "5 min",
  },
  {
    id: "biometry",
    name: "Biométrie",
    records: 67890,
    issues: 8,
    status: "warning",
    lastSync: "22 min",
  },
];

export type AnomalieType = {
  id: number;
  type: string;
  dataset: string;
  field: string;
  description: string;
  severity: string;
  count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonData: any;
};

export const anomalies: AnomalieType[] = [
  {
    id: 1,
    type: "duplicate",
    dataset: "Nutrition",
    field: "user_id: 12345",
    description:
      "Enregistrement dupliqué détecté pour le même utilisateur et timestamp",
    severity: "high",
    count: 3,
    jsonData: { user_id: 12345, timestamp: "2023-10-01T12:00:00Z" },
  },
  {
    id: 2,
    type: "missing",
    dataset: "Nutrition",
    field: "calories",
    description: "Valeur manquante dans le champ calories (8 enregistrements)",
    severity: "high",
    count: 8,
    jsonData: { calories: null },
  },
  {
    id: 3,
    type: "outlier",
    dataset: "Nutrition",
    field: "protein",
    description: "Valeur aberrante : 9999g de protéines (moyenne: 85g)",
    severity: "medium",
    count: 1,
    jsonData: { protein: 9999 },
  },
  {
    id: 4,
    type: "format",
    dataset: "Exercices",
    field: "duration",
    description: "Format incorrect : durée en minutes au lieu de secondes",
    severity: "low",
    count: 2,
    jsonData: { duration: "10" },
  },
  {
    id: 5,
    type: "missing",
    dataset: "Biométrie",
    field: "heart_rate",
    description: "Données de fréquence cardiaque manquantes",
    severity: "medium",
    count: 5,
    jsonData: { heart_rate: null },
  },
];

export type ServerStatusType = {
  name: string;
  status: string;
  cpu: number;
  memory: number;
  uptime: string;
};

export const serverStatus: ServerStatusType[] = [
  {
    name: "Serveur Principal ETL",
    status: "online",
    cpu: 45,
    memory: 62,
    uptime: "99.8%",
  },
  {
    name: "Base de Données PostgreSQL",
    status: "online",
    cpu: 38,
    memory: 71,
    uptime: "99.9%",
  },
  {
    name: "API Gateway",
    status: "warning",
    cpu: 78,
    memory: 85,
    uptime: "98.2%",
  },
];

export type PipelineLogType = {
  timestamp: string;
  level: string;
  message: string;
};

export const pipelineLogs: PipelineLogType[] = [
  {
    timestamp: "14:32:15",
    level: "INFO",
    message: "Démarrage du pipeline ETL v2.4.1",
  },
  {
    timestamp: "14:32:16",
    level: "INFO",
    message: "Connexion à la base de données PostgreSQL... OK",
  },
  {
    timestamp: "14:32:17",
    level: "INFO",
    message:
      "Extraction des données depuis les sources (Nutrition, Exercices, Biométrie)",
  },
  {
    timestamp: "14:32:19",
    level: "SUCCESS",
    message: "Extraction terminée : 136,024 enregistrements récupérés",
  },
  {
    timestamp: "14:32:20",
    level: "INFO",
    message: "Transformation : validation des schémas de données",
  },
  {
    timestamp: "14:32:22",
    level: "WARNING",
    message: "Détection de 12 doublons dans le dataset Nutrition",
  },
  {
    timestamp: "14:32:22",
    level: "WARNING",
    message: "Détection de 8 valeurs manquantes dans le dataset Nutrition",
  },
  {
    timestamp: "14:32:24",
    level: "INFO",
    message: "Nettoyage automatique des doublons appliqué",
  },
  {
    timestamp: "14:32:26",
    level: "SUCCESS",
    message: "Transformation terminée : 135,904 enregistrements valides",
  },
  {
    timestamp: "14:32:27",
    level: "INFO",
    message: "Chargement dans le data warehouse...",
  },
  {
    timestamp: "14:32:31",
    level: "SUCCESS",
    message: "Chargement terminé : 135,904 enregistrements insérés",
  },
  {
    timestamp: "14:32:32",
    level: "SUCCESS",
    message: "Pipeline ETL terminé avec succès (durée: 17s)",
  },
];
