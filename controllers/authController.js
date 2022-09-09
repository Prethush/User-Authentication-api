const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// handle user register
const handleUserRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({ status: false, message: "Enter all fields" });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ status: true, message: "User is successfully created" });
  } catch (err) {
    next(err);
  }
};

// handle user login
const handleUserLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: false, message: "Enter all fields" });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Email is not registered" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res
        .status(400)
        .json({ status: false, message: "Password is incorrect" });
    }
    const accessToken = await jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10d" }
    );
    res.status(200).json({
      success: true,
      message: "Login successfull",
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  handleUserRegister,
  handleUserLogin,
};
