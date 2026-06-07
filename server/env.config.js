const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env.server") });

const {
  CLIENT_CERT_PATH,
  CLIENT_KEY_PATH,
  AAD_STRING,
  DECRYPTION_KEY_BASE64,
  AUTH_API_BASE,
  PORT,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET,
} = process.env;

module.exports = {
  CLIENT_CERT_PATH,
  CLIENT_KEY_PATH,
  AAD_STRING,
  DECRYPTION_KEY_BASE64,
  AUTH_API_BASE:
    AUTH_API_BASE ||
    "https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2",
  PORT: PORT || 4000,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET,
};
