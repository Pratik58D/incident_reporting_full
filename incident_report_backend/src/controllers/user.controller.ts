import type { Request , Response } from "express";
import type { User } from "../lib/types.js";
import { pool } from "../config/db.js";

export const createUser = async(req : Request , res: Response) =>{
    try {
        const {name, phone_number , email , role } =req.body as User;
        if(!name || !phone_number){
          return res.status(400).json({error:"Name and Phone number are required"})
        }
        const result = await pool.query(
            `INSERT INTO users (name , phone_number ,email ,role) VALUES ($1,$2,$3,COALESCE($4, 'reporter')) RETURNING *`,
            [name,  phone_number ,email || null , role ]
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


export const checkUserExists = async(req : Request, res : Response) =>{
  const {phone_number ,email} = req.query;
  try {
    let query = `SELECT * FROM users WHERE 1=1 `;
    const values : any[]=[];

    if(phone_number){
      values.push(phone_number)
      query += `AND phone_number = $${values.length}`;
    }
    if (email) {
          values.push(email);
          query += ` AND email = $${values.length}`;
      }
     const result = await pool.query(query, values);

    if(result.rows.length > 0){
      return res.json({exists : true , user : result.rows[0]});
    }else{
      return res.json({exists : false});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal server error"});
  }

}