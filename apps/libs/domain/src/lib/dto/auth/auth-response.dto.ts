import { UserType } from '../../types/auth/auth.types';

export interface AuthResponse {
  sub: string;
  email: string;
  userType: UserType;
}
