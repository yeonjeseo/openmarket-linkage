import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BcryptService } from '../utils/bcrypt';
import { startOfToday } from '../utils/luxon';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CronService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bcryptService: BcryptService,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}
  @Cron('*/10 * * * * *')
  /**
   * @description
   * 해야 할 것
   * APP ID로 서명 발급
   */
  async test() {
    try {
      const clientId = process.env.NAVER_APP_ID;
      const grantType = 'client_credentials';
      const tokenType = 'SELF';
      const timestamp = Date.now();
      const signature = await this.bcryptService.createNaverSignature(
        timestamp,
      );
      const oAuth = await firstValueFrom(
        this.httpService.post(
          process.env.NAVER_TOKEN_URI,
          {
            client_id: clientId,
            timestamp,
            client_secret_sign: signature,
            grant_type: grantType,
            type: tokenType,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      const token = oAuth.data.access_token;

      const orderList = await firstValueFrom(
        this.httpService.get(
          `${
            process.env.NAVER_PRODUCT_ORDERS_URI
          }?lastChangedFrom=${startOfToday()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      if (!orderList.data.data) {
        console.log('주문 정보 없음');
        return;
      }

      const productOrderIds = orderList.data.data.lastChangeStatuses.map(
        (order) => order.productOrderId,
      );

      const orderDetails = await firstValueFrom(
        this.httpService.post(
          process.env.NAVER_ORDER_DETAIL_URI,
          {
            productOrderIds: productOrderIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      /**
       * TODO
       * ORDERID 로 벌크 중복 체크, 별크 생성
       */

      const orderIds = [];
      orderDetails.data.data.forEach((orderInfo) =>
        orderIds.push(orderInfo.order.orderId),
      );

      const foundOrders = await this.ordersRepository
        .createQueryBuilder('orders')
        .where('orderId IN (:orderIds)', { orderIds })
        .getMany();

      const foundOrderIds = foundOrders.map((order) => order.orderId);
      const newOrderIds = orderIds.filter(
        (orderId) => !foundOrderIds.includes(orderId),
      );

      const createPromises = orderDetails.data.data.map((orderInfo) => {
        if (newOrderIds.includes(orderInfo.order.orderId))
          return this.ordersRepository.save(
            this.ordersRepository.create({ ...orderInfo.order }),
          );
      });

      await Promise.all(createPromises);
    } catch (e) {
      console.log(e);
    }
  }
}
