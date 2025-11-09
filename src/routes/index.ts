import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
// indexRouter.use('/site', siteRouter);
// indexRouter.use('/publish', publishRouter);

export default indexRouter;
