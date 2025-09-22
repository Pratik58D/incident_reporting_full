import {Pool} from "pg";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";


// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });


export const pool = new Pool({
    host : process.env.DB_HOST,
    port : parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user : process.env.DB_USER ,
    password : process.env.DB_PASSWORD,

})

export  async function startServer() {
  try {
    const client = await pool.connect();
    console.log("Database connected");
    client.release();
  } catch (err) {
    console.error("Could not connect to the database:", err);
    process.exit(1);
  }
}


