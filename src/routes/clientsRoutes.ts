import express from "express";
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/clientsController";

const router = express.Router();

// CRUD routes
router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
