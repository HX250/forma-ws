export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  sub: string;
  email: string;
  userType: 'COACH' | 'CLIENT';
  coachId?: string;
}

export enum UserType {
  COACH = 'COACH',
  CLIENT = 'CLIENT',
}
