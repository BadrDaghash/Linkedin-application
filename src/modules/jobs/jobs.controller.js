import { Router } from "express";
import * as jobsService from "./jobs.service.js";
import * as jobsValidation from "./jobs.validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import { roles } from "../../DB/models/user/user.constans.js";
import { uploadLocal } from "../../utils/file uploading/multerCloud.js";

const router = Router();

// ! add job
router.post(
  "/add",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(jobsValidation.addJob),
  jobsService.addJob
);

// ! update job
router.post(
  "/update/:jobId",
  isAuthenticated,
  validation(jobsValidation.updateJob),
  jobsService.updateJob
);

// ! delete job
router.delete(
  "/delete/:jobId",
  isAuthenticated,
  validation(jobsValidation.deleteJob) , 
  isAuthorized(...Object.values(roles)),
  jobsService.deleteJob
);
// ! get jobs
router.get(
  "/:companyId?/jobs/:jobId?", 
  isAuthenticated,
  validation(jobsValidation.getJobs) , 
  isAuthorized(...Object.values(roles)),
  jobsService.getJobs
);

// ! get filterd jobs
router.get(
  "/jobs",
  isAuthenticated,
  validation(jobsValidation.getFilteredJobs) , 
  isAuthorized(roles.ADMIN || roles.HR),
  jobsService.getFilteredJobs
);

// ! get all applications
router.get(
  "/applications/:jobId",
  isAuthenticated,
  
  isAuthorized(roles.ADMIN || roles.HR),
  jobsService.getJobApplications
);

// ! apply
router.post(
  "/apply/:jobId",
  isAuthenticated,
  isAuthorized(roles.USER),
  uploadLocal.single("userCV"),
  jobsService.applyToJob
);

// ! applycation decision
router.post(
  "/application/:applicationId",
  isAuthenticated,
  isAuthorized(roles.HR),
  jobsService.applicationDecision
);

export default router;
