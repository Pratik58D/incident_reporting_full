import express from "express";
import { createMessage, getMessageByIncident } from "../controllers/chitchat.controller.js";
import { messageUpload } from "../middleware/fileHandling.js";

const router = express.Router();


router.post("/:incidentId" ,messageUpload.single('file') ,createMessage);
router.get("/:incidentId" , getMessageByIncident);

export default router;