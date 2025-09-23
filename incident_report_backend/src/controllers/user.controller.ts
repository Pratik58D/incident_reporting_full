import type { Request , Response } from "express";
import type { User } from "../lib/types.js";
import { pool } from "../config/db.js";

export const createUser = async(req : Request , res: Response) =>{
    try {
      // console.log("incoming body: " , req.body);
        const {name, phone_number , email , role } =req.body as User;

        if(!name || !phone_number){
          return res.status(400).json({error:"Name and Phone number are required"})
        }

        const result = await pool.query(
            `INSERT INTO users (name , phone_number ,email ,role) VALUES ($1,$2,$3,COALESCE($4, 'reporter')) RETURNING *`,
            [name, email || null , phone_number , role ]
        )
        return res.status(201).json({message :"user created sucessfully" ,user : result.rows[0]})
    } catch (error :any) {
      console.error(error)
      return res.status(500).json({error : error.message});
    }
}

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return res.json(result.rows);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};