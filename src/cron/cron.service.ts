import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BcryptService } from '../utils/bcrypt';
import '../utils/luxon';

@Injectable()
export class CronService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bcryptService: BcryptService,
  ) {}
  @Cron('0 * * * * *')
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
          `${process.env.NAVER_PRODUCT_ORDERS_URI}?lastChangedFrom=2023-03-12T14:10:00.794Z`,
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

      console.log(orderDetails.data.data);
      // orderDetails.data.data.forEach((order) => console.log(order));
    } catch (e) {
      console.log(e);
    }
  }
}
