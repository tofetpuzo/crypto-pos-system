// create a bank account entity

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column()
  bankName: string;

  @Column()
  accountType: string;

  @Column()
  balance: number;
}
