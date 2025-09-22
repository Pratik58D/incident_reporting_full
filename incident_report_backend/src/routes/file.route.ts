import express from "express";
import { deleteFile, getAllFiles, uploadFile } from "../controllers/file.controller.js";
import { incidentUpload } from "../middleware/fileHandling.js";

const router = express.Router()


//upload Single file

router.post("/upload" , incidentUpload.single("file") ,uploadFile);
router.get("/" ,getAllFiles);
router.delete("/:id", deleteFile);



export default router