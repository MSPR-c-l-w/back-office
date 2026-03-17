export type Nutrition = {
  id: number;
  name: string;
  category: string;
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  cholesterol_mg: number;
  meal_type_name: string;
  water_intake_ml: number;
  picture_url: string | null;
};
