import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/items.entity';

export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Item)
    private readonly items: Repository<Item>,
  ) {}

  getAllOrderItems = () => this.items.find({});
}
