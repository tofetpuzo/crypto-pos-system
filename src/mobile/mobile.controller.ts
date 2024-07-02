import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CryptoPaymentService } from '../crypto-payment/crypto-payment.service';
import { FiatSettlementService } from '../fiat-settlement/fiat-settlement.service';
import { MerchantService } from '../merchant/merchant.service';

@Controller('mobile')
export class MobileController {
  constructor(
    private readonly cryptoPaymentService: CryptoPaymentService,
    private readonly fiatSettlementService: FiatSettlementService,
    private readonly merchantService: MerchantService,
  ) {}

  @Get('exchange-rates')
  async getExchangeRates() {
    // Call service to fetch exchange rates
    const exchangeRates = await this.cryptoPaymentService.getExchangeRates();
    return exchangeRates;
  }

  @Post('payment-confirmation')
  async paymentConfirmation(@Body() paymentData: any) {
    await this.cryptoPaymentService.handlePaymentConfirmation(paymentData);
  }

  @Get('merchant/:id')
  async getMerchant(@Param('id') id: number) {
    return this.merchantService.getMerchant(id);
  }

  // using fiat-settlement service to settle funds
  @Post('settle-funds')
  async settleFunds(@Body() settleFundsData: any) {
    const { merchantId, cryptoAmount, cryptoCurrency } = settleFundsData;
    await this.fiatSettlementService.settleFunds(
      merchantId,
      cryptoAmount,
      cryptoCurrency,
    );
  }
}
