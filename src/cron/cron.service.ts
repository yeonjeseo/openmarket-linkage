import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BcryptService } from '../utils/bcrypt';
import { endOfToday, startOfToday } from '../utils/luxon';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../orders/entities/items.entity';

@Injectable()
export class CronService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bcryptService: BcryptService,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
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
          }?lastChangedFrom=${startOfToday()}&lastChangedTo=${endOfToday()}`,
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
      orderDetails.data.data.forEach((orderInfo) => {
        orderIds.push(orderInfo.order.orderId);
      });

      const [foundOrders, foundItems] = await Promise.all([
        this.ordersRepository
          .createQueryBuilder('orders')
          .where('orderId IN (:orderIds)', { orderIds })
          .getMany(),
        this.itemsRepository
          .createQueryBuilder('items')
          .where('productOrderId IN (:productOrderIds)', { productOrderIds })
          .getMany(),
      ]);

      const foundProductOrderIds = foundItems.map(
        (item) => item.productOrderId,
      );
      const newProductOrderIds = productOrderIds.filter(
        (productOrderId) => !foundProductOrderIds.includes(productOrderId),
      );

      const foundOrderIds = foundOrders.map((order) => order.orderId);
      const newOrderIds = orderIds.filter(
        (orderId) => !foundOrderIds.includes(orderId),
      );

      const createOrderPromises = orderDetails.data.data.map((orderInfo) => {
        if (newOrderIds.includes(orderInfo.order.orderId))
          return this.ordersRepository.save(
            this.ordersRepository.create({ ...orderInfo.order }),
          );
      });
      const createItemPromises = orderDetails.data.data.map((orderInfo) => {
        if (newProductOrderIds.includes(orderInfo.productOrder.productOrderId))
          return this.itemsRepository.save(
            this.itemsRepository.create({
              ...orderInfo.productOrder,
              baseAddress: orderInfo.productOrder.shippingAddress.baseAddress,
              detailedAddress:
                orderInfo.productOrder.shippingAddress.detailedAddress,
              zipCode: orderInfo.productOrder.shippingAddress.zipCode,
              tel1: orderInfo.productOrder.shippingAddress.tel1,
              tel2: orderInfo.productOrder.shippingAddress.tel2,
              name: orderInfo.productOrder.shippingAddress.name,
              orderId: orderInfo.order.orderId,
            }),
          );
      });

      await Promise.all([...createOrderPromises, ...createItemPromises]);
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * app.get('/test' , async (req, res, next) => {
 *   try {
 *     const clientId = config.NAVER_APP_ID;
 *     const grantType = 'client_credentials';
 *     const tokenType = 'SELF';
 *     const timestamp = Date.now();
 *     const signature = await createNaverSignature(timestamp);
 *
 *
 *     const oAuth = await axios.post('https://api.commerce.naver.com/external/v1/oauth2/token', {
 *       client_id: clientId,
 *       timestamp,
 *       client_secret_sign: signature,
 *       grant_type: grantType,
 *       type: tokenType
 *     },{
 *       headers: {
 *         'Content-Type': 'application/x-www-form-urlencoded'
 *       }
 *     });
 *
 *     const token = oAuth.data.access_token;
 *
 *     const getMe = await axios.get('https://api.commerce.naver.com/external/v1/seller/channels', {
 *       headers: {
 *         'Authorization': `Bearer ${token}`
 *       }
 *     })
 *     const channelNo = getMe.data[0].channelNo;
 *
 *     const productList = await axios.post('https://api.commerce.naver.com/external/v1/products/search', {
 *       page: 1,
 *       size: 50,
 *       orderType: 'NO',
 *     }, {
 *       headers: {
 *         'Authorization': `Bearer ${token}`,
 *       }
 *     })
 *     // productList.data.contents.forEach((product) => console.log(product.channelProducts));
 *
 *     // const orderList = await axios.get(`https://api.commerce.naver.com/external/v1/pay-order/seller/orders/${productId}/product-order-ids`, {
 *     //   headers: {
 *     //     'Authorization': `Bearer ${token}`,
 *     //   }
 *     // })
 *     // console.log(orderList.data);
 *
 *     const orderList = await axios.get(`https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/last-changed-statuses?lastChangedFrom=2023-03-12T14:10:00.794Z&lastChangedTo=2023-03-12T14:50:00.794Z`, {
 *       headers: {
 *         'Authorization': `Bearer ${token}`,
 *       }
 *     })
 *     console.log(orderList.data)
 *     const arr = orderList.data.data.lastChangeStatuses.map(order => order.productOrderId);
 *
 *     const orderDetails = await axios.post('https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query', {
 *       productOrderIds: arr
 *     }, {
 *       headers: {
 *         'Authorization': `Bearer ${token}`,
 *       }
 *     })
 *
 *     // console.log(orderList.data.data.lastChangeStatuses);
 *
 *     // console.log(orderDetails.data);
 *     orderDetails.data.data.forEach((order) => console.log(order));
 *
 *     const productOrderIds = orderDetails.data.data.map(order => order.productOrder.productOrderId);
 *
 *     /**
 *      * @description 발주 확인 처리
 *      * POST https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/confirm
 *      *
*     // const confirmBaljoo = await axios.post('https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/confirm', {
*     //   productOrderIds
*     // }, {
*     //   headers: {
*     //     'Authorization': `Bearer ${token}`,
*     //   }
*     // })
*     // console.log(confirmBaljoo.data)
*
*     /**
 *      * @description 발송 처리
 *      * POST https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/dispatch
 *      *
*     // const myProductOrderId = productOrderIds[0];
*     // const dispatchResult = await axios.post('https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/dispatch', {
*     //   dispatchProductOrders: [
*     //     {
*     //       productOrderId: myProductOrderId,
*     //       deliveryMethod: 'DELIVERY',
*     //       deliveryCompanyCode: 'EPOST',
*     //       trackingNumber: '6892036658750',
*     //       dispatchDate: '2023-03-13T20:59:44.118+09:00'
*     //     }
*     //   ]
*     // }, {
*     //   headers: {
*     //     'Authorization': `Bearer ${token}`,
*     //   }
*     // })
*     // const data = dispatchResult.data;
*
return res.send('ok');
*
}catch
(e)
{
*
  console.log(e)
  * next(e)
  *
}
*
})
 */
