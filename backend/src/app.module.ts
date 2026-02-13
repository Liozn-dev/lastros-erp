// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, ProductsModule, OrdersModule, ExpensesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}