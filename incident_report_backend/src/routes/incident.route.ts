import express from "express";
import { createIncident, deleteIncident, getAllIncidents, getHazardIncident, getIncidentById, updateIncident } from "../controllers/incident.controller.js";



const router = express.Router();

router.post("/", createIncident);
router.get("/" , getAllIncidents);

router.get("/incident-hazard" , getHazardIncident);

router.get("/:id" , getIncidentById);
router.put("/:id" , updateIncident);
router.delete("/:id" , deleteIncident);


export default router;