import Company from "../../DB/models/company/company.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import fs from "fs";
import path from "path";
// ! create company
export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    HRs
  } = req.body;

  const existingCompany = await Company.findOne({
    $or: [{ companyName }, { companyEmail }],
  });

  if (existingCompany)
    return next(
      new Error("Company with this name or email already exists!", {
        cause: 400,
      })
    );

  const newCompany = await Company.create({
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    createdBy: req.user._id,
    HRs,
  });

  return res.status(201).json({ success: true, company: newCompany });
});

// ! update company

export const updateCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const updates = req.body;

  if ("legalAttachment" in updates)
    return next(
      new Error("Legal attachment cannot be updated!", { cause: 403 })
    );

  const company = await Company.findById(companyId);

  if (!company) return next(new Error("Company not found!"));

  if (company.createdBy.toString() !== req.user._id.toString())
    return next(new Error("You are not authorized to update this company!"));

  const updatedCompany = await Company.findByIdAndUpdate(companyId, updates, {
    new: true,
  });

  return res.status(200).json({ success: true, company: updatedCompany });
});

// ! sofeDelete

export const softDeleteCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId);

  if (!company) return next(new Error("Company not found!", { cause: 404 }));

  if (
    req.user.role !== "admin" &&
    company.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("You are not authorized to delete this company!", {
        cause: 403,
      })
    );
  }
  company.deletedAt = new Date();
  company.isDeleted = true;
  await company.save();

  res
    .status(200)
    .json({ success: true, message: "Company deleted successfully!" });
});

// ! get specific company related jobs
export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId).populate("jobs").lean();

  if (!company) return next(new Error("Company not found ", { cause: 404 }));

  if (company.jobs || company.jobs.length === 0)
    return res.status(200).json({
      success: true,
      message: "This ccompany has no jobs available",
      company,
    });

  return res.status(200).json({ success: true, company });
});

// ! search for a company name

export const searchCompanyByName = asyncHandler(async (req, res, next) => {
  let { companyName } = req.query;

  if (!companyName || typeof companyName !== "string") {
    return next(new Error("Invalid company name", { cause: 400 }));
  }

  const companies = await Company.find({
    companyName: { $regex: new RegExp(companyName, "i") },
  });

  if (!companies.length) {
    return next(new Error("Company not found!", { cause: 404 }));
  }

  return res.status(200).json({ success: true, companies });
});

// ! upload compoany logo
export const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return next(new Error("No file uploaded", { cause: 400 }));
  }

  const logoPath = `/uploads/companies/Logo/${req.file.filename}`;
  const company = await Company.findByIdAndUpdate(
    req.params.companyId,
    { logo: logoPath },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Logo uploaded successfully",
    logo: company.logo,
  });
});

// ! upload compoany cover picture
export const uploadCompanyCoverPic = asyncHandler(async (req, res) => {
  if (!req.file) return next(new Error("No file uploaded", { cause: 400 }));

  const coverPicPath = `/uploads/companies/coverPic/${req.file.filename}`;

  const company = await Company.findByIdAndUpdate(
    req.params.companyId,
    { coverPic: coverPicPath },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "coverPic uploaded successfully",
    coverPic: company.coverPic,
  });
});

// ! delete company Logo
export const deleteCompanyLogo = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);

  if (!company) return next(new Error("Company not found", { cause: 404 }));



  if (company.logo) {
    const filePath = path.resolve("uploads", String(company.logo));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete file
  }

  company.logo = null;
  await company.save();

  res.status(200).json({
    success: true,
    message: "Company logo deleted successfully",
  });
});

// ! delete company cover Pic 
export const deleteCompanyCoverPic = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);

  if (!company) return next(new Error("Company not found", { cause: 404 }));

  if (company.coverPic) {
    const filePath = path.resolve("uploads", String(company.coverPic));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete file
  }

  company.coverPic = null;
  await company.save();

  res.status(200).json({
    success: true,
    message: "Company cover picture deleted successfully",
  });
});
