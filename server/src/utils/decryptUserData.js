const crypto = require("crypto");

function decryptUserData(encryptedBase64, base64EncodedKey, aad) {
  const IV_LENGTH = 12;

  const decoded = Buffer.from(encryptedBase64, "base64");
  const key = Buffer.from(base64EncodedKey, "base64");

  const iv = Buffer.from(decoded.subarray(0, IV_LENGTH));
  const ciphertext = Buffer.from(decoded.subarray(IV_LENGTH));

  const tag = Buffer.from(ciphertext.subarray(ciphertext.length - 16));
  const encrypted = Buffer.from(ciphertext.subarray(0, ciphertext.length - 16));

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(Buffer.from(aad));
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}

module.exports = decryptUserData;
