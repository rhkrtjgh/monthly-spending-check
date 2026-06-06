import type { AuthMode } from "../../types/auth";
import { STORAGE_KEYS } from "./constants";

function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

function removeItem(key: string) {
  localStorage.removeItem(key);
}

export function isOnboardingCompleted(): boolean {
  return readItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === "true";
}

export function getAuthMode(): AuthMode | null {
  const value = readItem(STORAGE_KEYS.AUTH_MODE);
  if (value === "guest" || value === "logged_in") {
    return value;
  }
  return null;
}

export function getSessionToken(): string | null {
  return readItem(STORAGE_KEYS.SESSION_TOKEN);
}

export function isMigrationCompleted(): boolean {
  return readItem(STORAGE_KEYS.MIGRATION_COMPLETED) === "true";
}

export function setOnboardingCompleted() {
  writeItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
}

export function setAuthMode(mode: AuthMode) {
  writeItem(STORAGE_KEYS.AUTH_MODE, mode);
}

export function setSessionToken(token: string) {
  writeItem(STORAGE_KEYS.SESSION_TOKEN, token);
}

export function setMigrationCompleted() {
  writeItem(STORAGE_KEYS.MIGRATION_COMPLETED, "true");
}

export function getGuestExpenses<T = unknown>(): T[] {
  const raw = readItem(STORAGE_KEYS.EXPENSES);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setGuestExpenses<T>(expenses: T[]) {
  writeItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function clearGuestExpenses() {
  removeItem(STORAGE_KEYS.EXPENSES);
}

export function clearAuthStorage() {
  removeItem(STORAGE_KEYS.SESSION_TOKEN);
  removeItem(STORAGE_KEYS.AUTH_MODE);
}

export function hasLocalData(): boolean {
  return (
    isOnboardingCompleted() ||
    getGuestExpenses().length > 0 ||
    getSessionToken() !== null
  );
}

export function hasGuestExpenses(): boolean {
  return getGuestExpenses().length > 0;
}
