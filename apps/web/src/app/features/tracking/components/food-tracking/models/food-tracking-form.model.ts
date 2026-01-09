import { FormControl, FormGroup } from '@angular/forms';

export interface FoodTrackingFromModel {
  mealType: FormControl<number>;
  food: FormGroup<SelectedFoodFormModel>;
  servingSize: FormControl<number>;
}

export interface SelectedFoodFormModel {
  foodId: FormControl<string>;
  foodName: FormControl<string>;
  foodNameSk: FormControl<string>;
  calories: FormControl<number>;
  protein: FormControl<number>;
  carbs: FormControl<number>;
  fat: FormControl<number>;
  fiber: FormControl<number>;
  sugar: FormControl<number>;
}
