const UserModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../Utils/ErrorHandler");
const { userSocketMap } = require("../Socket/Scoket");
const otpGenerator = require("otp-generator");
const { sendForgotEmail, sendPassResetConfirmationEmail } = require("../Utils/useSendMail");

// Register Controller
const Register = async (req, res, next) => {
  const { firstName, lastName, email, password, profilePic } = req.body;

  if (!firstName || !lastName || !email || !password || !profilePic) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Reduced salt rounds for performance

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic,
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "10y" } // JWT expiration
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10),
      })
      .status(201)
      .json({
        message: "Registration Successful",
        data: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
        success: true,
      });
  } catch (error) {
    console.error("Registration Error:", error); // Detailed logging
    return next(errorHandler(500, "Internal Server Error"));
  }
};

// Login Controller
const Login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(errorHandler(400, "Email or Password is incorrect"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(errorHandler(400, "Email or Password is incorrect"));
    }

    if (userSocketMap[user._id.toString()]) {
      return next(
        errorHandler(400, "User is currently logged in from another device")
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10y" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10),
      })
      .status(200)
      .json({
        message: "Login Successful",
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePic: user.profilePic,
        },
        success: true,
      });
  } catch (error) {
    console.error("Login Error:", error); // Detailed logging
    return next(errorHandler(500, "Internal Server Error"));
  }
};

// Logout Controller
const Logout = async (req, res) => {
  try {
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logout Successful", success: true });
  } catch (error) {
    console.error("Logout Error:", error); // Detailed logging
    return res.status(500).json({ message: "Logout Failed", success: false });
  }
};

const sendCode = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
      digits: true,
    });

    const FullNameOfUser = user?.firstName + " " + user?.lastName;
    const response = await sendForgotEmail(email, FullNameOfUser, code);

    if (response?.success) {
      const hashedCode = await bcrypt.hash(code, 10);
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { code: hashedCode, expiresIn: Date.now() + 10 * 60 * 1000 },
        { new: true }
      ).select("-password");

      return res
        .status(200)
        .json({ message: "Code has been sent to email", user: updatedUser, success: true });
    }

    return next(errorHandler(500, "Internal Server Error"));
  } catch (error) {
    console.error("Send Code Error:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

const verifyCode = async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return next(errorHandler(400, "All fields are required"));
  }
  try { 
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }

    const isMatch = await bcrypt.compare(code, user?.code);

    if (!isMatch) {
      return next(errorHandler(400, "Code is incorrect, please try again"));
    }

    if (user?.expiresIn < Date.now()) {
      return next(errorHandler(400, "Code has expired, please try again"));
    }

    return res
      .status(200)
      .json({ message: "Code has been verified", success: true });

  } catch (error) { 
    console.error("Verify Code Error:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");
    await sendPassResetConfirmationEmail(email, updatedUser?.firstName);
    return res
      .status(200)
      .json({ message: "Password has been reset", user: updatedUser, success: true });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

module.exports = { Register, Login, Logout, sendCode, verifyCode, resetPassword };
