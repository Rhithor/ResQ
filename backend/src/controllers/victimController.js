import { prisma } from "../config/db.js";

export const updateVictimStatus = async(req, res) => {
    const { status } = req.body;
    try {
        const updatedVictim = await prisma.victim.update({
            where: { id: req.user.id },
            data: { status: status },
            select: { id: true, name: true, status: true}
        });
        res.status(200).json(updatedVictim)
    } catch (error){
        res.status(500).json({ message: "Error updating status" })
    }
};

export const getActiveVictims = async(req, res) => {
    try {
        const activeVictims = await prisma.$queryRaw`
            SELECT
                v.id,
                v.name as "victimName",
                v.emergency_type as "emergencyType",
                v.status,
                ST_Y(v.location::geometry) as latitude,
                ST_X(v.location::geometry) as longitude,
                d.name as "disasterName"
            FROM victim v 
            LEFT JOIN disaster d ON v."disasterId" = d.id 
            WHERE v.status = 'open'
            ORDER BY v.created_at DESC
        `;
        res.status(200).json(activeVictims);
    } catch (error){
        console.error("Error fetching active victims:", error);
        res.status(500).json({ error: "Could not retrieve radar signals "});
    }
};

export const reportSOS = async (req, res) => {
    const { name, emergency_type, lat, lng } = req.body;
    const io = req.app.get("socketio");
    try {
        // Generating a dummy email so that the @unique constraint doesnt trip
        const guestEmail = `sos_${Date.now()}@resq.com`;
        const result = await prisma.$queryRaw`
            INSERT INTO victim(name, email, password,  emergency_type, location, status)
            VALUES (${name || "Emergency User"}, ${guestEmail}, 'temporary_sos_pass', ${emergency_type}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), 'open')
            RETURNING id, name as "victimName", emergency_type as "emergencyType"
        `;
        const newVictim = result[0];
        const alertData = {
            ...newVictim,
            latitude: lat,
            longitude: lng,
            disasterName: "Direct SOS Signal"
        };
        if (io) {
            io.emit("NEW_EMERGENCY", alertData);
        }
        res.status(201).json(alertData);
    } catch (error) {
        console.error("SOS Error:", error);
        res.status(500).json({ error: "Failed to broadcast SOS" });
    }
};

export const resolveVictim = async (req, res) => {
    const { id } = req.params;
    const io = req.app.get("socketio");
    try {
        const updatedVictim = await prisma.victim.update({
            where: { id: id},
            data: { status: 'resolved' },
        });
        if (io){
            io.emit("RESOLVE_EMERGENCY", id);
        }
        res.status(200).json({ message: "Victim marked as safe", updatedVictim})
    } catch (error){
        res.status(500).json({ error: "Failed to update status" });
    }
};