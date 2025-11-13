import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import siteRouter from "../modules/site/site.routes";
import buildRouter from "../modules/build/build.routes";
import deployRouter from "../modules/deploy/deploy.routes";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/site", siteRouter);
indexRouter.use("/build", buildRouter);
indexRouter.use("/deploy", deployRouter);

export default indexRouter;
