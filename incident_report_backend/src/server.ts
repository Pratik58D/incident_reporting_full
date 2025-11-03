import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { startServer } from "./config/db.js"
import userRoutes from "./routes/user.route.js";
import hazardRoutes from "./routes/hazardcategory.route.js";
import fileRoutes from './routes/file.route.js';
import incidentRoutes from "./routes/incident.route.js";
import messageRoutes from "./routes/chitchat.route.js";
import roadBlockageRoutes from "./routes/roadBlockage.route.js"
import { initSocket } from "./config/socket.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser"

// ES module __dirname workround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const port =Number(process.env.PORT) || 5000;
const app = express();
const server = http.createServer(app);

//middleware
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:7000"
    ],
    credentials: true
}));

//database connection check
startServer();

//  initialize socket
const io = initSocket(server);
app.set("io", io);

app.get("/home", (req, res) => {
    res.send("testing server...")
});


app.use("/api/users", userRoutes);
app.use("/api/hazards", hazardRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/chitchat", messageRoutes);
app.use("/api/road-blockages", roadBlockageRoutes)

// Serve static frontend build (React)
const frontendPath = path.join(__dirname, "public")
console.log(frontendPath)
app.use(express.static(frontendPath));

//  Catch-all for React Router (must be last)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// error Middleware
app.use(errorMiddleware)

server.listen(port, '0.0.0.0', () => {
    console.log(`server is running at port ${port}`)
})
