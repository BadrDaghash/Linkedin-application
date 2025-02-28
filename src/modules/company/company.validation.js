import joi from "joi";
import * as companyConstans from "./../../DB/models/company/company.constans.js";

export const addCompany = joi
  .object({
    companyName: joi.string().required(),
    companyEmail: joi.string().email().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi
    .string() 
    .valid(...Object.values(companyConstans.numberOfEmployees))
    .required(),
    HRs:joi.string(),
  })
  .required();

  export const updateCompany = joi.object({
    companyId : joi.string().required(),
    companyName: joi.string(),
    companyEmail: joi.string().email(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi
      .string()
      .valid(...Object.values(companyConstans.numberOfEmployees))
      ,
  }).min(1); // Ensure at least one field is updated
  
  export const softDelete = joi.object({
    companyId : joi.string().required(),
  }).required();

  export const getCompanyWithJobs = joi.object({
    companyId : joi.string().required(),
  }).required();
 

  export const searchCompanyByName = joi.object({
    companyName : joi.string().required(),
  }).required();


  