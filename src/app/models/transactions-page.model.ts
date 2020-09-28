import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { Transaction, TransactionAdapter } from './transaction.model';

export class TransactionsPage {
  constructor(public readonly transactions: Transaction[]) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsPageAdapter implements Adapter<TransactionsPage> {
  constructor(private transactionAdapter: TransactionAdapter) { }

  adapt(item: any): TransactionsPage {
    return new TransactionsPage(item.transactions.map((subitem) => this.transactionAdapter.adapt(subitem)));
  }
}
