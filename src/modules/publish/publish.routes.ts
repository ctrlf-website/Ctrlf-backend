import { Router } from "express";
import { PublishController } from "./publish.controller.js";
import { verifyFirebaseToken } from "../../middleware/authHandler.js";

const publishRouter = Router();

publishRouter.get("/", verifyFirebaseToken, PublishController.publishSite)

export default publishRouter;
