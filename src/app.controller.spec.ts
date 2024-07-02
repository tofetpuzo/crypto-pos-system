import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FiatSettlementService } from './fiat-settlement/fiat-settlement.service';

describe('AppController', () => {
  let appController: AppController;
  let fiatSettlementService: FiatSettlementService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, FiatSettlementService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // for fiat-settlement service
  it('should settle funds', async () => {
    const settleFundsData = {
      merchantId: '123',
      cryptoAmount: 100,
      cryptoCurrency: 'BTC',
    };
    const result = await fiatSettlementService.creditMerchantAccount(
      settleFundsData.merchantId,
      settleFundsData.cryptoAmount,
      settleFundsData.cryptoCurrency,
    );
    expect(result).toEqual('Funds settled successfully');
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
