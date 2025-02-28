import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "./../../DB/models/user/user.constans.js";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js";
import validation from "../../middleware/validation.middleware.js";
import { uploadLocal } from "../../utils/file uploading/multerCloud.js";


const router = Router();

// !  update user account

router.patch(
  "/update-account",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(userValidation.updateUserAccount),
  userService.updateUserAccount
);

router.get(
  "/login",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  userService.getUserData
);

router.get(
  "/:userId",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  userService.getUserProfile
);

router.put(
  "/update-password",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(userValidation.updatePassword),
  userService.updateUserPassword
);

router.patch(
  "/upload-profilePic",
  isAuthenticated,
  uploadLocal.single("image"), 
  isAuthorized(...Object.values(roles)),
  userService.uploadProfilePic
);
router.patch(
  "/upload-coverPic",
  isAuthenticated,
  uploadLocal.single("image"), 
  isAuthorized(...Object.values(roles)),
  userService.uploadCoverPic
);

router.delete(
  "/delete-profilePic",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  userService.deleteProfilePic
);
router.delete(
  "/delete-coverPic",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  userService.deleteCoverPic
);
router.delete(
  "/delete-user",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  userService.softDeleteUser
);

export default router;
