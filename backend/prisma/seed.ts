// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando o Seed...');

  // 1. Criar um Restaurante (Tenant)
    const tenant = await prisma.tenant.upsert({
            where: { slug: 'restaurante-demo' },
            update: {},
            create: {
            name: 'Restaurante Demo',
            slug: 'restaurante-demo',
        },
    });

    console.log(`✅ Restaurante criado: ${tenant.name}`);

    // 2. Criar um Usuário Admin vinculado a esse restaurante
    // Senha desejada: password123 (armazenada hashada)
    const plainPassword = 'password123';
    const hashed = await bcrypt.hash(plainPassword, 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@lastros.com' },
        update: {},
        create: {
            email: 'admin@lastros.com',
            name: 'Admin do Sistema',
            password: hashed,
            role: 'ADMIN',
            tenantId: tenant.id,
        },
    });

    console.log(`✅ Usuário criado: ${user.email} (senha: ${plainPassword})`);

    // 3. Criar um Produto de exemplo
    await prisma.product.create({
        data: {
            name: 'Coca-Cola Lata 350ml',
            price: 5.50,
            tenantId: tenant.id,
        }
    });

    console.log(`✅ Produto criado: Coca-Cola`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });