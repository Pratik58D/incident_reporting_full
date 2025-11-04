import type { NextFunction, Request, Response } from "express";
import { pool } from "../config/db.js";

interface AuthRequest extends Request{
    user? :{
        userId: number;
        name?: string;
        email?:string;
    }
}

export const createMessage = async (req: AuthRequest, res: Response , next : NextFunction) => {
    const client = await pool.connect();
    try {
        const { incidentId } = req.params;
        const { text } = req.body;
         
        const userIdNum = req.user?.userId;
        console.log(userIdNum)
    
        if (!text && !req.file) {
            res.status(400)
            throw new Error("Either text or file is required" );
        }
        await client.query("BEGIN");

        //insert into the chitchat
        const chatResult = await client.query(
            `INSERT INTO chitchat (user_id , incident_id)
            VALUES ($1 , $2) RETURNING id`,
            [userIdNum, incidentId]
        );
        const chitchatId = chatResult.rows[0].id;

        //insert text into chitchat_log(if exits)
        let logId: number | null = null;
        if (text) {
            const logResult = await client.query(
                `INSERT INTO chitchat_log(chitchat_id , text)
                VALUES ($1 ,$2) RETURNING id`,
                [chitchatId, text]
            );
            logId = logResult.rows[0].id
        }

        //handle file if uploaded
        let fileId: number | null = null;
        let fileName : string | null = null;

        if (req.file) {
            const file = req.file;
            const fileResult = await client.query(
                `INSERT INTO file (name , description , size , type)
                VALUES ($1,$2 ,$3,$4) RETURNING id`,
                [file.filename, file.originalname, file.size, 1]
            );
            fileId = fileResult.rows[0].id;
            fileName = file.originalname;

            //link file to chictchat_log if text exist
            if (logId) {
                await client.query(
                    `INSERT INTO chitchat_media( message_id , file_id )
                VALUES ($1 ,$2)`,
                    [logId, fileId]
                )
            }
        }

        const messageResult = await client.query(
            `SELECT
             c.id as chitchat_id,
             c.log_date,
             cl.id AS log_id, 
             cl.text,
             f.id AS file_id, 
             f.name AS file_name,
             u.id AS user_id,
             u.name AS user_name     
            FROM chitchat c 
            LEFT JOIN chitchat_log cl ON cl.chitchat_id = c.id
            LEFT JOIN chitchat_media cm ON cm.message_id = cl.id
            LEFT JOIN file f ON f.id = cm.file_id
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.id = $1`,
            [chitchatId]
        );
        await client.query("COMMIT");

        //emit to socket.IO room
        const payload = messageResult.rows[0];

        // console.log("📡 Emitting to room:", `incident:${incidentId}`, payload);
        req.app.get("io")?.to(`incident:${incidentId}`).emit("message:new", payload);
        
        return res.status(201).json(payload);

    } catch (error) {
        await client.query("ROLLBACK");
        next(error)
    }
    finally {
        client.release();
    }
}

//get messages of an incident

export const getMessageByIncident = async (req: Request, res: Response , next : NextFunction) => {
    try {
        const { incidentId } = req.params;

        const result = await pool.query(
            `SELECT
             c.id as chitchat_id ,
             c.log_date,
             cl.id AS log_id , 
             cl.text ,
             f.id AS file_id , 
             f.name AS file_name,
             u.id AS user_id,
             u.name AS user_name     
            FROM chitchat c 
            LEFT JOIN chitchat_log cl ON cl.chitchat_id = c.id
            LEFT JOIN chitchat_media cm ON cm.message_id = cl.id
            LEFT JOIN file f ON f.id = cm.file_id
            LEFT JOIN users u ON c.user_id = u.id
            WHERE  c.incident_id = $1 
            ORDER BY c.log_date ASC`,
            [incidentId]
        );
        return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        next(error)     
    }
}