import express from "express";
import {
  saveAddonEmailEntry,
  getLatestAddonEmailEntry,
} from "../controllers/addonEmailController";
import { pushAddonToClio } from "../controllers/clioPushController";

const router = express.Router();

router.post("/addon/save", saveAddonEmailEntry);
router.get("/addon/latest", getLatestAddonEmailEntry);
router.post("/clio/push-addon", pushAddonToClio);

export default router;
