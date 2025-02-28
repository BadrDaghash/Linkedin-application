import { model, Schema, Types } from "mongoose";
import * as companyConstants from "./company.constans.js";
import Job from "../jobs/job.model.js";

const companySchema = new Schema(
  {
    companyName: { type: String, required: true, unique: true },
    companyEmail: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: {  // ✅ Corrected field name
      type: String,
      enum: Object.values(companyConstants.numberOfEmployees),
      required: true,
    }
    ,
    createdBy: { type: Types.ObjectId, ref: "User", required: true }, // ✅ Ensuring createdBy is required

    logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Types.ObjectId, ref: "User" }],
    isBanned: {type: Boolean ,default :false  } , 
    bannedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    isDeleted: {type : Boolean , default : false } , // added for soft delete  
    legalAttachment: { secure_url: String, public_id: String },

    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

companySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await Job.deleteMany({ companyId: this._id });

    next();
  }
);


companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});


const Company = model("Company", companySchema);
export default Company;
