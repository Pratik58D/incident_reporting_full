import express from "express";
import { checkUserExists, createUser, getUsers } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.post("/",createUser);
userRouter.get("/", getUsers);
userRouter.get("/check" , checkUserExists)


export default userRouter;