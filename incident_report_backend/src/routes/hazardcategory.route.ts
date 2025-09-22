import express from "express";
import { createHazardCategory, deleteHazard, getAllHazards, getHazardById, updateHazard } from "../controllers/hazardcategory.controller.js";

const hazardRouter = express.Router();


hazardRouter.post("/" , createHazardCategory);
hazardRouter.get("/" , getAllHazards)
hazardRouter.get("/:id" , getHazardById)
hazardRouter.put("/:id" , updateHazard);
hazardRouter.delete("/:id",deleteHazard);


export default hazardRouter;