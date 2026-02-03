import express from "express";
import { registerVictim, loginVictim, logout, loginVolunteer, registerVolunteer } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-victim", registerVictim);
router.post("/register-volunteer", registerVolunteer);
router.post("/login-victim", loginVictim);
router.post("/login-volunteer", loginVolunteer);
router.post("/logout", logout);


export default router;