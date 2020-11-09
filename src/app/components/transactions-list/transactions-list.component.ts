import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { InfiniteScrollDataAdapter } from '@app/helper/infinite-scroll-data.adapter';
import { Transaction } from '@app/models/transaction.model';
import { Store } from '@app/models/store.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { BanksDataService } from '@app/services/banks-data.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  transactions$: InfiniteScrollDataAdapter;
  stores$: Observable<Store[]>;
  budgets$: Observable<Budget[]>;
  categories$: Observable<Category[]>;

  constructor(private banksDataService: BanksDataService) {
  }

  ngOnInit(): void {
    this.transactions$ = new InfiniteScrollDataAdapter(this.getSource(), 10);
    this.stores$ = this.banksDataService.getStores();
    this.budgets$ = this.banksDataService.getBudgets();
    this.categories$ = this.banksDataService.getCategories();
  }

  getSource(): (cursor, limit) => Observable<any> {
    return (cursor, limit): Observable<any> => {
      return this.banksDataService.getTransactionsPage(cursor, limit);
    };
  }

  loadMore(): void  {
    this.transactions$.loadMore();
  }

  reset(): void {
    this.transactions$.reload();
  }
}
