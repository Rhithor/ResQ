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