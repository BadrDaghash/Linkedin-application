import { model, Schema, Types } from "mongoose";
import * as jobConstans from "./job.constans.js";
const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },

    jobLocation: {
      type: String,
      required: true,
      enum: Object.values(jobConstans.jobLocation),
    },

    workingTime: {
      type: String,
      required: true,
      enum: Object.values(jobConstans.workingTime),
    },

    seniorityLevel: {
      type: String,
      required: true,
      enum: Object.values(jobConstans.seniorityLevels),
    },

    jobDescreption: { type: String, required: true },

    technicalSkills: [{ type: String, required: true }],

    softSkills: [{ type: String, required: true }],

    addedBy: { type: Types.ObjectId, ref: "User", required: true },

    updatedBy: { type: Types.ObjectId, ref: "User" },
    closed: { type: Boolean, default: false },
    companyId: { type: Types.ObjectId, ref: "Company", required: true },
    applications: [{ type: Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

const Job = model("Job", jobSchema);

export default Job;
