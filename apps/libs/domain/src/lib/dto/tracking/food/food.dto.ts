import { IsNumber, IsNumberString, IsString } from 'class-validator';
export class NutritionEntryDto {
  @IsString()
  foodName!: string;

  @IsString()
  foodNameSk!: string;

  @IsString()
  foodId!: string;

  @IsNumber()
  servingSize!: number;

  @IsNumber()
  calories!: number;

  @IsNumber()
  protein!: number;

  @IsNumber()
  carbs!: number;

  @IsNumber()
  fat!: number;

  @IsNumber()
  sugar!: number;

  @IsNumber()
  fiber!: number;

  @IsNumber()
  mealType!: number;
}
