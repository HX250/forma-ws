import { UserType } from '../../types/auth/auth.types';

export interface UserAuthDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  isFirstLogin?: boolean;
}
