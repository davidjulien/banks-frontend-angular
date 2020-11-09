import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '@app/models/transaction.model';
import { Store } from '@app/models/store.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { BanksDataService } from '@app/services/banks-data.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  pTransaction: Transaction;
  pStores$: Observable<Store[]>;
  pBudgets$: Observable<Budget[]>;
  pCategories$: Observable<Category[]>;

  date: Date;
  storeSelectedId: number;
  budgetSelectedId: number;
  categoriesSelectedIds: number[];

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set transaction(transaction: Transaction) {
    this.pTransaction = transaction;
    this.storeSelectedId = this.pTransaction.store == null ? null : this.pTransaction.store.id;
    this.budgetSelectedId = this.pTransaction.budget == null ? null : this.pTransaction.budget.id;
    this.categoriesSelectedIds = this.pTransaction.categories == null ? null : this.pTransaction.categories.map((cat) => cat.id);
    this.date = this.pTransaction.date;
  }

  get transaction(): Transaction {
    return this.pTransaction;
  }

  @Input()
  set stores$(stores$: Observable<Store[]>) {
    this.pStores$ = stores$;
  }

  @Input()
  set budgets$(budgets$: Observable<Budget[]>) {
    this.pBudgets$ = budgets$;
  }

  @Input()
  set categories$(categories$: Observable<Category[]>) {
    this.pCategories$ = categories$;
  }
}
