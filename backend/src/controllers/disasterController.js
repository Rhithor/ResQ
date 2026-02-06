import { prisma } from "../config/db.js";
import { io } from "../server.js";

export const getDisasterWatchlist = async (req, res) => {
    try {
        const watchlist = await prisma.disaster.findMany({
            where: {
                is_active: true // only shows ongoing disasters
            },
            include: {
                _count: {
                    select: { victims: true}
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json(watchlist);
    } catch (error){
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Victim chooses to join a specific disaster watchlist(essentially adding them to the disaster table)
export const joinDisaster = async (req, res) => {
    const { disasterId } = req.body;
    try {
        console.log("User ID from token:", req.user.id);
        console.log("Disaster ID from body:", disasterId);
        const updatedVictim = await prisma.victim.update({
            where: { id: req.user.id},
            data: { disasterId: disasterId },
            include: {disaster: true}
        });
        io.emit("NEW_EMERGENCY", {
            victimName: updatedVictim.name,
            disasterName: updatedVictim.disaster.name,
            emergencyType: updatedVictim.emergency_type
        });
        console.log(`Broadcast sent: ${updatedVictim.name} joined ${updatedVictim.disaster.name}`);
        res.status(200).json({ message: "You have been added to the disaster watchlist"})
    } catch (error) {
        console.error("DETAILED ERROR:", error);
        res.status(500).json({ error: "Invalid disaster ID or Server Error " });
    }
};