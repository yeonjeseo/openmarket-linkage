import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { HttpModule } from '@nestjs/axios';
import { BcryptService } from '../utils/bcrypt';

@Module({
  imports: [HttpModule],
  providers: [CronService, BcryptService],
})
export class CronModule {}
