import User from "../../DB/models/user/user.model.js";

import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { compare, hash } from "../../utils/hash/hash.js";
import fs from "fs";
import path from "path";


// ! update user account
export const updateUserAccount = asyncHandler(async (req, res, next) => {
  const { mobileNumber, DOB, firstName, lastName, gender } = req.body;
  const userId = req.user._id;

  const updates = { firstName, lastName, DOB, gender };

  if (mobileNumber) {
    updates.mobileNumber = encrypt({ plainText: mobileNumber });
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  });

  if (!updatedUser) return next(new Error("User not found !", { cause: 404 }));

  res.status(200).json({
    message: "User account updated successfully.",
    user: updatedUser,
  });
});

// ! get login user data
export const getUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new Error("User not found!", { cause: 404 }));

  res.status(200).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      DOB: user.DOB,
      mobileNumber: decrypt({ cipherText: user.mobileNumber }),
    },
  });
});
// ! get user profile
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(
      new Error("User ID is missing in the request!", { cause: 400 })
    );
  }
  const user = await User.findById(userId).select(
    "firstName lastName mobileNumber profilePic coverPic"
  );

  if (!user) return next(new Error("User not found!", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "User found successfully",
    results: {
      user: {
        userName: `${user.firstName} ${user.lastName}`,
        mobileNumber: decrypt({ cipherText: user.mobileNumber }),
      },
    },
  });
});

// ! update user profile
export const updateUserPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) return next(new Error("User not found!", { cause: 404 }));

  const isMatch = await compare({
    plainText: oldPassword,
    hash: user.password,
  });

  if (!isMatch)
    return next(new Error("oldPassword is incorrect", { cause: 400 }));

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});

// ! upload profile picture
export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  console.log("File received:", req.file);

  if (!req.file) {
    return next(new Error("Please upload a profile picture!", { cause: 400 }));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic: req.file.path },
    { new: true }
  );

  return res.status(200).json({
    message: "Profile picture uploaded successfully!",
    profilePic: user.profilePic,
  });
});

// ! upload cover pic

export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  console.log("File received:", req.file);

  if (!req.file) {
    return next(new Error("Please upload a Cover picture!", { cause: 400 }));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { coverPic: req.file.path },
    { new: true }
  );

  return res.status(200).json({
    message: "Cover picture uploaded successfully!",
    profilePic: user.profilePic,
  });
});


export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new Error("User not found!", { cause: 404 }));

  console.log("Stored profilePic path:", user.profilePic);

  if (!user.profilePic) return next(new Error("No valid profile picture found!", { cause: 400 }));

  const imagePath = path.resolve("uploads", String(user.profilePic));
  console.log("Resolved Image Path:", imagePath);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log("File deleted successfully.");
  } else {
    console.log("File does not exist:", imagePath);
  }

  user.profilePic = null;
  await user.save();

  return res.json({ success: true, message: "Profile picture deleted!", results: { user } });
});
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new Error("User not found!", { cause: 404 }));

  console.log("Stored coverPic path:", user.coverPic);

  if (!user.coverPic) return next(new Error("No valid cover picture found!", { cause: 400 }));

  const imagePath = path.resolve("uploads", String(user.coverPic));
  console.log("Resolved Image Path:", imagePath);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log("File deleted successfully.");
  } else {
    console.log("File does not exist:", imagePath);
  }

  user.coverPic = null;
  await user.save();

  return res.json({ success: true, message: "Cover picture deleted!", results: { user } });
});


export const softDeleteUser = asyncHandler(async( req, res, next ) => { 

  const user = await User.findByIdAndUpdate(req.user._id , {isDeleted : true } , { new : true })

   
  if(!user) return next(new Error("User not found !" ,{ cause : 404}))

  return res.status(200).json({success:true , message :"User deleted successfully"})


})