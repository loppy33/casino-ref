import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.NEXT_ADMIN_EMAIL || 'admin';
    const adminPassword = process.env.NEXT_ADMIN_PASSWORD || 'AdminPass404';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log(`Admin created: ${adminEmail}`);
    } else {
        console.log(`Admin already exists: ${adminEmail}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
