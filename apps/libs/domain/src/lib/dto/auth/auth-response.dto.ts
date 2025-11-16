// Frontend-compatible types (no class-transformer)
export interface AuthResponse {
  user: {
    sub: string;
    email: string;
    userType: 'COACH' | 'CLIENT';
  };
  requiresPasswordSetup?: boolean;
}
