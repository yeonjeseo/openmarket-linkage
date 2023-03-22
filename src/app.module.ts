import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entity/user.entity';
import { ItemsModule } from './items/items.module';
import { Order } from './orders/entities/orders.entity';
import { Item } from './items/entities/items.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { BcryptService } from './utils/bcrypt';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Order, Item],
      synchronize: process.env.NODE_ENV !== 'prod', // DB를 현재 모듈 상태로 동기화
      // logging:
      //   process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
    }),
    UsersModule,
    OrdersModule,
    ItemsModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
