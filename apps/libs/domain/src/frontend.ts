export type {
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  RefreshTokenDto,
  AvailabilityModel,
  ClientGoalDto,
  UpdateCoachProfileDto,
  UpdateCoachPersonalDto,
  UpdateCoachProfessionalDto,
  UpdateCoachAvailabilityDto,
} from './lib/dto';

export type {
  GetWaterData,
  AddWaterData,
  DeleteWaterData,
  ExerciseEntryDto,
  NutritionEntryDto,
  AddSleepEntryDto,
  GetSleepEntryDto,
  DeleteSleepEntryDto,
  AddWeighInDto,
  WeighInResponse,
} from './lib/dto/tracking';

export * from './lib/enums';
export * from './lib/types';
