import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import validation from "../../middleware/validation.middleware.js";

const router = Router();

// ! signUp
router.post("/signup", validation(authValidation.signup), authService.signup);

// ! confirm-otp
router.post(
  "/confirm-otp",
  validation(authValidation.confirmOTP),
  authService.confirmOTP
);

// ! signUp
router.post("/signIn", validation(authValidation.signIn), authService.signIn);

// ! forget-password
router.post(
  "/forget-password",
  validation(authValidation.forgetPassword),
  authService.sendForgetPasswordOTP
);
// ! reset password
router.post(
  "/reset-password",
  validation(authValidation.resetPassword),
  authService.resetPassword
);
// ! refresh token 
router.post("/refresh-token" , validation(authValidation.refreshToken) , authService.refreshToken)

// ! signUp with gmail 
router.post("/signupGmail" , validation(authValidation.singupWithGmail) ,authService.signupGmail)

// ! login with gmail
router.post("/loginGmail" , validation(authValidation.loginWithGmail) ,authService.loginGmail)


export default router;
