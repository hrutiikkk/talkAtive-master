const express = require("express");
const { Register, Login, Logout, sendCode, verifyCode, resetPassword } = require("../Controllers/authController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

module.exports = router;
