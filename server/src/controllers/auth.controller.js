const authService = require("../services/auth.service");
const sessionStore = require("../services/sessionStore");
const decryptUserInfo = require("../utils/decryptUserInfo");
const signSupabaseJwt = require("../utils/signSupabaseJwt");
const { SUPABASE_JWT_SECRET } = require("../../env.config");

function extractBirthYear(birthday) {
  if (!birthday || birthday.length < 4) {
    return null;
  }

  const year = Number.parseInt(birthday.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

function toPublicUser(decryptedUser) {
  return {
    userKey: decryptedUser.userKey,
    gender: decryptedUser.gender ?? null,
    birthYear: extractBirthYear(decryptedUser.birthday),
  };
}

function withSupabaseAccessToken(userKey, body) {
  if (!SUPABASE_JWT_SECRET) {
    return body;
  }

  return {
    ...body,
    supabaseAccessToken: signSupabaseJwt(userKey, SUPABASE_JWT_SECRET),
  };
}

function getBearerToken(headerValue) {
  if (!headerValue) {
    return null;
  }

  if (headerValue.startsWith("Bearer ")) {
    return headerValue.slice("Bearer ".length);
  }

  return headerValue;
}

exports.login = async (req, res) => {
  try {
    const { authorizationCode, referrer } = req.body;

    if (!authorizationCode || !referrer) {
      return res.status(400).json({
        error: "authorizationCode와 referrer가 필요합니다.",
      });
    }

    const tokenResult = await authService.getAccessToken({
      authorizationCode,
      referrer,
    });

    const accessToken = tokenResult.success?.accessToken;
    const refreshToken = tokenResult.success?.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(500).json({
        error: "AccessToken 또는 RefreshToken을 받지 못했습니다.",
      });
    }

    const userResult = await authService.getUserInfo(accessToken);
    const decryptedUser = decryptUserInfo(userResult.success);
    const user = toPublicUser(decryptedUser);

    const session = sessionStore.createSession({
      userKey: user.userKey,
      refreshToken,
      accessToken,
      user,
    });

    return res.status(200).json(
      withSupabaseAccessToken(user.userKey, {
        sessionToken: session.sessionToken,
        user,
      }),
    );
  } catch (error) {
    console.error("login failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const sessionToken = getBearerToken(req.headers.authorization);
    const session = sessionStore.getSession(sessionToken);

    if (!session) {
      return res.status(401).json({ error: "유효하지 않은 세션입니다." });
    }

    return res
      .status(200)
      .json(withSupabaseAccessToken(session.userKey, { user: session.user }));
  } catch (error) {
    console.error("me failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.refreshSession = async (req, res) => {
  try {
    const sessionToken = getBearerToken(req.headers.authorization);
    const session = sessionStore.getSession(sessionToken);

    if (!session) {
      return res.status(401).json({ error: "유효하지 않은 세션입니다." });
    }

    const tokenResult = await authService.refreshAccessToken({
      refreshToken: session.refreshToken,
    });

    const accessToken = tokenResult.success?.accessToken;
    const refreshToken = tokenResult.success?.refreshToken ?? session.refreshToken;

    if (!accessToken) {
      return res.status(500).json({ error: "AccessToken 재발급에 실패했습니다." });
    }

    session.accessToken = accessToken;
    session.refreshToken = refreshToken;

    const userResult = await authService.getUserInfo(accessToken);
    const decryptedUser = decryptUserInfo(userResult.success);
    session.user = toPublicUser(decryptedUser);

    return res
      .status(200)
      .json(withSupabaseAccessToken(session.userKey, { user: session.user }));
  } catch (error) {
    console.error("refreshSession failed:", error);
    return res.status(401).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const sessionToken = getBearerToken(req.headers.authorization);
    const session = sessionStore.getSession(sessionToken);

    if (!session) {
      return res.status(401).json({ error: "유효하지 않은 세션입니다." });
    }

    if (session.accessToken) {
      try {
        await authService.logoutByAccessToken(session.accessToken);
      } catch (error) {
        console.warn("logoutByAccessToken failed:", error.message);
      }
    }

    sessionStore.deleteSession(sessionToken);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("logout failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.migrateExpenses = async (req, res) => {
  try {
    const sessionToken = getBearerToken(req.headers.authorization);
    const session = sessionStore.getSession(sessionToken);

    if (!session) {
      return res.status(401).json({ error: "유효하지 않은 세션입니다." });
    }

    const { expenses } = req.body;

    if (!Array.isArray(expenses)) {
      return res.status(400).json({ error: "expenses 배열이 필요합니다." });
    }

    sessionStore.saveGuestMigration(session.userKey, expenses);

    return res.status(200).json({
      ok: true,
      migratedCount: expenses.length,
    });
  } catch (error) {
    console.error("migrateExpenses failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Example-compatible endpoints
exports.getAccessToken = async (req, res) => {
  try {
    const { authorizationCode, referrer } = req.body;

    if (!authorizationCode || !referrer) {
      return res.status(400).json({ error: "authorizationCode가 필요합니다." });
    }

    const response = await authService.getAccessToken({
      authorizationCode,
      referrer,
    });

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("getAccessToken failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken이 필요합니다." });
    }

    const response = await authService.refreshAccessToken({ refreshToken });
    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("refreshToken failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(400).json({ error: "Authorization 헤더가 필요합니다." });
    }

    const response = await authService.getUserInfo(authorization);
    const decryptedUser = decryptUserInfo(response.success);

    return res.status(200).json({
      data: {
        ...response,
        success: decryptedUser,
      },
    });
  } catch (error) {
    console.error("getUserInfo failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.logoutByAccessToken = async (req, res) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(400).json({ error: "Authorization 헤더가 필요합니다." });
    }

    const response = await authService.logoutByAccessToken(authorization);
    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("logoutByAccessToken failed:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.logoutByUserKey = async (req, res) => {
  try {
    const { userKey } = req.body;

    if (!userKey) {
      return res.status(400).json({ error: "userKey가 필요합니다." });
    }

    const response = await authService.logoutByUserKey({ userKey });
    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("logoutByUserKey failed:", error);
    return res.status(500).json({ error: error.message });
  }
};
