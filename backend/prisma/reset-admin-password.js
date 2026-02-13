const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = 'admin@lastros.com';
    const plain = 'password123';
    const hashed = await bcrypt.hash(plain, 10);

    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({ data: { name: 'Restaurante Demo', slug: 'restaurante-demo' } });
      console.log('✅ Tenant criado:', tenant.id);
    }

    await prisma.user.upsert({
      where: { email },
      update: { password: hashed },
      create: {
        email,
        name: 'Admin do Sistema',
        password: hashed,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    console.log(`✅ Senha do usuário ${email} definida para: ${plain}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
