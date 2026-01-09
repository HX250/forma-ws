import { IsISO8601, IsString } from 'class-validator';

export class GetTrackingData {
  @IsString()
  clientId!: string;

  @IsISO8601()
  createdAt!: string;
}
