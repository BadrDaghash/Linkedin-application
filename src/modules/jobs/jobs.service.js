import Company from "../../DB/models/company/company.model.js";
import Job from "../../DB/models/jobs/job.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import Application from "./../../DB/models/application.collection/application.model.js";
// import { getIO } from "./../../utils/socket/socket.js";
import { emailEmitter } from "../../utils/emails/email.event.js";
import { subjects } from "../../utils/emails/sendEmails.js";
// ! add job
export const addJob = asyncHandler(async (req, res, next) => {
  console.log("Logged in user ID:", req.user._id);

  const userId = req.user._id;

  const {
    companyId,
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescreption,
    technicalSkills,
    softSkills,
  } = req.body;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found!", { cause: 404 }));

  console.log("Company HRs:", company.HRs);
  console.log("Company Owner:", company.createdBy);
  console.log("Logged in User:", userId);
  const isOwner = company.createdBy.toString() === userId.toString();
  const isHr = company.HRs.some(
    (hrId) => hrId.toString() === userId.toString()
  );

  if (!isOwner && !isHr)
    return next(
      new Error("Access denied. Only company owner or HRs can add jobs.")
    );

  const job = new Job({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescreption,
    technicalSkills,
    softSkills,
    addedBy: userId,
    companyId,
  });

  await job.save();

  return res.status(201).json({
    success: true,
    message: "New job added successfully",
    results: job,
  });
});
// ! update job
export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;
  const updates = req.body;

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found!", { cause: 404 }));

  const company = await Company.findById(job.companyId);
  if (!company) return next(new Error("Company not found!", { cause: 404 }));

  // Check if the logged-in user is the company owner
  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new Error("Access denied! Only the company owner can update this job.", {
        cause: 403,
      })
    );
  }

  updates.updatedBy = userId;
  const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
    new: true, 
    runValidators: true, 
  });

  return res.status(200).json({
    success: true,
    message: "Job updated successfully",
    results: updatedJob,
  });
});
// ! delete job
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user?._id;

  if (!userId)
    return next(
      new Error("Unauthorized! User not authenticated", { cause: 401 })
    );

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found!", { cause: 404 }));

  const company = await Company.findById(job.companyId);
  if (!company) return next(new Error("Company not found!", { cause: 404 }));

  // checking if the requesting user is an HR in this company
  const isHR = company.HRs.some(
    (hrId) => hrId.toString() === userId.toString()
  );

  if (!isHR) {
    return next(
      new Error("Unauthorized! Only HRs can delete jobs.", { cause: 403 })
    );
  }

  await Job.findByIdAndDelete(jobId);
  res.status(200).json({ message: "Job deleted successfully!" });
});
// ! get jobs
export const getJobs = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const { page = 1, limit = 10, sort = "createdAt", search } = req.query;

  const skip = (page - 1) * limit;
  const query = {};

  if (search) {
    const formatSearchQuery = (str) =>
      str.charAt(0).toLowerCase() + str.slice(1);

    const company = await Company.findOne({
      companyName: new RegExp(`^${formatSearchQuery(search)}`, "i"),
    });

    if (!company) return next(new Error("Company not found!", { cause: 404 }));

    query.companyId = company._id;
  }

  if (companyId) query.companyId = companyId;

  if (jobId) {
    const job = await Job.findOne({ _id: jobId, ...query });
    if (!job) return next(new Error("Job not found!", { cause: 404 }));
    return res.status(200).json({ success: true, job });
  }

  const jobs = await Job.find(query)
    .sort({ [sort]: -1 })
    .skip(skip)
    .limit(limit);
  const totalCount = await Job.countDocuments(query);

  return res.status(200).json({
    success: true,
    page: Number(page),
    limit: Number(limit),
    totalCount,
    jobs,
  });
});

// ! get filtered
export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sort = "createdAt", ...filters } = req.query;

  const skip = (page - 1) * limit;
  const query = {};

  //  Applying filters if they exist
  if (filters.workingTime) query.workingTime = filters.workingTime;
  if (filters.jobLocation) query.jobLocation = filters.jobLocation;
  if (filters.seniorityLevel) query.seniorityLevel = filters.seniorityLevel;
  if (filters.jobTitle) query.jobTitle = new RegExp(filters.jobTitle, "i"); // Case = insensitive search

  // Filter by technical skills (partial match)
  if (filters.technicalSkills) {
    query.technicalSkills = { $regex: filters.technicalSkills, $options: "i" };
  }

  const jobs = await Job.find(query)
    .sort({ [sort]: -1 })
    .skip(skip)
    .limit(limit);
  const totalCount = await Job.countDocuments(query);

  return res.status(200).json({
    success: true,
    page: Number(page),
    limit: Number(limit),
    totalCount,
    jobs,
  });
});

// ! get all applications
export const getJobApplications = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { page = 1, limit = 10, sort = "createdAt" } = req.query;
  const userId = req.user._id;

  const skip = (page - 1) * limit;

  const job = await Job.findById(jobId).populate({
    path: "applications",
    populate: { path: "userId", select: "name email phone" },
    options: { sort: { [sort]: -1 }, skip, limit: Number(limit) },
  });
  if (!job) return next(new Error("Job not found!", { cause: 404 }));

  const company = await Company.findById(job.companyId);
  if (!company) return next(new Error("Company not found!", { cause: 404 }));

  if (
    company.createdBy.toString() !== userId.toString() &&
    req.user.role !== "HR"
  ) {
    return next(
      new Error(
        "Access denied! Only the company owner or HR can view applications.",
        { cause: 403 }
      )
    );
  }

  return res.status(200).json({
    success: true,
    page: Number(page),
    limit: Number(limit),
    totalApplications: job.applications.length,
    applications: job.applications,
  });
});

// ! apply to job
export const applyToJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { resume, coverLetter, userCV } = req.body;
  const userId = req.user._id;

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found!", { cause: 404 }));

  const existingApplication = await Application.findOne({ jobId, userId });
  if (existingApplication) {
    return next(
      new Error("You have already applied for this job!", { cause: 400 })
    );
  }

  if (!userCV || !userCV.secure_url || !userCV.public_id) {
    return next(new Error("User CV is required!", { cause: 400 }));
  }

  if (!userCV.secure_url.endsWith(".pdf")) {
    return next(
      new Error("Only PDF files are allowed for CV!", { cause: 400 })
    );
  }

  const application = await Application.create({
    jobId,
    userId,
    userCV,
    status: "pending",
  });

  // Emit socket event for HR notification
  const io = req.app.get("io");
  if (io) {
    io.emit("newApplication", {
      jobId,
      userId,
      applicationId: application._id,
      message: "A new job application has been submitted!",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully!",
    application,
  });
});

export const applicationDecision = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { decision } = req.body;

  const application = await Application.findById(applicationId).populate(
    "userId"
  );

  if (!application)
    return next(new Error("Application not found!", { cause: 404 }));

  if (application.status !== "pending")
    return next(new Error("Application already processed!"));
  application.status = decision;
  await application.save();
  const { email, firstName } = application.userId;


  emailEmitter.emit("jobApplicationEmail", email, firstName, decision);


  return res.status(200).json({ success: true, message: `Application ${decision} successfully!` });

});
