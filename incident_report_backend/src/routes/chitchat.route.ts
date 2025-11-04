import express from "express";
import { createMessage, getMessageByIncident } from "../controllers/chitchat.controller.js";
import { messageUpload } from "../middleware/fileHandling.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/:incidentId" , verifyAccessToken, messageUpload.single('file'),createMessage);
router.get("/:incidentId" , getMessageByIncident);

export default router;