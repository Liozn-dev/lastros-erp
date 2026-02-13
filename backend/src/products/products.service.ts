// backend/src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService { // <--- O ERRO ERA AQUI (O NOME TEM QUE SER ESSE)
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new Error('Restaurante não encontrado');

    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock || 0,
        tenantId: tenant.id,
      },
    });
  }

  async findAll() {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) return [];

    return this.prisma.product.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock,
      },
    });
  }

  async setImage(id: string, imageUrl: string) {
    return this.prisma.product.update({
      where: { id },
      data: { imageUrl },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}