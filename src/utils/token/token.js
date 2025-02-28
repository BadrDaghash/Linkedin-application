
import jwt from "jsonwebtoken";
export const generateToken = ({
  payload,
  signature = process.env.JWT_SECRET,
  options = {},
}) => {
  return jwt.sign(payload, signature ,options);
};
export const verifyToken = ({ token, signature = process.env.JWT_SECRET, options = {} }) => {
  if (!signature) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.verify(token, signature, options);
};

