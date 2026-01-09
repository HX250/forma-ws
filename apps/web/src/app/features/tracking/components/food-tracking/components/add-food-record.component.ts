import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { FoodDetail, FoodDetailList } from '@forma-ws/domain';
import {
  AlertService,
  AlertType,
  AutocompleteItem,
  ButtonComponent,
  FormaFormContainer,
  FormUtils,
  PageAutocomplete,
  PageFormComponent,
  PageHorizontalRadioComponent,
  PageInput,
  RatingOption,
} from '@forma-ws/frontend-shared';
import { FoodTrackingResourceService } from '../resource/food-tracking.resource.service';
import {
  FoodTrackingFromModel,
  SelectedFoodFormModel,
} from '../models/food-tracking-form.model';

@Component({
  selector: 'app-food-record-meal',
  imports: [
    CommonModule,
    FormsModule,
    PageHorizontalRadioComponent,
    PageAutocomplete,
    PageInput,
    ButtonComponent,
  ],
  templateUrl: './add-food-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodTrackingResourceService],
})
export class AddFoodRecordComponent
  extends PageFormComponent<FormGroup<FoodTrackingFromModel>>
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly foodResourceService = inject(FoodTrackingResourceService);
  private readonly alertService = inject(AlertService);

  clientId = signal<string>('');
  foodId = signal<string>('');
  servingSize = signal<number>(0);
  selectedFood = signal<FoodDetail | undefined>(undefined);

  searchResults = signal<AutocompleteItem<FoodDetailList>[]>([]);

  modalRef!: { close: (result?: any) => void };

  mealTypeOptions = signal<RatingOption[]>([
    { value: 1, label: 'Breakfast' },
    { value: 2, label: 'Lunch' },
    { value: 3, label: 'Dinner' },
    { value: 4, label: 'Snack' },
  ]);

  get control() {
    return this.form.controls;
  }

  private selectedFoodEffect = effect(() => {
    const foodId = this.foodId();
    const servingSize = this.servingSize();

    if (!foodId || !servingSize) {
      return;
    }

    this.onFoodSelected();
  });

  ngOnInit() {
    this.form = this.buildForm();

    this.control.servingSize.valueChanges.subscribe((v) =>
      this.servingSize.set(v)
    );
  }

  private buildForm(): FormaFormContainer<FormGroup<FoodTrackingFromModel>> {
    return FormUtils.createFormGroup(
      this.fb.group<FoodTrackingFromModel>({
        mealType: this.fb.control<number>(0, {
          nonNullable: true,
          validators: [Validators.required],
        }),

        food: this.fb.group<SelectedFoodFormModel>({
          foodId: this.fb.control('', { nonNullable: true }),
          foodName: this.fb.control('', {
            validators: [Validators.required],
            nonNullable: true,
          }),
          foodNameSk: this.fb.control('', { nonNullable: true }),
          calories: this.fb.control(0, { nonNullable: true }),
          protein: this.fb.control(0, { nonNullable: true }),
          carbs: this.fb.control(0, { nonNullable: true }),
          fat: this.fb.control(0, { nonNullable: true }),
          sugar: this.fb.control(0, { nonNullable: true }),
          fiber: this.fb.control(0, { nonNullable: true }),
        }),

        servingSize: this.fb.control(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1)],
        }),
      })
    );
  }

  performSearch() {
    this.sendFormRequest(
      this.foodResourceService.searchFoods(
        this.control.food.controls.foodName.value
      )
    ).subscribe({
      next: (results) => {
        this.searchResults.set(
          results.map((food) => ({
            id: food.id,
            label: food.name,
            labelSk: food.nameSk,
            value: food,
          }))
        );
      },
      error: () => {
        this.searchResults.set([]);
      },
    });
  }

  onFoodSelected() {
    this.sendFormRequest(
      this.foodResourceService.getFoodById(this.foodId(), this.servingSize())
    ).subscribe((food) => {
      this.selectedFood.set(food);
      this.control.food.patchValue({
        foodId: food.id,
        foodName: food.name,
        foodNameSk: food.nameSk,
        calories: food.caloriesPer100g,
        protein: food.proteinPer100g,
        carbs: food.carbsPer100g,
        fat: food.fatPer100g,
        sugar: food.sugarPer100g,
        fiber: food.fiberPer100g,
      });
    });
  }

  onSearchCleared() {
    this.foodId.set('');
    this.selectedFood.set(undefined);
    this.searchResults.set([]);
    this.control.food.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const food = this.selectedFood();

    if (!food) {
      this.alertService.show(AlertType.ERROR, 'Please select a food item');
      return;
    }

    const mappedForm = {
      ...this.form.getRawValue().food,
      mealType: this.form.getRawValue().mealType!,
      servingSize: this.form.getRawValue().servingSize,
    };

    this.sendFormRequest(
      this.foodResourceService.logNutritionEntry(mappedForm, this.clientId())
    ).subscribe({
      next: (res) => {
        this.alertService.show(AlertType.SUCCESS, 'Meal logged successfully');
        this.form.reset();
        this.onSearchCleared();
        this.modalRef?.close(res);
      },
      error: () => {
        this.alertService.show(AlertType.ERROR, 'Failed to log meal');
      },
    });
  }
}
