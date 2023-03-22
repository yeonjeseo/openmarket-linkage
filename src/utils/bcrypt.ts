import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  SALT_ROUND = Number(process.env.SALT_ROUND);
  NAVER_APP_SECRET = process.env.NAVER_APP_SECRET;
  NAVER_APP_ID = process.env.NAVER_APP_ID;

  plainToHash = (plain, salt: string | number = this.SALT_ROUND) =>
    bcrypt.hash(plain, salt);

  comparePlainHash = (plain, hashed) => bcrypt.compare(plain, hashed);

  createNaverSignature = async (timestamp) => {
    const plain = `${this.NAVER_APP_ID}_${timestamp}`;
    const hashed = await this.plainToHash(plain, this.NAVER_APP_SECRET);
    return Buffer.from(hashed, 'utf-8').toString('base64');
  };
}
