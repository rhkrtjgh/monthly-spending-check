const crypto = require("crypto");

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function signSupabaseJwt(userKey, secret, expiresInSeconds = 60 * 60) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      aud: "authenticated",
      exp: now + expiresInSeconds,
      iat: now,
      iss: "supabase",
      role: "authenticated",
      sub: String(userKey),
      userkey: userKey,
    }),
  );

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

module.exports = signSupabaseJwt;
