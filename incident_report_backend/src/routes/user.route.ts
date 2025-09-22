import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.post("/",createUser);
userRouter.get("/", getUsers);


export default userRouter;