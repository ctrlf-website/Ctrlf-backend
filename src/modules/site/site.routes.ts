import { Router } from "express";
import { SiteController } from "./site.controller";
import { verifyFirebaseToken } from "../../middleware/authHandler";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const siteRouter = Router();

siteRouter.get("/", verifyFirebaseToken, SiteController.getSite);
// siteRouter.patch("/", verifyFirebaseToken, upload.array("images", 10), SiteController.updateSite);
siteRouter.patch(
  "/",
  verifyFirebaseToken,
  upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "headerBackground", maxCount: 1 },
  ]),
  SiteController.updateSite
);

export default siteRouter;
