import type {
  LoginResponse,
  MeResponse,
  MigrateExpensesResponse,
} from "../../types/auth";

const AUTH_BASE = `${import.meta.env.VITE_AUTH_SERVER_URL ?? ""}/api/auth`;

class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  sessionToken?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (sessionToken) {
    headers.set("Authorization", `Bearer ${sessionToken}`);
  }

  const response = await fetch(`${AUTH_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AuthApiError(
      typeof data.error === "string" ? data.error : "요청에 실패했습니다.",
      response.status,
    );
  }

  return data as T;
}

export async function loginWithAuthorizationCode(
  authorizationCode: string,
  referrer: "DEFAULT" | "SANDBOX",
): Promise<LoginResponse> {
  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ authorizationCode, referrer }),
  });
}

export async function fetchMe(sessionToken: string): Promise<MeResponse> {
  return request<MeResponse>("/me", { method: "GET" }, sessionToken);
}

export async function refreshSession(
  sessionToken: string,
): Promise<MeResponse> {
  return request<MeResponse>(
    "/refresh",
    { method: "POST" },
    sessionToken,
  );
}

export async function logout(sessionToken: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(
    "/logout",
    { method: "POST" },
    sessionToken,
  );
}

export async function migrateGuestExpenses(
  sessionToken: string,
  expenses: unknown[],
): Promise<MigrateExpensesResponse> {
  return request<MigrateExpensesResponse>(
    "/migrate-expenses",
    {
      method: "POST",
      body: JSON.stringify({ expenses }),
    },
    sessionToken,
  );
}

export { AuthApiError };
