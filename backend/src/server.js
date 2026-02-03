import express from "express";
import victimRoutes from "./routes/victimRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import {config} from "dotenv";
import {connectDB, disconnectDB} from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import disasterRoutes from "./routes/disasterRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();
connectDB();


const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//API routes
app.use("/api/victims", victimRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/disasters", disasterRoutes);

const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`ResQ Server running on PORT ${PORT}`);

});


// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});


// Handle uncaught exceptions
process.on("uncaughtException",async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
    
});

// Graceful shutdown
process.on("SIGTERM", (err) => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});