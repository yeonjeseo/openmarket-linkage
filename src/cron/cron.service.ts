import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CronService {
  constructor(private readonly httpService: HttpService) {}
  @Cron('*/2 * * * * *')
  async test() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://jsonplaceholder.typicode.com/todos/1'),
      );
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
}
