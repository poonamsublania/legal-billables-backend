import express from "express";
import {
  saveAddonEmailEntry,
  getLatestAddonEmailEntry,
} from "../controllers/addonEmailController";
import { pushToClio } from "../controllers/clioPushController";

const router = express.Router();

router.post("/addon/save", saveAddonEmailEntry);
router.get("/addon/latest", getLatestAddonEmailEntry);
router.post("/clio/push-time", pushToClio);

export default router;
