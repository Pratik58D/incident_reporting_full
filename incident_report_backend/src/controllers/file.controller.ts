import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import fs from "fs";

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const {path: filePath, size, mimetype } = req.file;
        const description = req.body.description || null;

        let typeInt = 0;
        if (mimetype.startsWith("image/")) typeInt = 1;
        else if (mimetype.startsWith("video/")) typeInt = 2;
        else if (mimetype === "application/pdf") typeInt = 3;

        const result = await pool.query(
            `INSERT INTO file (name, description, size, type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [filePath, description, size, typeInt]
        );
        return res.status(201).json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });

    }
}

// Get all files(don't think we have to fetch photos only in any case)

export const getAllFiles = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM file ORDER BY name DESC");
        return res.status(200).json({ success: true, data: result.rows });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

//delete a file

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        //get files path to remove 

        const fileRes = await pool.query("SELECT name as file_url FROM file WHERE id = $1", [id]);
        if (fileRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: "File not found" })
        }
        const filePath = fileRes.rows[0].file_url;
       

        //delete the file record fromDB
        await pool.query("DELETE FROM file WHERE id = $1", [id])
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
         return res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (error : any) {
         return res.status(500).json({ success: false, error: error.message });
    }
}