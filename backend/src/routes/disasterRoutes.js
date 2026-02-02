import express from "express";
import { getDisasterWatchlist } from "../controllers/disasterController.js";

const router = express.Router();

router.get("/watchlist", getDisasterWatchlist);

export default router;``