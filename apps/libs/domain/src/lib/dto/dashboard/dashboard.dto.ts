import { IsString } from 'class-validator';

export class getDashboardDto {
  @IsString()
  clientId!: string;
}
