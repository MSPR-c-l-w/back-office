export type UserApiItem = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  organization_id?: number | null;
  role_id?: number | null;
  height?: number | null;
  deleted_at?: string | null;
  healthProfile?: {
    physical_activity_level?: string | null;
    daily_calories_target?: number | null;
  } | null;
  sessions?: Array<{
    created_at: string;
  }>;
  subscriptions?: Array<{
    status?: string;
    plan?: {
      name?: string;
    };
  }>;
};

export type UsersListApiResponse = {
  data: UserApiItem[];
  total: number;
};

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
export type UsersStats = {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  b2bUsers: number;
};
