import type { Request , Response } from "express";
import type { User } from "../lib/types.js";
import { pool } from "../config/db.js";



export const createUser = async(req : Request , res: Response) =>{

    try {
        const {name , email , role , phone_number} =req.body as User;
        const result = await pool.query(
            `INSERT INTO users (name , email , phone_number ,role) VALUES ($1,$2,$3,$4) RETURNING *`,
            [name, email, phone_number , role ]
        )
        return res.status(201).json({message :"user created sucessfully" ,user : result.rows[0]})
    } catch (error :any) {

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