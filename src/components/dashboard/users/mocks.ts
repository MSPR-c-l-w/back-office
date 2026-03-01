export type UserListItem = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  objective: string;
  plan: "Freemium" | "Premium" | "B2B";
  status: "active" | "inactive";
  joinDate: string;
  lastActivity: string;
  avatar?: string;
};

const FIRST_NAMES = [
  "Marie",
  "Pierre",
  "Sophie",
  "Thomas",
  "Julie",
  "Alexandre",
  "Emma",
  "Lucas",
  "Camille",
  "Nicolas",
];
const LAST_NAMES = [
  "Dubois",
  "Martin",
  "Bernard",
  "Petit",
  "Robert",
  "Richard",
  "Durand",
  "Leroy",
  "Moreau",
  "Simon",
];
const OBJECTIVES = ["Perte de poids", "Prise de masse", "Bien-être", "Performance"];
const PLANS: UserListItem["plan"][] = ["Freemium", "Premium", "B2B"];

export const allUsers: UserListItem[] = Array.from({ length: 127 }, (_, i) => ({
  id: i + 1,
  name: `${FIRST_NAMES[i % 10]} ${LAST_NAMES[Math.floor(i / 10) % 10]}`,
  email: `user${i + 1}@healthai.com`,
  age: 18 + (i % 50),
  gender: i % 2 === 0 ? "F" : "M",
  objective: OBJECTIVES[i % 4],
  plan: PLANS[i % 3],
  status: i % 7 === 0 ? "inactive" : "active",
  joinDate: new Date(2024, Math.floor(i / 20), (i % 28) + 1).toLocaleDateString("fr-FR"),
  lastActivity: `Il y a ${(i % 24) + 1}h`,
}));

export type UserMetrics = {
  dailySteps: { date: string; steps: number; goal: number }[];
  weeklyCalories: { week: string; consumed: number; burned: number }[];
  sleepQuality: { date: string; hours: number; quality: number }[];
  currentMetrics: {
    avgSteps: number;
    avgCalories: number;
    avgSleep: number;
    goalProgress: number;
  };
};

export function getUserMetrics(userId: number): UserMetrics {
  const baseValue = userId * 137;
  return {
    dailySteps: [
      { date: "Lun", steps: 7000 + (baseValue % 3000), goal: 10000 },
      { date: "Mar", steps: 8500 + (baseValue % 2500), goal: 10000 },
      { date: "Mer", steps: 9200 + (baseValue % 1800), goal: 10000 },
      { date: "Jeu", steps: 10500 + (baseValue % 2000), goal: 10000 },
      { date: "Ven", steps: 11200 + (baseValue % 1500), goal: 10000 },
      { date: "Sam", steps: 8900 + (baseValue % 2200), goal: 10000 },
      { date: "Dim", steps: 7500 + (baseValue % 2800), goal: 10000 },
    ],
    weeklyCalories: [
      { week: "S1", consumed: 1800 + (baseValue % 400), burned: 2100 + (baseValue % 300) },
      { week: "S2", consumed: 1950 + (baseValue % 350), burned: 2200 + (baseValue % 250) },
      { week: "S3", consumed: 1900 + (baseValue % 300), burned: 2300 + (baseValue % 200) },
      { week: "S4", consumed: 2000 + (baseValue % 250), burned: 2400 + (baseValue % 150) },
    ],
    sleepQuality: [
      { date: "Lun", hours: 7.2, quality: 75 },
      { date: "Mar", hours: 6.8, quality: 68 },
      { date: "Mer", hours: 7.5, quality: 82 },
      { date: "Jeu", hours: 8.0, quality: 88 },
      { date: "Ven", hours: 7.3, quality: 78 },
      { date: "Sam", hours: 8.5, quality: 90 },
      { date: "Dim", hours: 7.8, quality: 85 },
    ],
    currentMetrics: {
      avgSteps: 9200 + (baseValue % 2000),
      avgCalories: 2150 + (baseValue % 300),
      avgSleep: 7.4 + (baseValue % 10) / 10,
      goalProgress: 68 + (baseValue % 30),
    },
  };
}
