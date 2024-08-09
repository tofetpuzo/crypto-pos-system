import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FiatSettlementService } from '../fiat-settlement/fiat-settlement.service';

@Injectable()
export class CryptoPaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly fiatSettlementService: FiatSettlementService,
  ) {}

  async initiatePayment(amount: number, currency: string) {
    const url = 'https://api.commerce.coinbase.com/charges';
    const apiKey = process.env.COINBASE_API_KEY;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            name: 'Payment',
            description: 'Payment description',
            local_price: { amount, currency },
            pricing_type: 'fixed_price',
          },
          {
            headers: {
              'X-CC-Api-Key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new Error('Error initiating payment: ' + error.message);
    }
  }
  // handle payment confirmation
  async handlePaymentConfirmation(event: any) {
    // Process payment confirmation

    if (event.event.type !== 'charge:confirmed') {
      return;
    }

    // Extract details from event object
    const chargeId = event.event.data.id;
    const amount = event.event.data.pricing.local.amount;
    const currency = event.event.data.pricing.local.currency;

    // Get exchange rates
    const exchangeRates = await this.getExchangeRates();

    // Calculate amount in USD
    const usdAmount = amount / exchangeRates[currency];

    // Perform settlement
    this.fiatSettlementService.settleFunds('USD', usdAmount, chargeId);
  }

  async getExchangeRates() {
    const url = 'https://api.commerce.coinbase.com/exchange-rates';
    const apiKey = this.configService.get<string>('COINBASE_API_KEY');

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-CC-Api-Key': apiKey,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Error fetching exchange rates: ' + error.message);
    }
  }
}
