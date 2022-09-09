const router = require("express").Router();
const {
  handleUserRegister,
  handleUserLogin,
} = require("../controllers/authController");

// register user
router.post("/register", handleUserRegister);

// login user
router.post("/login", handleUserLogin);
module.exports = router;
