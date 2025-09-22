import express from "express";
import { createRoadBlockage, deleteRoadBlockage, getRoadBlockageById, getRoadBlockages, updateRoadBlockage } from "../controllers/roadBlockage.controller.js";

const router = express.Router();


router.post("/" , createRoadBlockage);
router.get("/", getRoadBlockages);
router.get("/:id", getRoadBlockageById);
router.put("/:id", updateRoadBlockage);
router.delete("/:id", deleteRoadBlockage);

export default router;