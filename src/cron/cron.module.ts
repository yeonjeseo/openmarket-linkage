import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { HttpModule } from '@nestjs/axios';
import { BcryptService } from '../utils/bcrypt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), HttpModule],
  providers: [CronService, BcryptService],
})
export class CronModule {}
