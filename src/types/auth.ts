export type AuthMode = "guest" | "logged_in";

export type EntryScreen = "loading" | "onboarding" | "ready";

export interface UserProfile {
  userKey: number;
  gender: string | null;
  birthYear: number | null;
}

export interface LoginResponse {
  sessionToken: string;
  user: UserProfile;
}

export interface MeResponse {
  user: UserProfile;
}

export interface MigrateExpensesResponse {
  ok: boolean;
  migratedCount: number;
}

export interface LocalAppState {
  onboardingCompleted: boolean;
  authMode: AuthMode | null;
  sessionToken: string | null;
  migrationCompleted: boolean;
}
