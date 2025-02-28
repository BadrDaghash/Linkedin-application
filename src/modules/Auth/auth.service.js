import OTP from "../../DB/models/otp/otp.model.js";
import User from "../../DB/models/user/user.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { emailEmitter } from "../../utils/emails/email.event.js";
import { subjects } from "../../utils/emails/sendEmails.js";
import Randomstring from "randomstring";
import { compare, hash } from "../../utils/hash/hash.js";
import { generateToken } from "../../utils/token/token.js";
import jwt from "jsonwebtoken";
import { encrypt } from "../../utils/encryption/encryption.js";
import { providers } from "../../DB/models/user/user.constans.js";
import { OAuth2Client } from "google-auth-library";

// ! signUp
export const signup = asyncHandler(async (req, res, next) => {
  const {
    email,
    password,
    mobileNumber,
    firstName,
    lastName,
    gender,
    DOB,
    role,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new Error("Email already exists!"));

  // ✅ Generate OTP
  const otpValue = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  const hashedOtp = await hash({ plainText: otpValue });
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiration already has a model
  //  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });

  await OTP.create({
    email,
    otp: hashedOtp,
    expiresAt: otpExpiry,
    type: "confirmEmail",
  });

  emailEmitter.emit("sendEmail", email, otpValue, subjects.register);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    // password: await hash({ plainText: password }),
    // mobileNumber: encrypt({ plainText: mobileNumber }) ,
    password,
    mobileNumber,
    gender,
    DOB,
    role,
  });

  res.status(201).json({
    message: "User registered successfully. Please verify your email.",
    result: newUser,
  });
});

// ! confirmOTP
export const confirmOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

  if (!otpRecord) return next(new Error("OTP not found"), { cause: 404 });

  if (otpRecord.expiresAt < new Date()) {
    return next(new Error("OTP has expired!"));
  }

  if (otpRecord.type !== "confirmEmail") {
    return next(new Error("Invalid OTP type!", { cause: 400 }));
  }

  const isMatch = await compare({ plainText: otp, hash: otpRecord.otp });

  if (!isMatch) {
    return next(new Error("Invalid OTP!", { cause: 400 }));
  }
  const results = await User.findOneAndUpdate({ email }, { isConfirmed: true });

  await OTP.deleteMany({ email, type: "confirmEmail" });

  return res
    .status(200)
    .json({ success: true, message: "Email confirmed successfully!", results });
});

// ! signIn
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found !", { cause: 404 }));
  if (!user.isConfirmed) {
    return next(
      new Error("Please confirm your email before logging in.", { cause: 403 })
    );
  }

  const isPasswordValid = await compare({
    plainText: password,
    hash: user.password,
  });

  if (!isPasswordValid)
    return next(new Error("Password is incorrect", { cause: 400 }));

  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
  });
});

// ! sendForgetPasswordOTP
export const sendForgetPasswordOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("Email not found!", { cause: 404 }));
  const otpValue = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  const hashedOtp = await hash({ plainText: otpValue });
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.create({
    email,
    otp: hashedOtp,
    expiresAt: otpExpiry,
    type: "resetPassword",
  });

  emailEmitter.emit("sendEmail", email, otpValue, subjects.forgetPassword);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully for password reset.",
  });
});

// ! resetPassword
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, otp } = req.body;

  const otpRecord = await OTP.findOne({ email, type: "resetPassword" }).sort({
    createdAt: -1,
  });

  if (!otpRecord)
    return next(new Error("OTP not found please try again!", { cause: 404 }));

  if (otpRecord.expiresAt < new Date())
    return next(new Error("OTP has expired!", { cause: 400 }));

  const isMatch = await compare({ plainText: otp, hash: otpRecord.otp });
  if (!isMatch) return next(new Error("Invalid OTP", { cause: 400 }));

  const hashedPassword = await hash({ plainText: password });

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  await OTP.deleteMany({ email, type: "resetPassword" });

  res.status(200).json({
    success: true,
    message: "Password reset successfully!",
    result: user,
  });
});

// ! refreshToken

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new Error("Refresh token is required!", { cause: 400 }));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded)
    return next(new Error("Invalid or expired refresh token", { cause: 401 }));

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new Error("User not found!", { cause: 404 }));
  }

  const newAccessToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  const newRefreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

// ! gmail singup and login 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signupGmail = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub } = ticket.getPayload(); 

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in instead." });
    }

    const newUser = await User.create({
      email,
      lastName: name,
      isConfirmed: true,
      provider: "GOOGLE",
    });

    const accessToken = generateToken({
      payload: { id: newUser._id, email: newUser.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    });

    const refreshToken = generateToken({
      payload: { id: newUser._id, email: newUser.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        lastName: newUser.lastName,
        provider: newUser.provider,
      },
      accessToken,
      refreshToken,
    });
 
});

 export const loginGmail = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub } = ticket.getPayload(); 

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        lastName: name,
        isConfirmed: true,
        provider: "GOOGLE",
      });
    }

    const accessToken = generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    });

    const refreshToken = generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        lastName: user.lastName,
        provider: user.provider,
      },
      accessToken,
      refreshToken,
    });
 
});