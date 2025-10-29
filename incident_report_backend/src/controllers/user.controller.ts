import type { NextFunction, Request , Response } from "express";
import type { User } from "../lib/types.js";
import { pool } from "../config/db.js";

interface CheckUserQuery {
  phone_number?: string | undefined;
  email?: string | undefined;
}


export const createUser = async(req : Request , res: Response , next: NextFunction) =>{
    try {
        const {name, phone_number , email , role } =req.body as User;
        if(!name || !phone_number){
          res.status(400);
          throw new Error("Name and Phone number are required")
        }
        const result = await pool.query(
            `INSERT INTO users (name , phone_number ,email ,role) VALUES ($1,$2,$3,COALESCE($4, 'reporter')) RETURNING *`,
            [name,  phone_number ,email || null , role ]
        )
        return res.status(201).json({message :"user created sucessfully" ,user : result.rows[0]})
    } catch (error ) {
      next(error);
    }
}

// Get all users
export const getUsers = async (req: Request, res: Response , next : NextFunction) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return res.json(result.rows);
  } catch (error) {
    next(error)
  }
};


export const checkUserExists = async(
  req : Request<{},{},{},CheckUserQuery>, 
  res : Response ,
  next : NextFunction
) =>{
  try {
    const {phone_number ,email} = req.query;
     if (!phone_number && !email) {
      res.status(400);
      throw new Error("Either phone_number or email is required");
    };

    let query = `SELECT * FROM users WHERE 1=1 `;
    const values : string[]=[];

    if(phone_number){
      values.push(phone_number.trim());
      query += ` AND phone_number = $${values.length}`;
    }
    if (email) {
          values.push(email.trim());
          query += ` AND email = $${values.length}`;
      }
     const result = await pool.query(query, values);

    if(result.rows.length > 0){
      return res.json({exists : true , user : result.rows[0]});
    }else{
      return res.json({exists : false});
    }
  } catch (error) {
   next(error);
  }

}