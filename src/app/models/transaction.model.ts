import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { Bank } from './bank.model';

export enum TransactionType {
  CARD_DEBIT = 0,
    CARD_WITHDRAWAL,
    CHECK,
    SEPA_DEBIT,
    TRANSFER,
    INTERESTS,
    BANKS_FEES,
    OTHER
}

export class Transaction {
  constructor(
    public readonly id: number,
    public readonly bank: Bank,
    public readonly clientId: string,
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly accountingDate: Date,
    public readonly effectiveDate: Date,
    public readonly amount: number,
    public readonly description: string,
    public readonly transactionType: TransactionType) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionAdapter {
  constructor() { }

  adapt(item: any, allBanks: Bank[]): Transaction {
    const bank: Bank = allBanks.find((aBank) => aBank.id === item.bank_id);
    return new Transaction(item.id, bank, item.client_id, item.account_id,
      item.transaction_id, new Date(item.accounting_date), new Date(item.effective_date),
      item.amount, item.description, TransactionType[item.type.toUpperCase() as keyof typeof TransactionType]);
  }
}
