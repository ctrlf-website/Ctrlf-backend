import { Router } from "express";
import { BuildController} from "./build.controller.js";
import { verifyFirebaseToken } from "../../middleware/authHandler.js";

const buildRouter = Router();

buildRouter.get("/", verifyFirebaseToken, BuildController.buildSite)

export default buildRouter;
