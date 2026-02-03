import { prisma } from "../config/db.js";

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
        const updatedVictim = await prisma.victim.update({
            where: { id: req.user.id},
            data: { disasterId: disasterId }
        });
        res.status(200).json({ message: "You have been added to the disaster watchlist"})
    } catch (error) {
        res.status(500).json({ error: "Invalid disaster ID or Server Error " });
    }
};