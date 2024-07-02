import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BankService } from '../bank/bank.service';

@Injectable()
export class FiatSettlementService {
  constructor(
    private readonly httpService: HttpService,
    private bankService: BankService,
  ) {}

  async convertToFiat(
    cryptoAmount: number,
    cryptoCurrency: string,
    fiatCurrency: string,
  ) {
    const url = 'https://api.crypto-to-fiat.com/convert';
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            amount: cryptoAmount,
            from: cryptoCurrency,
            to: fiatCurrency,
          },
        }),
      );
      return response.data.fiatAmount;
    } catch (error) {
      throw new Error('Error converting to fiat: ' + error.message);
    }
  }

  async creditMerchantAccount(
    merchantId: string,
    fiatAmount: number,
    cryptoCurrency: string,
  ) {
    //  get the bank account details of the merchant
    const bankAccount =
      await this.bankService.getMerchantBankAccount(merchantId);

    // credit the merchant's bank account with the fiat amount
    await this.bankService.creditBankAccount(
      bankAccount,
      fiatAmount,
      cryptoCurrency,
    );
  }

  async settleFunds(
    merchantId: string,
    cryptoAmount: number,
    cryptoCurrency: string,
  ) {
    // Convert crypto amount to fiat
    const fiatAmount = await this.convertToFiat(
      cryptoAmount,
      cryptoCurrency,
      'USD',
    );

    // Credit merchant account with fiat amount
    await this.creditMerchantAccount(merchantId, fiatAmount, cryptoCurrency);
  }
}
