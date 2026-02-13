import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly service: ExpensesService) { }

    @Post()
    create(@Body() data: any) {
        return this.service.create(data);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}