import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('* * * * * *')
  test() {
    console.log('Hello World!');
  }
}
