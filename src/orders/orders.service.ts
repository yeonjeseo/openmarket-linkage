import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';

export class OrdersService {
  constructor(private readonly orders: Repository<Order>) {}
}
