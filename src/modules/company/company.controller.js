import { Router } from "express";

import * as companyService from "./company.service.js";
import * as companyValidation from "./company.validation.js";
// import * as companyEndpoints from "./company.endpoints.js" ;
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import { roles } from "../../DB/models/user/user.constans.js";
import { uploadLocal } from "../../utils/file uploading/multerCloud.js";

const router = Router();
// create company
router.post(
  "/add-company",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(companyValidation.addCompany),
  companyService.addCompany
);
// update company
router.patch(
  "/:companyId",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(companyValidation.updateCompany),
  companyService.updateCompany
);
// soft delete
router.delete(
  "/:companyId",
  isAuthenticated,
  isAuthorized(roles.ADMIN),
  validation(companyValidation.softDelete),
  companyService.softDeleteCompany
);
// company jobs
router.get(
  "/jobs/:companyId",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(companyValidation.getCompanyWithJobs),
  companyService.getCompanyWithJobs
);

// search with name
router.get(
  "/search",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  validation(companyValidation.searchCompanyByName),
  companyService.searchCompanyByName
);

// upload company logo 
router.post(
  "/upload-logo/:companyId",
  isAuthenticated,
  uploadLocal.single("image"),
  isAuthorized(...Object.values(roles)),
  companyService.uploadCompanyLogo
);
// upload company coverPic  

router.post(
  "/upload-coverPic/:companyId",
  isAuthenticated,
  uploadLocal.single("image"),
  isAuthorized(...Object.values(roles)),
  companyService.uploadCompanyCoverPic
);
// delete company Logo  

router.delete(
  "/delete-logo/:companyId",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  companyService.deleteCompanyLogo
);
// delete company coverPic  

router.delete(
  "/delete-coverPic/:companyId",
  isAuthenticated,
  isAuthorized(...Object.values(roles)),
  companyService.deleteCompanyCoverPic
);

export default router;
