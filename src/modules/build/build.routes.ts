import { Router } from "express";
import { BuildController} from "./build.controller";
import { verifyFirebaseToken } from "../../middleware/authHandler";

const buildRouter = Router();

buildRouter.post("/", verifyFirebaseToken, BuildController.buildSite)

export default buildRouter;
