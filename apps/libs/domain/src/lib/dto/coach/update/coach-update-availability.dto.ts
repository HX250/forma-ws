import { CommunicationMethod } from '@forma-ws/frontend/domain';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { AvailabilityModel } from '../auth/coach-register.dto';

export class UpdateCoachAvailabilityDto {
  @IsOptional()
  availability?: AvailabilityModel[];

  @IsArray()
  @IsEnum(CommunicationMethod, { each: true })
  communicationMethods!: CommunicationMethod[];
}
