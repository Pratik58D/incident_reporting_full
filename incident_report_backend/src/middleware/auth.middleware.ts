import type {Request , Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// middleware to verify access Token
export const verifyAccessToken = (req:Request , res: Response , next: NextFunction) =>{
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message: "Access token missing"})
    }
    const token = authHeader.split(" ")[1];
    try {
        if (!token) {
         throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string); 
        // there should not be no any
        (req as any).user = decoded;

        next()
    } catch (error) {
        return res.status(403).json({message :"Invalid or expired access Token"});   
    }
}