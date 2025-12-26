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
  createdAt: Date;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  entries: NutritionEntry[];
}
