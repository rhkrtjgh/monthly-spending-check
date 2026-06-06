import {
  appLogin,
  getIsTossLoginIntegratedService,
} from "@apps-in-toss/web-framework";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchMe,
  loginWithAuthorizationCode,
  logout as logoutApi,
  migrateGuestExpenses,
  refreshSession,
} from "../lib/auth/api";
import {
  clearAuthStorage,
  clearGuestExpenses,
  getAuthMode,
  getGuestExpenses,
  getSessionToken,
  hasGuestExpenses,
  isMigrationCompleted,
  isOnboardingCompleted,
  setAuthMode,
  setMigrationCompleted,
  setOnboardingCompleted,
  setSessionToken,
} from "../lib/storage/localStorage";
import type {
  AuthMode,
  EntryScreen,
  UserProfile,
} from "../types/auth";

interface AuthContextValue {
  entryScreen: EntryScreen;
  authMode: AuthMode | null;
  user: UserProfile | null;
  isTossLoggedIn: boolean | null;
  isLoading: boolean;
  error: string | null;
  loginWithToss: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export { AuthContext };

async function checkTossLoginStatus(): Promise<boolean | null> {
  try {
    const result = await getIsTossLoginIntegratedService();
    if (result === undefined) {
      return null;
    }
    return result;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [entryScreen, setEntryScreen] = useState<EntryScreen>("loading");
  const [authMode, setAuthModeState] = useState<AuthMode | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isTossLoggedIn, setIsTossLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const migrateIfNeeded = useCallback(async (sessionToken: string) => {
    if (isMigrationCompleted() || !hasGuestExpenses()) {
      return;
    }

    const expenses = getGuestExpenses();
    await migrateGuestExpenses(sessionToken, expenses);
    clearGuestExpenses();
    setMigrationCompleted();
  }, []);

  const establishLoggedInSession = useCallback(
    async (sessionToken: string, profile: UserProfile) => {
      setSessionToken(sessionToken);
      setAuthMode("logged_in");
      setOnboardingCompleted();
      setAuthModeState("logged_in");
      setUser(profile);
      await migrateIfNeeded(sessionToken);
    },
    [migrateIfNeeded],
  );

  const restoreSession = useCallback(
    async (sessionToken: string): Promise<boolean> => {
      try {
        const { user: profile } = await fetchMe(sessionToken);
        await establishLoggedInSession(sessionToken, profile);
        return true;
      } catch {
        try {
          const { user: profile } = await refreshSession(sessionToken);
          await establishLoggedInSession(sessionToken, profile);
          return true;
        } catch {
          clearAuthStorage();
          return false;
        }
      }
    },
    [establishLoggedInSession],
  );

  const performTossLogin = useCallback(async () => {
    const { authorizationCode, referrer } = await appLogin();
    const { sessionToken, user: profile } = await loginWithAuthorizationCode(
      authorizationCode,
      referrer,
    );
    await establishLoggedInSession(sessionToken, profile);
  }, [establishLoggedInSession]);

  const resolveEntry = useCallback(async () => {
    setEntryScreen("loading");
    setError(null);

    const tossLoginStatus = await checkTossLoginStatus();
    setIsTossLoggedIn(tossLoginStatus);

    const onboardingCompleted = isOnboardingCompleted();
    const storedAuthMode = getAuthMode();
    const sessionToken = getSessionToken();

    if (sessionToken && storedAuthMode === "logged_in") {
      if (tossLoginStatus) {
        const restored = await restoreSession(sessionToken);
        if (restored) {
          setEntryScreen("ready");
          return;
        }
      } else {
        clearAuthStorage();
      }
    }

    if (tossLoginStatus && !onboardingCompleted) {
      setIsLoading(true);
      try {
        await performTossLogin();
        setEntryScreen("ready");
        return;
      } catch (loginError) {
        console.error(loginError);
        setEntryScreen("onboarding");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    if (onboardingCompleted && storedAuthMode === "guest") {
      setAuthModeState("guest");
      setUser(null);
      setEntryScreen("ready");
      return;
    }

    if (onboardingCompleted && storedAuthMode === "logged_in") {
      if (tossLoginStatus) {
        setIsLoading(true);
        try {
          await performTossLogin();
          setEntryScreen("ready");
          return;
        } catch (loginError) {
          console.error(loginError);
          setError("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
          setEntryScreen("onboarding");
          return;
        } finally {
          setIsLoading(false);
        }
      }

      clearAuthStorage();
      setEntryScreen("onboarding");
      return;
    }

    if (!onboardingCompleted) {
      setEntryScreen("onboarding");
      return;
    }

    setEntryScreen("ready");
  }, [performTossLogin, restoreSession]);

  useEffect(() => {
    void resolveEntry();
  }, [resolveEntry]);

  const loginWithToss = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await performTossLogin();
      setEntryScreen("ready");
    } catch (loginError) {
      console.error(loginError);
      setError(
        loginError instanceof Error
          ? loginError.message
          : "토스 로그인에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [performTossLogin]);

  const continueAsGuest = useCallback(() => {
    setAuthMode("guest");
    setOnboardingCompleted();
    setAuthModeState("guest");
    setUser(null);
    setEntryScreen("ready");
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const sessionToken = getSessionToken();

    try {
      if (sessionToken) {
        await logoutApi(sessionToken);
      }
    } catch (logoutError) {
      console.warn(logoutError);
    } finally {
      clearAuthStorage();
      setAuthModeState("guest");
      setUser(null);
      setAuthMode("guest");
      setOnboardingCompleted();
      setIsLoading(false);
      setEntryScreen("ready");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      entryScreen,
      authMode,
      user,
      isTossLoggedIn,
      isLoading,
      error,
      loginWithToss,
      continueAsGuest,
      logout,
      clearError,
    }),
    [
      entryScreen,
      authMode,
      user,
      isTossLoggedIn,
      isLoading,
      error,
      loginWithToss,
      continueAsGuest,
      logout,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
