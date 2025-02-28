import joi from "joi";

import * as jobConstants from "./../../DB/models/jobs/job.constans.js"; 

export const addJob = joi.object({
  jobTitle: joi.string().required(),

  jobLocation: joi.string().valid(...Object.values(jobConstants.jobLocation)).required(),

  workingTime: joi.string().valid(...Object.values(jobConstants.workingTime)).required(),

  seniorityLevel: joi.string().valid(...Object.values(jobConstants.seniorityLevels)).required(),

  jobDescreption: joi.string().required(),

  technicalSkills: joi.array().items(joi.string()).required(),

  softSkills: joi.array().items(joi.string()).required(),

  closed: joi.boolean().default(false),

  companyId: joi.string().required(),
}).required();


export const updateJob = joi.object({
  jobId: joi.string().required(),
  jobTitle: joi.string(),

  jobLocation: joi.string().valid(...Object.values(jobConstants.jobLocation)),

  workingTime: joi.string().valid(...Object.values(jobConstants.workingTime)),

  seniorityLevel: joi.string().valid(...Object.values(jobConstants.seniorityLevels)),

  jobDescreption: joi.string(),

  technicalSkills: joi.array().items(joi.string()),

  softSkills: joi.array().items(joi.string()),

  closed: joi.boolean().default(false),

  companyId: joi.string(),
}).required();

export const deleteJob = joi.object({
  jobId: joi.string().required(),
}).required();


export const getJobs = joi.object({
  companyId: joi.string().optional().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid companyId format.",
  }),
  jobId: joi.string().optional().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid jobId format.",
  }),
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100).default(10),
  sort: joi.string().valid("createdAt", "jobTitle", "companyName").default("createdAt"),
  search: joi.string().optional(),
}).required();

export const getFilteredJobs = joi.object({
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100).default(10),
  sort: joi.string().valid("createdAt", "jobTitle", "companyName").default("createdAt"),
  workingTime: joi.string().optional(),
  jobLocation: joi.string().optional(),
  seniorityLevel: joi.string().optional(),
  jobTitle: joi.string().optional(),
  technicalSkills: joi.string().optional(),
}).required();
