export interface NutritionEntry {
  id: string;
  clientId: string;
  foodName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  mealType?: string;
  date: Date;
  createdAt: Date;
}
