import { Schema, Types } from "mongoose";
import * as userConstans from "./user.constans.js";
import { model } from "mongoose";
import { hash } from "../../../utils/hash/hash.js";
import { decrypt, encrypt } from "../../../utils/encryption/encryption.js";

export const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider == userConstans.providers.SYSTEM ? true : false;
      },
    },
    provider: {
      type: String,
      enum: Object.values(userConstans.providers),
      default: userConstans.providers.SYSTEM,
    },
    gender: {
      type: String,
      enum: Object.values(userConstans.genders),
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age >= 18;
        },
        message: "User must be at least 18 years old.",
      },
    },
    mobileNumber: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(userConstans.roles),
      required: true,
    },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false }, // added for soft delete
    isBanned: { type: Boolean, default: false },
    bannedAt: { type: Date, default: null },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    changeCredentialTime: { type: Date },
    profilePic: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    OTP: [
      {
        code: { type: String, required: true },
        type: { type: String, enum: Object.values(userConstans.otpTypes) },
        expiresIn: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      console.log("Hashing password before saving...");

      this.password = await hash({ plainText: this.password });
      this.changeCredentialTime = new Date();
    }

    if (this.isModified("mobileNumber")) {
      this.mobileNumber = await encrypt({ plainText: this.mobileNumber });
    }

    next();
  } catch (error) {
    next(error);
  }
});

// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   if (user._decryptMobile && user.mobileNumber) {
//     console.log("Before Decryption:", user.mobileNumber);
//     user.mobileNumber = decrypt({ cipherText: user.mobileNumber });
//     console.log("After Decryption:", user.mobileNumber);
//   }
//   // delete user.password; // password not included in response if needed
//   return user;
// };

const User = model("User", userSchema);

export default User;
