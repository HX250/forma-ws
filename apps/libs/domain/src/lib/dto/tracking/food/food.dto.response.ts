export interface FoodDetailList {
  id: string;
  name: string;
  nameSk: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSugar: number;
  totalFiber: number;
  mealCount: number;
  entries: FoodEntryDetail[];
}

export interface FoodEntryDetail {
  id: string;
  name: string;
  nameSk: string;
  category: number;
  servingSize: number;
  calories: number;
}

export interface FoodDetail {
  id: string;
  name: string;
  nameSk: string;
  category: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sugarPer100g: number;
}

export interface NutritionEntry {
  mealType: number;
  servingSize: number;
  foodId: string;
  foodName: string;
  foodNameSk: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}
