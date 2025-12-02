import { Router } from "express";
import { SiteController } from "./site.controller";
import { verifyFirebaseToken } from "../../middleware/authHandler";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const siteRouter = Router();

siteRouter.get("/", verifyFirebaseToken, SiteController.getSite);
siteRouter.patch("/", verifyFirebaseToken, upload.single("logo"),  SiteController.updateSite);

export default siteRouter;
