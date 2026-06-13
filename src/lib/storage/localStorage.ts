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

export function isOnboardingCompleted(): boolean {
  return readItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === "true";
}

export function setOnboardingCompleted() {
  writeItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
}

export function isInitialGuideCompleted(): boolean {
  return readItem(STORAGE_KEYS.INITIAL_GUIDE_COMPLETED) === "true";
}

export function setInitialGuideCompleted() {
  writeItem(STORAGE_KEYS.INITIAL_GUIDE_COMPLETED, "true");
}
