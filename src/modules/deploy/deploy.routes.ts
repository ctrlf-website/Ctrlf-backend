import { Router } from "express";
import { DeployController } from "./deploy.controller";
import { verifyFirebaseToken } from "../../middleware/authHandler";

const deployRouter = Router();

deployRouter.post("/", verifyFirebaseToken, DeployController.deploySite);

export default deployRouter;
