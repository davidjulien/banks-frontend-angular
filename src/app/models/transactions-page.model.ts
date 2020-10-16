import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { Transaction, TransactionAdapter } from './transaction.model';
import { Bank } from './bank.model';
import { Budget } from './budget.model';
import { Category } from './category.model';
import { Store } from './store.model';
import { PaginatedData } from '@app/helper/infinite-scroll-data.adapter.ts';

export class TransactionsPage extends PaginatedData<Transaction> {
  constructor(data: Transaction[], nextCursor: string, total: number) {
    super(data, nextCursor, total);
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsPageAdapter {
  constructor(private transactionAdapter: TransactionAdapter) { }

  adapt(item: any, allBanks: Bank[], allBudgets: Budget[], allCategories: Category[], allStores: Store[]): TransactionsPage {
    return new TransactionsPage(
      item.transactions.map((subitem) => this.transactionAdapter.adapt(subitem, allBanks, allBudgets, allCategories, allStores)),
      item.next_cursor,
      item.total);
  }
}
