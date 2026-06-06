const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authController.me);
router.post("/refresh", authController.refreshSession);
router.post("/logout", authController.logout);
router.post("/migrate-expenses", authController.migrateExpenses);

router.post("/get-access-token", authController.getAccessToken);
router.post("/refresh-token", authController.refreshToken);
router.get("/get-user-info", authController.getUserInfo);
router.post("/logout-by-access-token", authController.logoutByAccessToken);
router.post("/logout-by-user-key", authController.logoutByUserKey);

module.exports = router;
