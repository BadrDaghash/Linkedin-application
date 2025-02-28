import mongoose, { model, Schema, Types } from "mongoose";
import * as appEnums from './application.enums.js';

const applicationSchema = new Schema(
  {
    jobId: { type: Types.ObjectId, ref: "Job", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    userCV: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true }
    },
    status: {
      type: String,
      enum: Object.values(appEnums.applicationStatuses),
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate model registration
const Application = model("Application", applicationSchema);

export default Application;