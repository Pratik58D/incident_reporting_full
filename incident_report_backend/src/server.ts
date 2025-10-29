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


const port =Number(process.env.PORT) || 5000;
const app = express();
const server = http.createServer(app);

//middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));

//database connection check
startServer();

//  initialize socket
const io = initSocket(server);
app.set("io", io);

app.get("/", (req, res) => {
    res.send("testing server...")
});


app.use("/api/users", userRoutes);
app.use("/api/hazards", hazardRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/chitchat", messageRoutes);
app.use("/api/road-blockages", roadBlockageRoutes)


app.use(errorMiddleware)

server.listen(port, '0.0.0.0', () => {
    console.log(`server is running at port ${port}`)
})