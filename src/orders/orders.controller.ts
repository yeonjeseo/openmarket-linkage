import { OrdersService } from './orders.service';
import { Controller, Get } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrderItems();
  }
}
