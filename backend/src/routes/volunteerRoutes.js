import express from "express";
import { protect, authorizeVolunteer } from "../middleware/authMiddleware.js";
import { getVolunteerProfile, claimVictim, getNearbyVictims } from "../controllers/volunteerController.js";

const router = express.Router();

router.get("/profile", protect, getVolunteerProfile );
router.put("/claim/:victimId", protect, authorizeVolunteer, claimVictim);
router.get("/nearby", protect, authorizeVolunteer, getNearbyVictims);

export default router;