import { OrdersService } from './orders.service';
import { Controller } from '@nestjs/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
}
