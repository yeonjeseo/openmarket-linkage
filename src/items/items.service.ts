import { Repository } from 'typeorm';
import { Item } from './entities/items.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly items: Repository<Item>,
  ) {}

  /**
   * TODO
   * storeId 를 FK로 컬럼 저장해야 함
   * storeId로 items 테이블 조회 가능해야 함.
   */
  getAllItemsByStore = (storeId) => this.items.find({});
}
