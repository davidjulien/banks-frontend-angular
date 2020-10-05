import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { Transaction, TransactionAdapter } from './transaction.model';
import { Bank } from './bank.model';

export class TransactionsPage {
  constructor(public readonly transactions: Transaction[]) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsPageAdapter {
  constructor(private transactionAdapter: TransactionAdapter) { }

  adapt(item: any, allBanks: Bank[]): TransactionsPage {
    return new TransactionsPage(item.transactions.map((subitem) => this.transactionAdapter.adapt(subitem, allBanks)));
  }
}
