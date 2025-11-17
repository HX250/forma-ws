import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserType } from '../../types/auth/auth.types';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(UserType)
  userType!: UserType;
}

export class SetClientPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}
