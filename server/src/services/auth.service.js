const TLSClient = require("../clients/TLSClient");
const {
  CLIENT_CERT_PATH,
  CLIENT_KEY_PATH,
  AUTH_API_BASE,
} = require("../../env.config");

let client;

function getClient() {
  if (!CLIENT_CERT_PATH || !CLIENT_KEY_PATH) {
    throw new Error(
      "mTLS 인증서가 설정되지 않았습니다. server/.env.server 파일을 확인해 주세요.",
    );
  }

  if (!client) {
    client = new TLSClient(CLIENT_CERT_PATH, CLIENT_KEY_PATH);
  }

  return client;
}

function parseResponse(response) {
  const parsed = JSON.parse(response.data);

  if (response.statusCode && response.statusCode >= 400) {
    const message =
      parsed?.error?.reason ||
      parsed?.error ||
      parsed?.message ||
      "토스 API 요청에 실패했습니다.";
    throw new Error(message);
  }

  if (parsed?.resultType === "FAIL") {
    throw new Error(parsed.error?.reason || "토스 API 요청에 실패했습니다.");
  }

  return parsed;
}

exports.getAccessToken = async ({ authorizationCode, referrer }) => {
  const response = await getClient().post(`${AUTH_API_BASE}/generate-token`, {
    authorizationCode,
    referrer,
  });

  return parseResponse(response);
};

exports.refreshAccessToken = async ({ refreshToken }) => {
  const response = await getClient().post(`${AUTH_API_BASE}/refresh-token`, {
    refreshToken,
  });

  return parseResponse(response);
};

exports.getUserInfo = async (accessToken) => {
  const response = await getClient().get(`${AUTH_API_BASE}/login-me`, {
    Authorization: accessToken.startsWith("Bearer ")
      ? accessToken
      : `Bearer ${accessToken}`,
  });

  return parseResponse(response);
};

exports.logoutByAccessToken = async (accessToken) => {
  const response = await getClient().post(
    `${AUTH_API_BASE}/access/remove-by-access-token`,
    {},
    {
      Authorization: accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`,
    },
  );

  return parseResponse(response);
};

exports.logoutByUserKey = async ({ userKey, accessToken }) => {
  const headers = accessToken
    ? {
        Authorization: accessToken.startsWith("Bearer ")
          ? accessToken
          : `Bearer ${accessToken}`,
      }
    : {};

  const response = await getClient().post(
    `${AUTH_API_BASE}/access/remove-by-user-key`,
    { userKey },
    headers,
  );

  return parseResponse(response);
};
