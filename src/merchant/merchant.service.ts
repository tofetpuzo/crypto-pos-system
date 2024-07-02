import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './merchant.entity';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async registerMerchant(name: string): Promise<Merchant> {
    const merchant = this.merchantRepository.create({ name });
    return this.merchantRepository.save(merchant);
  }

  async getMerchant(id: number): Promise<Merchant> {
    return this.merchantRepository.findOne({ where: { id } });
  }

  async updateBalance(id: number, amount: number): Promise<Merchant> {
    const merchant = await this.getMerchant(id);
    merchant.accountBalance += amount;
    return this.merchantRepository.save(merchant);
  }

  async getSettlementHistory(id: number): Promise<any[]> {
    // Implement logic to fetch settlement history from database

    const history = await this.merchantRepository.query(
      `SELECT name, amount, created_at FROM settlement_history WHERE merchant_id = ${id}`,
    );

    return history;
  }
}
