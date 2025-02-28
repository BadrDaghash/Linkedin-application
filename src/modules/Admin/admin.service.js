import User from "../../DB/models/user/user.model.js";
import Company from "../../DB/models/company/company.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";

// ! Toggle user
export const banToggleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new Error("User not found! ", { cause: 404 }));
  user.isBanned = !user.isBanned;
  user.bannedAt = new Date()
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBanned ? "banned " : "unbanned"} successfully `,
    user,
  });
});
// ! Toggle company
export const banToggleCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) return next(new Error("Company not found! ", { cause: 404 }));
  company.isBanned = !company.isBanned;
  company.bannedAt = new Date()

  await company.save();

  res.status(200).json({
    success: true,
    message: `Company ${
      company.isBanned ? "banned " : "unbanned"
    } successfully `,
    company,
  });
});

// ! Approve company

export const approveCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    { approvedByAdmin: true },
    { new: true }
  );

  if (!company) return next(new Error("Company not found! ", { cause: 404 }));
  res.status(200).json({
    success: true,
    message: "Company approved successfully",
    company,
  });
});
