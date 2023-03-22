import { Repository } from 'typeorm';
import { Item } from './entities/items.entity';

export class ItemsService {
  constructor(private readonly items: Repository<Item>) {}
}
