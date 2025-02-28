import joi from "joi";
import * as userConstans from "./../../DB/models/user/user.constans.js";

// ! signup
export const signup = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    mobileNumber: joi
      .string()
      .pattern(/^01[0-2,5]\d{8}$/)
      .message(
        "Invalid Egyptian mobile number. It must start with 010, 011, 012, or 015 and have 11 digits."
      )
      .required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    gender: joi
      .string()
      .valid(...Object.values(userConstans.genders))
      .required(),
    DOB: joi.date().required(),
    role: joi.string().valid(...Object.values(userConstans.roles)),
  })
  .required();


// ! confirmOTP 
export const confirmOTP = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
  })
  .required();


// ! signIn 
  export const signIn = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  })
  .required();


// ! forgetPassword 
  export const forgetPassword = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// ! resetPassword
  export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    otp: joi.string().required(),
  })
  .required();

// !  refreshToken
export const refreshToken = joi
  .object({
    token: joi.string().required(), 
  })
  .required();

  // ! singupWithGmail
  export const singupWithGmail = joi
  .object({
    token: joi.string().required(), 
  })
  .required(); 
  
  // ! loginWithGmail
  export const loginWithGmail = joi
  .object({
    token: joi.string().required(), 
  })
  .required(); 