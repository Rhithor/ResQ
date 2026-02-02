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
