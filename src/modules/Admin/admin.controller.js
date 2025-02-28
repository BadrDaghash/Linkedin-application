import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import * as adminService from "./admin.service.js"
import * as adminValidation from "./admin.validation.js"
import { roles } from "../../DB/models/user/user.constans.js";
const router = Router();
// ! Toggle user 
router.put("/ban-user/:id" , isAuthenticated , isAuthorized(roles.ADMIN)  , adminService.banToggleUser )
// ! Toggle company
router.put("/ban-company/:id" , isAuthenticated , isAuthorized(roles.ADMIN)  , adminService.banToggleCompany )
// ! Approve company
router.put("/approve-company/:id" , isAuthenticated , isAuthorized(roles.ADMIN)  , adminService.approveCompany )

export default router;