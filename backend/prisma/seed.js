import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Cleaning up database...");
    await prisma.victim.deleteMany();

    console.log("Seeding victims...");
    await prisma.victim.createMany({
        data : [
            {
                name: "John Doe",
                email: "john@gmail.com",
                password: hashedPassword,
                emergency_type: "Flood",
                status: "open"
            },
            {
                name: "John Smith",
                email: "johnsmith@gmail.com",
                password: hashedPassword,
                emergency_type: "Medical",
                status: "in_progress",
            },
        ],
    });
    console.log("Seeding(victims) successful!");

    console.log("Seeding volunteers...");
    await prisma.volunteer.createMany({
        data: [
            {
                name: "Super Rescuer",
                email: "hero@resq.com",
                password: hashedPassword,
                resource_type: "Boat",
                is_available: true,
            },
            {
                name: "Medic Mike",
                email: "mike@resq.com",
                password: hashedPassword,
                resource_type: "Medical Kit",
                is_available: true,
            },
        ],
    });
    console.log("Seeding(volunteers) successful!");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});