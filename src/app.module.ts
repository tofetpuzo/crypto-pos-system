import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankService } from './bank/bank.service';
import { ConfigModule } from '@nestjs/config';
import { Merchant } from './merchant/merchant.entity';
import { MerchantService } from './merchant/merchant.service';
import { CryptoPaymentService } from './crypto-payment/crypto-payment.service';
import { FiatSettlementService } from './fiat-settlement/fiat-settlement.service';
import { MobileController } from './mobile/mobile.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './common/http-error.filter';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Merchant]),
    HttpModule,
  ],
  controllers: [MobileController, AppController],
  providers: [
    AppService,
    MerchantService,
    CryptoPaymentService,
    FiatSettlementService,
    BankService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
