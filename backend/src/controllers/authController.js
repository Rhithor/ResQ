import bcrypt from "bcryptjs";
import {prisma} from "../config/db.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

export const registerVictim = async (req, res) => {
    try {
        const { name, email, password, emergency_type} = req.body;
        if (!name || !email || !password || !emergency_type){
            return res.status(400).json({error: "Missing required fields"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVictim = await prisma.victim.create({
            data: {
                name,
                email,
                password: hashedPassword,
                emergency_type,
                status: "open"
            }
        });
        const token = generateToken(newVictim.id, res, "victim");
        res.status(201).json({message: "Victim registered!", token,  id: newVictim.id});

    } catch (error){
        if (error.code === 'P2002'){
            return res.status(400).json({error: "Email already exists"});
        }
        res.status(500).json({error: error.message});
    }
};


export const loginVictim = async (req, res) => {
    try {
        const { email, password } = req.body;
        const victim = await prisma.victim.findUnique({
            where: {email}
        });
        if (!victim){
            return res.status(401).json({ message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, victim.password);
        if (!isMatch){
            return res.status(401).json({ message: "Invalid email or password"});
        }
        const token = generateToken(victim.id, res, "victim");
        res.status(200).json({
            message: "Login successful!",
            token,
            victim: {
                id: victim.id,
                name: victim.name,
                email: victim.email
            }
        });
    } catch (error) {
        console.error("Login error:",error);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registerVolunteer = async (req, res) => {
    try {
        const { name, email, password, resource_type } = req.body;
        if (!name || !email || !password || !resource_type ){
            return res.status(400).json({error: "Missing required fields"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVolunteer = await prisma.volunteer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                resource_type,
                is_available: true
            }
        });
        const token = generateToken(newVolunteer.id, res, "volunteer");
        res.status(201).json({ message: "Volunteer Registered!", token,id: newVolunteer.id});

    } catch (error){
        if (error.code === "P2002")
            return res.status(400).json({ error: "Email already exists!"});
        res.status(500).json({ error: error.message });
    }
};

export const loginVolunteer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const volunteer = await prisma.volunteer.findUnique({where: {email}});
        if (!volunteer || !(await bcrypt.compare(password, volunteer.password)))
        {
            return res.status(401).json({ error: "Invalid email or password"});
        }
        const token = generateToken(volunteer.id, res, "volunteer");
        res.status(200).json({
            message: "Login Successful",
            token,
            volunteer: {id: volunteer.id, name: volunteer.name, role: "volunteer"}
        });
    } catch (error){
        res.status(500).json({ error: "Internal server error"});
    }
};