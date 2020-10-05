import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { Bank, BankAdapter } from './bank.model';

export enum TransactionType {
  CARD_DEBIT = 0,
    CARD_WITHDRAWAL,
    CHECK,
    SEPA_DEBIT,
    TRANSFER,
    INTERESTS
}

export class Transaction {
  constructor(
    public readonly id: number,
    public readonly bankId: string,
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
export class TransactionAdapter implements Adapter<Transaction> {
  constructor(private bankAdapter: BankAdapter) { }

  adapt(item: any): Transaction {
    return new Transaction(item.id, item.bank_id, item.client_id, item.account_id,
      item.transaction_id, new Date(item.accounting_date), new Date(item.effective_date),
      item.amount, item.description, TransactionType[item.transaction_type.toUpperCase() as keyof typeof TransactionType]);
  }
}
