import { Controller, Get, Param } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('/:storeId')
  async getAllItemsByStore(@Param() { storeId }: any) {
    return this.itemsService.getAllItemsByStore(storeId);
  }
}
