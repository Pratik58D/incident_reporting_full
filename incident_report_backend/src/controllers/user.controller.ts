import type { NextFunction, Request, Response } from "express";
import type { User } from "../lib/types.js";
import { pool } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

interface CheckUserQuery {
  phone_number?: string | undefined;
  email?: string | undefined;
}

// *********signup controller*******

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { name, phone_number, email, password, role } = req.body;
    if (!name || !phone_number || !password) {
      res.status(400)
      throw new Error("Name, phone number and password are required");
    }

    const existingUser = await pool.query(
      `SELECT * FROM users WHERE phone_number = $1 OR email = $2`,
      [phone_number, email]
    )
    if (existingUser.rows.length > 0) {
      res.status(400)
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await pool.query(
      `INSERT INTO users (name, phone_number, email, password, role)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'reporter')) RETURNING id, name, phone_number, email, role, created_at`,
      [name, phone_number, email || null, hashedPassword, role]
    );

    const user = newUser.rows[0];

    const accessToken = generateAccessToken(user.id, user.role, user.name);
    const refreshToken = generateRefreshToken(user.id)

    //set refresh token in secure , HTTP-only cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'prouction' ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path : "/"
    })

    return res.status(201).json({
      message: "Signup successful",
      user,
      accessToken,
    })
  } catch (error) {
    next(error);
  }
}

// *********login controller*******

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400)
      throw new Error("phone/email and password are required")
    }
    const { rows } = await pool.query(
      `SELECT * from users WHERE phone_number = $1 OR email = $1 LIMIT 1`,
      [identifier]
    );
    if (rows.length === 0) {
      res.status(401)
      throw new Error("Invalid credentials")
    }

    const user = rows[0]
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      res.status(401)
      throw new Error("Invalid credentials")
    }

    const accessToken = generateAccessToken(user.id, user.role, user.name);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path : "/"
    })

    return res.json({
      message: "login successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role
      },
    });
  } catch (error) {
    next(error)
  }
}

// ***********refresh Access token **********

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401)
    throw new Error("No refresh token found")
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: number };

    // fetch user data from database
    const userResult = await pool.query(
      `SELECT id, name, email, phone_number, role FROM users WHERE id = $1`,
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    const newAccessToken = generateAccessToken(user.id, user.role, user.name);
    return res.json(
      { 
        accessToken: newAccessToken,
        "user" :{
          id : user.id,
          name : user.name,
          role : user.role
        }

       });
  } catch {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// *************LOGOUT ****************

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "logged out successfully" })
}

// createUser
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone_number, email, role } = req.body as User;
    if (!name || !phone_number) {
      res.status(400);
      throw new Error("Name and Phone number are required")
    }
    const result = await pool.query(
      `INSERT INTO users (name , phone_number ,email ,role) VALUES ($1,$2,$3,COALESCE($4, 'reporter')) RETURNING *`,
      [name, phone_number, email || null, role]
    )
    return res.status(201).json({ message: "user created sucessfully", user: result.rows[0] })
  } catch (error) {
    next(error);
  }
}

// Get all users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return res.json(result.rows);
  } catch (error) {
    next(error)
  }
};


export const checkUserExists = async (
  req: Request<{}, {}, {}, CheckUserQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number, email } = req.query;
    if (!phone_number && !email) {
      res.status(400);
      throw new Error("Either phone_number or email is required");
    };

    let query = `SELECT * FROM users WHERE 1=1 `;
    const values: string[] = [];

    if (phone_number) {
      values.push(phone_number.trim());
      query += ` AND phone_number = $${values.length}`;
    }
    if (email) {
      values.push(email.trim());
      query += ` AND email = $${values.length}`;
    }
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return res.json({ exists: true, user: result.rows[0] });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    next(error);
  }

}