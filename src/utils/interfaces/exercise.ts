export type Exercise = {
  id: number;
  name: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  level: string;
  mechanic: string | null;
  equipment: string | null;
  category: string;
  instructions: string[];
  images_urls: string[];
  exercise_type: string;
};

