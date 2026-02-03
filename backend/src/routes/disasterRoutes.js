import express from "express";
import { protect, authorizeVolunteer } from "../middleware/authMiddleware.js";
import { joinDisaster, getDisasterWatchlist } from "../controllers/disasterController.js";

const router = express.Router();

router.post("/join", protect, joinDisaster);
router.get("/watchlist", protect, authorizeVolunteer, getDisasterWatchlist);

export default router;