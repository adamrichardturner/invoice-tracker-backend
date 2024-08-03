import { Request, Response } from "express";
import { pool } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export const createClient = async (req: Request, res: Response) => {
    const { name, street_address, city, postcode, country, email } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO clients (id, name, street_address, city, postcode, country, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [uuidv4(), name, street_address, city, postcode, country, email],
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Server error.");
    }
};

export const getClients = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM clients");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Server error.");
    }
};

export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, street_address, city, postcode, country, email } = req.body;
    try {
        const result = await pool.query(
            "UPDATE clients SET name = $1, street_address = $2, city = $3, postcode = $4, country = $5, email = $6 WHERE id = $7 RETURNING *",
            [name, street_address, city, postcode, country, email, id],
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Server error.");
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM clients WHERE id = $1", [id]);
        res.send("Client deleted successfully.");
    } catch (err) {
        res.status(500).send("Server error.");
    }
};
