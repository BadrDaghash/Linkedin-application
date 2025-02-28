import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token/token.js";
import { asyncHandler } from "../utils/error handling/asyncHandler.js";
import User from "../DB/models/user/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return next(new Error("Token is required", { cause: 403 }));
  if (!authorization.startsWith("Bearer")) {
    return res.status(403).json({ success: false, message: "Invalid Token!" });
  }

  const token = authorization.split(" ")[1];
  const { id } = verifyToken({ token });

  const user = await User.findById(id).select("-password").lean();
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  // if(!user.isLoggedIn) return next(new Error("try to login first!"))

  req.user = user;
  return next();
});

export default isAuthenticated;
