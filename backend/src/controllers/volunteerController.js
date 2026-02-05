import { prisma } from "../config/db.js";
export const getVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await prisma.volunteer.findUnique({
            where: {id: req.user.id},
            select: {
                id: true,
                name: true,
                email: true,
                resource_type: true,
                is_available: true,
            }
        });
        if (!volunteer){
            return res.status(404).json({ message: "Volunteer not found"});
        }
        res.status(200).json(volunteer);
    } catch (error){
        res.status(500).json({ message: "Server error"});
    }
};

// Volunteer claims a victim to rescue
export const claimVictim = async (req, res) => {
    const { victimId } = req.params; // Victim's ID is passed as a parameter in the URL
    try {
        const victim = await prisma.victim.update({
            where: {id: victimId},
            data: { status: "in_progress"}
        });
        res.status(200).json({ message: "Victim claimed successfully ", victim });
    } catch (error){
        res.status(500).json({ error: "Could not claim victim."})
    }
};

export const getNearbyVictims = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng){
            return res.status(400).json({ error: "Latitude and Longitude are required"});
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const victims = await prisma.$queryRaw`
            SELECT id, name, status, ST_AsText(location) as location
            FROM victim
            WHERE ST_DWithin(
                location,
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
                10000 -- Radius in meters
            )
            AND status = 'open';
        `;
        res.json(victims);
    } catch (error) {
        console.error("Spatial query error:",error);
        res.status(500).json({ error: "Error fetching nearby victims "});
    };
};


export const getAvailableVictims = async(req, res) => {
    const { disasterId } = req.params;
    try {
        const victims = await prisma.victim.findMany({
            where: {
                disasterId: disasterId,
                status: "open"
            },
            select: {
                id: true,
                name: true,
                emergency_type: true,
                status: true
            }
            
        });
        res.status(200).json(victims);
    } catch (error){
        res.status(500).json({ error: "Error fetching victims "});
    };
}


export const resolveVictim = async (req, res) => {
    const { victimId } = req.params;
    try {
        await prisma.victim.update({
            where: { id: victimId },
            data: { status: "resolved" } // updating the victim status to resolved if a volunteer has reached out to them
        });
        res.status(200).json({ message: "Resuce Mission Completed! Victim is safe."});
    } catch (error) {
        res.status(500).json({ error: "Could not resolve rescue." });
    }
}