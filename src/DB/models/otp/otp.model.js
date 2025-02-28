import { Schema , model } from "mongoose";
import * as otpConstans from "./otp.constans.js";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(otpConstans.types),
    },
  },
  { timestamps: true }
);

const OTP = model("OTP", otpSchema);

export default OTP;
