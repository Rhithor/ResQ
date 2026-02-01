import express from "express";
import victimRoutes from "./routes/victims.js";
import volunteerRoutes from "./routes/volunteers.js";

const app = express();
app.use(express.json());

//API routes
app.use("/api/victimRoutes", victimRoutes);
app.use("/api/volunteerRoutes", volunteerRoutes);

const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

