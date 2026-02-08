import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Cleaning up database...");
    await prisma.victim.deleteMany();
    await prisma.volunteer.deleteMany();
    await prisma.disaster.deleteMany();

    console.log("Seeding disaster...");
    const flood = await prisma.disaster.create({
        data: {
            name: "Great Monsoon Flood 2026",
            type: "Flood",
            description: "Heavy rainfall causing urban flooding in coastal areas.",
            is_active: true
        },
    });

    await prisma.$executeRaw`
        UPDATE disaster
        SET location = ST_GeomFromText(${'POINT(80.2707 13.0827)'}, 4326)::geography
        WHERE id = ${flood.id}::uuid
    `;
    
    console.log("Seeding victims linked to disaster...");
    const victimsData = [
        { name: "John Doe", email: "john@gmail.com", type: "Flood", lat:13.0850, lng: 80.2720 },
        { name: "John Smith", email: "johnsmith@gmail.com", type: "Medical", lat:13.0810, lng: 80.2860 }
    ];
    for (const v of victimsData){
        const victim = await prisma.victim.create({
            data: {
                name: v.name,
                email: v.email,
                password: hashedPassword,
                emergency_type: v.type,
                status: "open",
                disasterId: flood.id,
            },
        });
        await prisma.$executeRaw`
            UPDATE victim SET location = ST_GeomFromText(${`POINT(${v.lng} ${v.lat})`}, 4326)::geography
            WHERE id = ${victim.id}::uuid
        `;
    }
    console.log("Seeding volunteers...");
    const volunteerData = [
        {name: "Super Rescuer", email: "hero@resq.com", resource: "Boat", lat: 13.0900, lng: 80.2800},
        {name: "Medic Mike", email: "mike@resq.com", resource: "Medical Kit", lat: 13.0750, lng: 80.2600}
    ];
    for (const vol of volunteerData){
        const volunteer = await prisma.volunteer.create({
            data: {
                name: vol.name,
                email: vol.email,
                password: hashedPassword,
                resource_type: vol.resource,
                is_available: true,
            },
        });
        await prisma.$executeRaw`
            UPDATE volunteer SET location = ST_GeomFromText(${`POINT(${vol.lng} ${vol.lat})`}, 4326)::geography
            WHERE id = ${volunteer.id}::uuid
        `; 
    }
    console.log("Seeding completed successfully!");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});