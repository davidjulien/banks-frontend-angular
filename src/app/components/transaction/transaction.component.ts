import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap, map, switchMap, distinctUntilChanged, startWith } from 'rxjs/operators';
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
  readonly fixDates = [ {id: 'previous2', name: 'Two months before' },
    {id: 'previous', name: 'Previous month' },
    {id: 'previous_if_begin', name: 'Previous month if begin' },
    {id: 'none', name: 'Current month' },
    {id: 'next_if_end', name: 'Next month if end of month' },
    {id: 'next', name: 'Next month' }
  ];

  pTransaction: Transaction;
  pStores$: Observable<Store[]>;
  pStoresFiltered$: Observable<Store[]>;
  pBudgets$: Observable<Budget[]>;
  pCategories$: Observable<Category[]>;

  categoriesText: string;

  edition: boolean;
  formGroup: FormGroup;

  allStores: Store[] = null;
  errorMessage: string;

  constructor(private banksDataService: BanksDataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.edition = false;
    this.errorMessage = null;
    this.createForm();
  }

  createForm(): void {
    const storeControl = new FormControl(null);
    this.pStoresFiltered$ = storeControl.valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged(),
        switchMap(value => {
          const filterValue = value ? (value.name ? value.name : value).toLowerCase() : '';
          return this.pStores$.pipe(
            map((stores: Store[]) => {
              this.allStores = stores;
              const filtered = stores.filter((store: Store) => store.name.toLowerCase().includes(filterValue));
              return filtered;
            }));
        })
      );

    this.formGroup = this.formBuilder.group({
      date: [null],
      period: [null],
      store: storeControl,
      budget: [null],
      categories: [null],
      fixDate: [null],
      pattern: [null]
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
    this.pStores$ = stores$.pipe(
      map((stores: Store[]) =>
        stores.sort((s1, s2) => s1.name.localeCompare(s2.name))
      ));
  }

  @Input()
  set budgets$(budgets$: Observable<Budget[]>) {
    this.pBudgets$ = budgets$.pipe(
      map((budgets: Budget[]) =>
        budgets.sort((b1, b2) => b1.name.localeCompare(b2.name))
      ));
  }

  @Input()
  set categories$(categories$: Observable<Category[]>) {
    this.pCategories$ = categories$.pipe(
      map((categories: Category[]) =>
        categories.sort((c1, c2) => c1.compareTo(c2))
      ));
  }

  onSubmit(val): void {
    this.banksDataService.updateTransaction(this.pTransaction.bank.id, this.pTransaction.clientId, this.pTransaction.accountId,
                                            this.pTransaction.id, val.date, val.period,
                                            val.store ? val.store.id : undefined, val.budget, val.categories)
      .subscribe(
        (transactionUpdated: Transaction) => {
          this.updateTransaction(transactionUpdated);
          this.switchEditionMode(false);
        },
        (error: string) => {
          this.errorMessage = error;
        }
      );
  }

  onAddMapping(val): void {
    this.banksDataService.addMapping(val.pattern, val.store ? val.store.id : undefined, val.budget, val.categories, val.fixDate, val.period)
      .subscribe(
        (mapping) => {
          this.switchEditionMode(false);
        },
        (error: string) => {
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
      store: this.pTransaction.store == null ? null : this.pTransaction.store,
      budget: this.pTransaction.budget == null ? null : this.pTransaction.budget.id,
      categories: this.pTransaction.categories == null ? null : this.pTransaction.categories.map((cat) => cat.id),
      date: this.pTransaction.date,
      fixDate: 'none',
      pattern: this.descriptionToPattern(this.pTransaction.description)
    });
  }

  descriptionToPattern(description: string): string {
    const r = description.match(/^(?:VIREMENT SEPA EMIS VERS|PAIEMENT D'UN|PAIEMENT PAR CARTE ..\/..\/....) (.*)/);
    if (r && r[1]) {
      return r[1];
    } else {
      return description;
    }
  }

  switchEditionMode(mode: boolean): void {
    this.resetForm();
    this.edition = mode;
  }

  displayStore(store: Store): string {
    return store ? store.name : '';
  }

  addStore(): void {
    const value = this.formGroup.get('store').value;
    if (value instanceof Store) {
      return ;
    } else if (this.allStores != null && this.allStores.find((store: Store) => store.name === value)) {
      this.errorMessage = 'This store already exists.';
      return ;
    } else {
      this.banksDataService.addStore(value)
        .subscribe(
          (newStore: Store) => this.formGroup.patchValue({store: newStore}),
          (error: string) => this.errorMessage = error
        );
    }
  }
}
