import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { Item } from './items.entity';

@Entity('ORDERS')
export class Order extends CoreEntity {
  @Column()
  ordererTel: string;

  @Column()
  ordererNo: string;

  @Column()
  payLocationType: string;

  @Column()
  @Index('ORDERS_orderId_unique_constraint', { unique: true })
  orderId: string;

  @Column()
  paymentDate: Date;

  @Column()
  orderDate: Date;

  @Column()
  ordererName: string;

  @Column()
  isDeliveryMemoParticularInput: boolean;

  @Column({ nullable: true })
  deliveryMemo: string;
}
