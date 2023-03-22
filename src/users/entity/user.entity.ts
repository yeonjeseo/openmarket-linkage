import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity('USERS')
export class User extends CoreEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
}
