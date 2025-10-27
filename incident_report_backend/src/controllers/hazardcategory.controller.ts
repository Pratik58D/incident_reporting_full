import type { Request, Response } from "express";
import type { HazardCategory } from "../lib/types.js";
import { pool } from "../config/db.js";


export const createHazardCategory = async (req: Request, res: Response) => {
    try {
        const { name, priority } = req.body as HazardCategory;
        if (!name) {
            return res.status(401).json({ message: "hazard name is required " })
        }
        const result = await pool.query(
            `INSERT INTO hazard_categories (name , priority) VALUES ($1 , $2) RETURNING *`,
            [name, priority || "low"]
        );
        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });

    }
}

// get all hazards
export const getAllHazards = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM hazard_categories")
        return res.status(200).json({ sucess: true, data: result.rows })

    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });

    }
}


//get a single hazards
export const getHazardById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
             HC.id AS hazard_id,
             HC.name AS hazard_name,
             HC.priority AS hazard_priority,
             I.id AS incident_id,
             I.title AS incident_title,
             I.description AS incident_description,
             ST_X(I.location_geom) AS lng,         
             ST_Y(I.location_geom) AS lat        
             FROM hazard_categories HC
            LEFT JOIN incident I ON HC.id = I.hazard_id 
             WHERE HC.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hazard category not found" });
        }
        const hazard = {
            id: result.rows[0].hazard_id,
            name: result.rows[0].hazard_name,
            priority: result.rows[0].priority,
            incidents : result.rows
            .filter((r)=>r.incident_id)
            .map((r)=>({
                id:r.incident_id,
                title : r.incident_title,
                description : r.incident_description,
                lat : r.lat,
                lng : r.lng,
            }))
        }
        return res.status(200).json({ success: true, data: hazard })
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}


// update hazard category
export const updateHazard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, priority } = req.body as HazardCategory;

        const result = await pool.query(
            `UPDATE hazard_categories SET name = $1 , priority = $2
            WHERE id = $3 RETURNING *`, [name, priority, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hazard category not found" });
        }
        return res.status(200).json({ success: true, data: result.rows[0], message: "hazard updated successfully." });

    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

//delete the hazards
export const deleteHazard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `DELETE FROM hazard_categories WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hazard category not found" });
        }

        return res.status(200).json({ success: true, message: "Hazard deleted sucessfully" })
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }

} 
