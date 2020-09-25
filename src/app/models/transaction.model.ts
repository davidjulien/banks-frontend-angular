import { Injectable } from "@angular/core";
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
  constructor(public readonly id: number, 
    public readonly bank: Bank, 
    public readonly clientId: string, 
    public readonly accountId: string, 
    public readonly fetchingAt: Date, 
    public readonly transactionId: string, 
    public readonly accountingDate: Date, 
    public readonly effectiveDate: Date, 
    public readonly amount: number, 
    public readonly description: string, 
    public readonly transactionType: TransactionType) {
  }
}

@Injectable({
  providedIn: "root",
})
export class TransactionAdapter implements Adapter<Transaction> {
  constructor(private bankAdapter: BankAdapter) { }

  adapt(item: any): Transaction {
    return new Transaction(item.id, this.bankAdapter.adapt(item.bank), item.clientId, item.accountId, new Date(item.fetchingAt), item.transactionId, new Date(item.accountingDate), new Date(item.effectiveDate), item.amount, item.description, TransactionType[item.transactionType as keyof typeof TransactionType]);
  }
}
