import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateVictimStatus } from "../controllers/victimController.js";

const router = express.Router();

router.put("/status", protect, updateVictimStatus);

export default router;