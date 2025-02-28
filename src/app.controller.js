import connectDB from "./DB/connection.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";  
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import adminRouter from "./modules/Admin/admin.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import jobsRouter from "./modules/jobs/jobs.controller.js";
import "./utils/cron/cronJobs.js"
import globalErrorHandler from "./utils/error handling/globalErrorHandler.js";
import notFoundHandler from "./utils/error handling/notFoundHandler.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/Admin/graphQl/graphql.schema.js";

const bootstrap = async (app, express) => {
  await connectDB();
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false, 
  });
  app.use(limiter); 
  // Routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);
  app.use("/company", companyRouter);
  app.use("/jobs", jobsRouter);
  app.use("/graphql", createHandler({ schema: schema }));
  app.use("/uploads", express.static("uploads"));
  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;
