

import joi from "joi";
import * as userConstans from "./../../DB/models/user/user.constans.js";

// ! uppdate user account 
export const updateUserAccount = joi
.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  mobileNumber: joi
    .string()
    .pattern(/^01[0-2,5]\d{8}$/)
    .message(
      "Invalid Egyptian mobile number. It must start with 010, 011, 012, or 015 and have 11 digits."
    )
    .required(),
  DOB: joi.date().required(),
  profilePic: joi.string().uri().optional(), 
  coverPic: joi.string().uri().optional(),
})
.required();


export const updatePassword  = joi
.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().min(6).required(),
})
.required();