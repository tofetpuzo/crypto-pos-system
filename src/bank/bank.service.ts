// Make an api call to the bank service to credit the merchant's bank account with the fiat amount.
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BankAccount } from './bank-account.entity';

@Injectable()
export class BankService {
  async creditBankAccount(
    bankAccount: BankAccount,
    amount: number,
    cryptoCurrency: string,
  ) {
    // validate the bank account

    const customerValidator = await this.validateBankAccount(
      bankAccount.accountNumber,
      bankAccount.accountName,
      bankAccount.bankName,
    );

    if (amount < 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!customerValidator) {
      throw new Error('Invalid bank account');
    } else {
      // Make API call to bank service to credit the merchant's bank account
      const response = await axios.post('https://api.bank.com/credit', {
        accountNumber: bankAccount.accountNumber,
        amount,
        currency: cryptoCurrency,
      });
      return response.data;
    }
  }

  async getMerchantBankAccount(merchantId: string): Promise<BankAccount> {
    // Make API call to bank service to get the merchant's bank account details
    const response = await axios.get(
      `https://api.bank.com/merchant/${merchantId}/account`,
    );
    return response.data;
  }

  // check if the bank account is valid

  async validateBankAccount(
    accountNumber: string,
    accountName: string,
    bankName: string,
  ): Promise<boolean> {
    // Make API call to bank service to validate the bank account
    const response = await axios.get('https://api.bank.com/validate', {
      params: {
        accountNumber,
        accountName,
        bankName,
      },
    });

    if (response.data.valid) {
      return true;
    }
    return false;
  }
}
