import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getActiveVictims, updateVictimStatus, reportSOS, resolveVictim } from "../controllers/victimController.js";

const router = express.Router();

router.put("/status", protect, updateVictimStatus);
router.get("/active", getActiveVictims);
router.post("/sos", reportSOS);
router.patch("/resolve/:id", resolveVictim);

export default router;