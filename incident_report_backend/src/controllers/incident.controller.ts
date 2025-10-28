import type { Request, Response } from "express";
import { pool } from "../config/db.js";

//create incident 
export const createIncident = async (req: Request, res: Response) => {
    try {
        const { hazardId, title, description, reportedBy, lat, lon, file_id } = req.body;
        if (!hazardId || !title  || !lat || !lon) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await pool.query(
            `INSERT INTO incident (hazard_id, title, description, reported_by, location_geom, created_at ,file_id)
             VALUES ($1, $2, $3, $4, ST_SetSRID(ST_Point($5, $6), 4326), NOW(),$7)
            RETURNING *`,
            [hazardId, title, description, reportedBy, lon, lat, file_id]
        );
        return res.status(201).json({ success: true, incident: result.rows[0] });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// GET ALL INCIDENTS
export const getAllIncidents = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM incident ORDER BY created_at DESC");
        return res.status(200).json({ success: true, incidents : result.rows });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


// GET INCIDENT BY ID
export const getIncidentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM incident WHERE id = $1", [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Incident not found" });
        }
        return res.status(200).json({ success: true, incident: result.rows[0] });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

//update the Incident
export const updateIncident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { hazardId, title, description ,file_id } = req.body;
        let fields: string[] = [];
        let values: any[] = [];
        let idx = 1;

        if (hazardId !== undefined) {
            fields.push(`hazard_id = $${idx++}`)
            values.push(hazardId);
        }
        if (title !== undefined) {
            fields.push(`title = $${idx++}`)
            values.push(title);
        }
        if (description !== undefined) {
            fields.push(`description = $${idx++}`);
            values.push(description);
        }
         if (file_id !== undefined) {
            fields.push(`file_id = $${idx++}`);
            values.push(file_id);
        }
        if (fields.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        } 
        // adding id as lastp parameter
        values.push(id);
        const query = `UPDATE incident 
                       SET ${fields.join(", ")} WHERE id = $${idx}
                        RETURNING *`;

        const result = await pool.query(query , values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Incident not found" });
        }
        return res.status(200).json({ success: true, incident: result.rows[0] });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

//delete incident 
export const deleteIncident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM incident WHERE id= $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Incident not found" });
        }
        return res.status(200).json({ success: true, message: "Incident deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// get all incidents join with hazard
export const getHazardIncidents = async(req:Request , res : Response)=>{
    try {
        const {hazard} = req.query;
        let query = `
        SELECT i.id AS incident_id ,
            i.title,
            i.description,
            i.created_at,
            u.name,
            h.id AS hazard_id ,
            h.name AS hazard_name ,
            h.priority 
            FROM incident i
            LEFT JOIN users u ON  i.reported_by = u. id 
            LEFT JOIN hazard_categories h ON i.hazard_id =h.id
            `; 
            const params: any[] = [];
            if(hazard){
                query += ` WHERE h.name ILIKE $1`;
                params.push(`%${hazard}%`);
            }

            query += ` ORDER BY i.created_at DESC`;

            const result = await pool.query(query, params);
                 
        return res.status(200).json({ success: true, incidentHazard : result.rows });        
    } catch (error :any) {
        return res.status(500).json({ success: false, error: error.message });        
    }
}

// get single incident join with hazard
export const gethazardIncident = async(req:Request , res : Response)=>{
    try {
        const {incidentId} = req.params;
        const result = await pool.query(
            `SELECT i.id AS incident_id ,
            i.title,
            i.description,
            i.created_at,
            ST_X(location_geom) AS longitude,
            ST_Y(location_geom) AS latitude,
            u.name,
            h.id AS hazard_id ,
            h.name AS hazard_name ,
            h.priority 
            FROM incident i
            LEFT JOIN users u ON i.reported_by = u. id 
            LEFT JOIN hazard_categories h ON i.hazard_id =h.id 
            WHERE i.id = $1
            ORDER BY i.created_at DESC`,[incidentId]);       
        return res.status(200).json({ success: true, incidentHazard : result.rows[0] });        
    } catch (error :any) {
        return res.status(500).json({ success: false, error: error.message });        
    }
}