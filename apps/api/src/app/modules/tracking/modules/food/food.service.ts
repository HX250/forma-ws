import {
  DatabaseService,
  DateUtils,
  decimalToNumber,
  FoodTrackingUtils,
  prismaToPlain,
} from '@forma-ws/backend-shared';
import {
  FoodDetail,
  FoodDetailList,
  GetTrackingData,
  MealType,
  NutritionEntryDto,
  NutritionSummary,
} from '@forma-ws/domain';

import { Injectable, Logger } from '@nestjs/common';
import { NutritionEntry } from '@prisma/client';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: DatabaseService) {}

  async searchFoods(query: string): Promise<FoodDetailList[]> {
    const data = await this.prisma.food.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameSk: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        nameSk: true,
      },
      take: 20,
      orderBy: [{ isVerified: 'desc' }, { name: 'asc' }],
    });

    return data;
  }

  async getFoodById(id: string, servingSize: number): Promise<FoodDetail> {
    const data = await this.prisma.food.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        nameSk: true,
        category: true,
        caloriesPer100g: true,
        proteinPer100g: true,
        carbsPer100g: true,
        fatPer100g: true,
        fiberPer100g: true,
        sugarPer100g: true,
      },
    });

    const plain = prismaToPlain<FoodDetail>(data);

    return FoodTrackingUtils.mapFoodServingSize(plain, servingSize);
  }

  async logNutritionEntry(
    dto: NutritionEntryDto,
    clientId: string
  ): Promise<boolean> {
    const mealTypeMap: Record<number, MealType> = {
      1: MealType.BREAKFAST,
      2: MealType.LUNCH,
      3: MealType.DINNER,
      4: MealType.SNACK,
    };

    await this.prisma.nutritionEntry.create({
      data: {
        clientId: clientId,
        foodId: dto.foodId,
        foodName: dto.foodName,
        foodNameSk: dto.foodNameSk,
        calories: dto.calories,
        protein: dto.protein,
        carbs: dto.carbs,
        fat: dto.fat,
        fiber: dto.fiber,
        sugar: dto.sugar,
        servingSize: dto.servingSize,
        mealType: mealTypeMap[dto.mealType],
      },
    });

    return true;
  }

  async getNutritionTrackingData(
    dto: GetTrackingData
  ): Promise<NutritionSummary> {
    const { start, end } = DateUtils.getDayRange(dto.createdAt);

    const entries = await this.prisma.nutritionEntry.findMany({
      where: {
        clientId: dto.clientId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const summary = this.calculateSummary(entries);

    return prismaToPlain(summary);
  }

  async deleteNutritionEntry(
    entryId: string,
    clientId: string
  ): Promise<boolean> {
    await this.prisma.nutritionEntry.delete({
      where: {
        id: entryId,
        clientId: clientId,
      },
    });
    return true;
  }

  private calculateSummary(entries: NutritionEntry[]): NutritionSummary {
    return {
      totalCalories: entries.reduce((sum, e) => sum + e.calories, 0),
      totalProtein: entries.reduce(
        (sum, e) => sum + decimalToNumber(e.protein),
        0
      ),
      totalCarbs: entries.reduce((sum, e) => sum + decimalToNumber(e.carbs), 0),
      totalFat: entries.reduce((sum, e) => sum + decimalToNumber(e.fat), 0),
      totalFiber: entries.reduce((sum, e) => sum + decimalToNumber(e.fiber), 0),
      totalSugar: entries.reduce((sum, e) => sum + decimalToNumber(e.sugar), 0),
      mealCount: entries.length,
      entries: entries.map((e) => ({
        id: e.id,
        name: e.foodName,
        nameSk: e.foodNameSk,
        servingSize: decimalToNumber(e.servingSize),
        calories: e.calories,
      })),
    };
  }
}
