import type { NextFunction, Request, Response } from "express";
import { pool } from "../config/db.js";


export const createRoadBlockage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { incidentId, roadName, blockageType, estimatedClearanceTime } = req.body;

        if (!incidentId || !blockageType) {
            res.status(400);
            throw new Error("Please provide both incidentId and blockageType.");
        };
        const result = await pool.query(
            `INSERT INTO road_blockages (incident_id, road_name, blockage_type_id, estimated_clearance_time, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING *`,
            [incidentId, roadName, blockageType, estimatedClearanceTime]
        );
        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error: any) {
        next(error);
    }
}

// get all the road blocakge
export const getRoadBlockages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await pool.query(
            `SELECT rb.*, i.title AS incident_title, hc.name AS blockage_type_name
            FROM road_blockages rb
            LEFT JOIN incident i ON rb.incident_id = i.id
            LEFT JOIN hazard_categories hc ON rb.blockage_type_id = hc.id
            ORDER BY rb.created_at DESC`
        );
        return res.status(200).json({ success: true, data: result.rows });
    } catch (error: any) {
        next(error)
    }
}


//get single road blockage
export const getRoadBlockageById = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT rb.* ,i.title AS incident_title, hc.name AS blockage_type FROM
            road_blockages rb
            LEFT JOIN incident i ON rb.incident_id = i.id 
            LEFT JOIN hazard_categories hc ON rb.blockage_type_id = hc.id
            WHERE rb.id =$1`,
            [id]
        )
        if (result.rowCount === 0) {
            res.status(404);
            throw new Error("Road blockage not found");
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
       next(error)
    }
}

//update road blocakge
export const updateRoadBlockage = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const { id } = req.params;
        const { roadName, incidentId, blockageType, estimatedClearanceTime } = req.body;

        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (roadName !== undefined) {
            fields.push(`road_name =$${idx++}`)
            values.push(roadName);
        }
        if (incidentId !== undefined) {
            fields.push(`incident_id =$${idx++}`)
            values.push(incidentId);
        }

        if (blockageType !== undefined) {
            fields.push(`blockage_type_id = $${idx++}`);
            values.push(blockageType);
        }
        if (estimatedClearanceTime !== undefined) {
            fields.push(`estimated_clearance_time  = $${idx++}`);
            values.push(estimatedClearanceTime);
        }
        if (fields.length === 0) {
            res.status(400);
            throw new Error("No fields provided to update");
        }

        values.push(id);
        const query = `UPDATE road_blockages SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
           res.status(404);
      throw new Error("Road blockage not found");
        }

        return res.status(200).json({ success: true, data: result.rows[0] });

    } catch (error) {
       next(error);
    }
}


//delete road blocakge

export const deleteRoadBlockage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM road_blockages where id= $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Road blockage not found" });
        }
        return res.status(200).json({ success: true, message: "Road blockage deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error" });

    }
}