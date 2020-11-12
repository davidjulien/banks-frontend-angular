import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '@app/models/transaction.model';
import { Store } from '@app/models/store.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';

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

  categoriesText: string;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set transaction(transaction: Transaction) {
    this.pTransaction = transaction;
    if (this.pTransaction.categories) {
      this.categoriesText = this.pTransaction.categories.map((cat) => cat.name).join(' > ');
    } else {
      this.categoriesText = '(no categories)';
    }
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
