import { CoreEntity } from '../../common/entities/core.entity';
import { Entity } from 'typeorm';

@Entity('ORDERS')
export class Purchase extends CoreEntity {}
