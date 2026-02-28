import { Gender } from '@forma-ws/frontend/domain';
import { IsString, IsEnum } from 'class-validator';

export class UpdateCoachPersonalDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(Gender)
  gender!: Gender;
}
