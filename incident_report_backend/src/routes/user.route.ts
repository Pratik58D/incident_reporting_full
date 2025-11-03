import express from "express";
import { checkUserExists, createUser, getUsers, login, logout, refreshAccessToken, signup } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";


const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login" , login)
userRouter.post("/refresh" , refreshAccessToken);
userRouter.post("/logout", logout);

userRouter.post("/",createUser);
userRouter.get("/", getUsers);
userRouter.get("/check" , checkUserExists)

userRouter.get("/me", verifyAccessToken , (req,res)=>{
    res.json({message : "You are authorized" , user : (req as any).user})
});


export default userRouter;