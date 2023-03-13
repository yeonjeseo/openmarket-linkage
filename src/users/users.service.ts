import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  createAccount(createUserBody: any): string {
    console.log(createUserBody);
    return 'test';
  }

  findOneAccount(userId: string): string {
    console.log(userId);
    return 'test';
  }
}