const crypto = require("crypto");

/** @type {Map<string, SessionRecord>} */
const sessions = new Map();

/** @type {Map<number, GuestExpenseMigration>} */
const guestMigrations = new Map();

/**
 * @typedef {object} SessionUser
 * @property {number} userKey
 * @property {string | null} gender
 * @property {number | null} birthYear
 */

/**
 * @typedef {object} SessionRecord
 * @property {string} sessionToken
 * @property {number} userKey
 * @property {string} refreshToken
 * @property {string | null} accessToken
 * @property {SessionUser} user
 * @property {number} createdAt
 */

/**
 * @typedef {object} GuestExpenseMigration
 * @property {number} userKey
 * @property {unknown[]} expenses
 * @property {number} migratedAt
 */

function createSession({ userKey, refreshToken, accessToken, user }) {
  const sessionToken = crypto.randomUUID();

  const record = {
    sessionToken,
    userKey,
    refreshToken,
    accessToken,
    user,
    createdAt: Date.now(),
  };

  sessions.set(sessionToken, record);
  return record;
}

function getSession(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  return sessions.get(sessionToken) ?? null;
}

function deleteSession(sessionToken) {
  sessions.delete(sessionToken);
}

function deleteSessionsByUserKey(userKey) {
  for (const [token, session] of sessions.entries()) {
    if (session.userKey === userKey) {
      sessions.delete(token);
    }
  }
}

function saveGuestMigration(userKey, expenses) {
  guestMigrations.set(userKey, {
    userKey,
    expenses,
    migratedAt: Date.now(),
  });
}

function getGuestMigration(userKey) {
  return guestMigrations.get(userKey) ?? null;
}

module.exports = {
  createSession,
  getSession,
  deleteSession,
  deleteSessionsByUserKey,
  saveGuestMigration,
  getGuestMigration,
};
