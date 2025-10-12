// src/routes/billablesRoutes.ts
import { Router } from "express";
import {
  createBillable,
  getBillables,
  updateBillable,
  deleteBillable,
} from "../controllers/billablesController";

const router = Router();

router.post("/", createBillable);
router.get("/", getBillables);
router.put("/:id", updateBillable);
router.delete("/:id", deleteBillable);

export default router;
