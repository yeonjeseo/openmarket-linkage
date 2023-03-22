import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity('ORDERS')
export class Purchase extends CoreEntity {
  @Column()
  mallId: string;

  @Column()
  quantity: number;

  @Column()
  productOrderId: string;

  @Column()
  productOrderStatus: string;

  @Column()
  productOrderName: string;

  @Column()
  placeOrderStatus: string;

  @Column()
  productOption: string;

  @Column()
  totalPaymentAmount: number;

  @Column()
  shippingDueDate: Date;

  @Column()
  shippingAddress: string;

  @Column()
  sellerProductCode: string;

  @Column()
  expectedSettlementAmount: number;
}
