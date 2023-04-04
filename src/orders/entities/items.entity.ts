import { CoreEntity } from '../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Order } from './orders.entity';

@Entity('ITEMS')
export class Item extends CoreEntity {
  @Column()
  @Index('ITEMS_orderId_index')
  @ManyToOne(() => Order, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'orderId',
    referencedColumnName: 'orderId',
  })
  orderId: string;

  @Column()
  mallId: string;

  @Column()
  quantity: number;

  @Column()
  productOrderId: string;

  @Column()
  productOrderStatus: string;

  @Column()
  productName: string;

  @Column()
  placeOrderStatus: string;

  @Column()
  productOption: string;

  @Column()
  totalPaymentAmount: number;

  @Column()
  shippingDueDate: Date;

  @Column()
  sellerProductCode: string;

  @Column()
  expectedSettlementAmount: number;

  @Column()
  baseAddress: string;

  @Column()
  detailedAddress: string;

  @Column()
  zipCode: string;

  @Column({ nullable: true })
  tel1: string;

  @Column({ nullable: true })
  tel2: string;

  @Column()
  name: string;
}
