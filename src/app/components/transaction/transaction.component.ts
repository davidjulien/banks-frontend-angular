import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap, map, switchMap, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Transaction, PeriodType } from '@app/models/transaction.model';
import { Store } from '@app/models/store.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { BanksDataService } from '@app/services/banks-data.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

type mode = 'DISPLAY' | 'EDIT' | 'MAPPING';

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

  mode: mode;

  formGroup: FormGroup;

  allStores: Store[] = null;
  errorMessage: string;
  submitButtonText: string;

  constructor(private banksDataService: BanksDataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.mode = 'DISPLAY';
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
      pattern: [null],
      amount: [null]
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

  onSplit(): void {
    let transactionId;
    if (this.pTransaction.id.endsWith('-REM')) {
      transactionId = this.pTransaction.id.substring(0, this.pTransaction.id.length-1-4);
    } else {
      transactionId = this.pTransaction.id;
    }
    this.banksDataService.splitTransaction(this.pTransaction.bank.id, this.pTransaction.clientId, this.pTransaction.accountId, transactionId)
      .subscribe(
        (transactions: Transaction[]) => {
          this.updateTransaction(transactions[0]);
        },
        (error: string) => {
          this.errorMessage = error;
        }
      );
  }

  onCopyToPurse(): void {
    this.banksDataService.copyToPurse(this.pTransaction.bank.id, this.pTransaction.clientId, this.pTransaction.accountId, this.pTransaction.id)
      .subscribe(
        (transactions: Transaction[]) => {
          this.updateTransaction(transactions[0]);
        },
        (error: string) => {
          this.errorMessage = error;
        }
      );
  }

  onSubmit(val): void {
    switch (this.mode) {
      case 'EDIT':
        const amount = (val.amount === '' || val.amount === null) ? null: parseFloat(val.amount);
        this.banksDataService.updateTransaction(this.pTransaction.bank.id, this.pTransaction.clientId, this.pTransaction.accountId,
                                                this.pTransaction.id, val.date, val.period,
                                                val.store ? val.store.id : null, val.budget, val.categories, amount)
          .subscribe(
            (transactionUpdated: Transaction) => {
              this.updateTransaction(transactionUpdated);
              this.switchMode('DISPLAY');
            },
            (error: string) => {
              this.errorMessage = error;
            }
          );
        break;
      case 'MAPPING':
        this.banksDataService.addMapping(val.pattern, val.store ? val.store.id : null, val.budget, val.categories, val.fixDate, val.period)
          .subscribe(
            (mapping) => {
              this.switchMode('DISPLAY');
            },
            (error: string) => {
              this.errorMessage = error;
            }
          );
        break;
      default:
    }
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
      amount: this.pTransaction.splitOfId && !this.pTransaction.id.endsWith('-REM') ? this.pTransaction.amount : null,
      fixDate: 'none',
      pattern: this.descriptionToPattern(this.pTransaction.description)
    });
  }

  descriptionToPattern(description: string): string {
    const r = description.match(/^(?:PRLV SEPA|VIREMENT SEPA EMIS VERS|PAIEMENT D'UN|AVOIR CARTE|PAIEMENT PAR CARTE ..\/..\/....) (.*)/);
    if (r && r[1]) {
      return r[1];
    } else {
      return description;
    }
  }

  enableMapping(event: MatCheckboxChange): void {
    if (event.checked) {
      this.switchMode('MAPPING');
    } else {
      this.switchMode('EDIT');
    }
  }

  switchMode(newMode: mode): void {
    if (this.mode === 'DISPLAY' && newMode !== 'DISPLAY') {
      this.resetForm();
    }
    if (newMode === 'MAPPING') {
      this.formGroup.get('fixDate').enable();
      this.formGroup.get('pattern').enable();
      this.submitButtonText = 'Add mapping';
    } else if (newMode === 'EDIT') {
      this.formGroup.get('fixDate').disable();
      this.formGroup.get('pattern').disable();
      this.submitButtonText = 'Update transaction';
    }
    this.mode = newMode;
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
