import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Busca o restaurante (Tenant)
        const tenant = await this.prisma.tenant.findFirst();
        if (!tenant) throw new Error('Restaurante não encontrado');

        return this.prisma.expense.create({
            data: {
                description: data.description,
                amount: data.amount,   // O Prisma converte automaticamente para Decimal
                category: data.category,
                tenantId: tenant.id,
            },
        });
    }

    async findAll() {
        const tenant = await this.prisma.tenant.findFirst();

        // Se não tiver restaurante, retorna lista vazia para não quebrar
        if (!tenant) return [];

        return this.prisma.expense.findMany({
            where: { tenantId: tenant.id },
            orderBy: { date: 'desc' }, // Ordena do mais recente para o mais antigo
        });
    }

    async remove(id: string) {
        return this.prisma.expense.delete({ where: { id } });
    }
}