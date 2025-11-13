import { Router } from "express";
import { SiteController } from "./site.controller";
import { verifyFirebaseToken } from "../../middleware/authHandler";

const siteRouter = Router();

siteRouter.get("/", verifyFirebaseToken, SiteController.getSite);
siteRouter.patch("/", verifyFirebaseToken, SiteController.updateSite);

export default siteRouter;
