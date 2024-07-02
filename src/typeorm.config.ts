import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Merchant } from './merchant/merchant.entity';
import process from 'process';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Merchant],
  synchronize: true,
};
