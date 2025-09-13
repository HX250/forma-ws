export enum UserType {
  COACH = 'COACH',
  CLIENT = 'CLIENT',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  sub?: string;
  email: string;
  userType: UserType;
  coachId?: string;
}
