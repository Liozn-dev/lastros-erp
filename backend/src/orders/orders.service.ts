// backend/src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: any) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new Error('Restaurante não encontrado');

    console.log('--- INICIANDO VENDA ---'); // <--- FOFOCA 1

    return this.prisma.$transaction(async (tx) => {

      for (const item of createOrderDto.items) {
        // Busca o produto no banco
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product) {
          console.log(`❌ ERRO: Produto ${item.productId} não achado no banco!`);
          throw new Error(`Produto não encontrado`);
        }

        // --- AQUI ESTÁ A FOFOCA IMPORTANTE ---
        console.log(`🔎 Analisando: ${product.name}`);
        console.log(`   Estoque no Banco: ${product.stock} (Tipo: ${typeof product.stock})`);
        console.log(`   Quantidade Pedida: ${item.quantity}`);
        // -------------------------------------

        if (product.stock < item.quantity) {
          console.log(`🚫 BLOQUEADO: ${product.stock} é menor que ${item.quantity}`);
          throw new Error(`Estoque insuficiente! ${product.name} só tem ${product.stock}.`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }

      console.log('✅ Tudo certo! Criando pedido...');

      return tx.order.create({
        data: {
          total: createOrderDto.total,
          status: 'COMPLETED',
          tenantId: tenant.id,
          items: {
            create: createOrderDto.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });
    });
  }

  async findAll() {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) return [];

    return this.prisma.order.findMany({
      where: { tenantId: tenant.id },
      include: {
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}