// backend/src/routes/clientRoutes.ts
import express from "express";
import { getAllClients, createClient, updateClient, deleteClient } from "../controllers/clientController";

const router = express.Router();

router.get("/", getAllClients);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
