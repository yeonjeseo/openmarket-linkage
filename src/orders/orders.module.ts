import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Item } from './entities/items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Item])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
