import { IsISO8601, IsNumber, IsString } from 'class-validator';

export class GetWaterData {
  @IsString()
  clientId!: string;

  @IsISO8601()
  createdAt!: string;
}

export class AddWaterData {
  @IsString()
  clientId!: string;

  @IsNumber()
  amount!: number;
}

export class DeleteWaterData {
  @IsString()
  id!: string;

  @IsString()
  clientId!: string;
}
