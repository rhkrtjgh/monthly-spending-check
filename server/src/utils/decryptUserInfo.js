const decryptUserData = require("./decryptUserData");
const { DECRYPTION_KEY_BASE64, AAD_STRING } = require("../../env.config");

function decryptUserInfo(userInfo) {
  if (!DECRYPTION_KEY_BASE64 || !AAD_STRING) {
    throw new Error(
      "복호화 키가 설정되지 않았습니다. server/.env.server 파일을 확인해 주세요.",
    );
  }

  const fields = [
    "ci",
    "name",
    "phone",
    "gender",
    "nationality",
    "birthday",
    "email",
  ];

  const decrypted = {};

  for (const key of fields) {
    const value = userInfo?.[key];
    decrypted[key] =
      typeof value === "string"
        ? decryptUserData(value, DECRYPTION_KEY_BASE64, AAD_STRING)
        : null;
  }

  return {
    ...userInfo,
    ...decrypted,
  };
}

module.exports = decryptUserInfo;
