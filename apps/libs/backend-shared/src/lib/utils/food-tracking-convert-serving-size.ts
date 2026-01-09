import { FoodDetail } from '@forma-ws/domain';

export class FoodTrackingUtils {
  static mapFoodServingSize(food: FoodDetail, servingSize: number): FoodDetail {
    const factor = servingSize / 100;

    return {
      ...food,
      caloriesPer100g: Math.round(food.caloriesPer100g * factor),
      proteinPer100g: +(food.proteinPer100g * factor).toFixed(2),
      carbsPer100g: +(food.carbsPer100g * factor).toFixed(2),
      fatPer100g: +(food.fatPer100g * factor).toFixed(2),
      fiberPer100g: food.fiberPer100g
        ? +(food.fiberPer100g * factor).toFixed(2)
        : 0,
      sugarPer100g: food.sugarPer100g
        ? +(food.sugarPer100g * factor).toFixed(2)
        : 0,
    };
  }
}
