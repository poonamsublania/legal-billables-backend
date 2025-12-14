import express from "express";
import {
  saveAddonEmailEntry,
  getLatestAddonEmailEntry,
} from "../controllers/addonEmailController";

const router = express.Router();

router.post("/addon/save", saveAddonEmailEntry);
router.get("/addon/latest", getLatestAddonEmailEntry);

export default router;
