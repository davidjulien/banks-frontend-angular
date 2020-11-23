import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction, PeriodType } from '@app/models/transaction.model';
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
  readonly periods = [ {id: 'month', name: 'Month' },
    {id: 'bimester', name: 'Bimester' },
    {id: 'quarter', name: 'Quarter' },
    {id: 'semester', name: 'Semester' },
    {id: 'annual', name: 'Annual' }
  ];

  pTransaction: Transaction;
  pStores$: Observable<Store[]>;
  pBudgets$: Observable<Budget[]>;
  pCategories$: Observable<Category[]>;

  categoriesText: string;

  edition: boolean;
  formGroup: FormGroup;
  errorMessage: string;

  constructor(private banksDataService: BanksDataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.edition = false;
    this.errorMessage = null;
    this.createForm();
  }

  createForm(): void {
    this.formGroup = this.formBuilder.group({
      date: [null],
      period: [null],
      store: [null],
      budget: [null],
      categories: [null]
    });
  }

  @Input()
  set transaction(transaction: Transaction) {
    this.updateTransaction(transaction);
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

  onSubmit(val): void {
    this.banksDataService.updateTransaction(this.pTransaction.bank.id, this.pTransaction.clientId, this.pTransaction.accountId,
                                            this.pTransaction.id, val.date, val.period, val.store, val.budget, val.categories)
      .subscribe(
        transactionUpdated => {
          this.updateTransaction(transactionUpdated);
          this.switchEditionMode(false);
        },
        error => {
          this.errorMessage = error;
        }
      );
  }

  updateTransaction(transactionUpdated: Transaction): void {
    this.pTransaction = transactionUpdated;
    if (this.pTransaction.categories) {
      this.categoriesText = this.pTransaction.categories.map((cat) => cat.name).join(' > ');
    } else {
      this.categoriesText = '(no categories)';
    }
  }

  resetForm(): void {
    this.formGroup.patchValue({
      period: this.pTransaction.period == null ? null : this.pTransaction.period,
      store: this.pTransaction.store == null ? null : this.pTransaction.store.id,
      budget: this.pTransaction.budget == null ? null : this.pTransaction.budget.id,
      categories: this.pTransaction.categories == null ? null : this.pTransaction.categories.map((cat) => cat.id),
      date: this.pTransaction.date
    });
  }

  switchEditionMode(mode: boolean): void {
    this.resetForm();
    this.edition = mode;
  }
}
