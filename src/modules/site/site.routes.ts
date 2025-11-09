// src/modules/site/site.routes.ts
import { Router } from "express";
import { SiteController } from "./site.controller.js";
import { verifyFirebaseToken } from "../../middleware/authHandler.js";

const siteRouter = Router();

siteRouter.get("/", verifyFirebaseToken, SiteController.getSite);
siteRouter.patch("/", verifyFirebaseToken, SiteController.updateSite);

export default siteRouter;
