import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';

import { Bank } from '@app/models/bank.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { Store } from '@app/models/store.model';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';

import { TransactionsListComponent } from '@app/components/transactions-list/transactions-list.component';
import { TransactionComponent } from '@app/components/transaction/transaction.component';
import { AccountsListComponent } from '@app/components/accounts-list/accounts-list.component';
import { AccountComponent } from '@app/components/account/account.component';

import { BanksDataService } from '@app/services/banks-data.service';

const BUDGETS = [new Budget(1, 'Courant'), new Budget(2, 'Extra')];

const CAT_ALIMENTATION = new Category(1, 'Alimentation', null);
const CAT_SUPERMARCHE = new Category(2, 'Supermarché', CAT_ALIMENTATION);
const CATEGORIES = [CAT_ALIMENTATION, CAT_SUPERMARCHE];

const STORES = [new Store(1, 'Auchan'), new Store(2, 'Carrefour')];

// Date month starts at 0...
const TRANSACTIONS_PAGE_1 = new TransactionsPage(
  [
    new Transaction('T1', new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION1',
      new Date(Date.UTC(2020, 8, 24)), new Date(Date.UTC(2020, 8, 24)), -123.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT,
      null, null, null, null, null),
    new Transaction('T2', new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION2',
      new Date(Date.UTC(2020, 8, 23)), new Date(Date.UTC(2020, 8, 23)), 56.78, 'VIREMENT', TransactionType.TRANSFER,
      null, null, null, null, null)
  ],
  null,
  2);

const ACCOUNTS_1 = [
];

describe('AppComponent', () => {
  let banksDataService;

  beforeEach(async () => {
    banksDataService = jasmine.createSpyObj('BanksDataService', ['getTransactionsPage', 'getAccounts', 'getBudgets', 'getCategories', 'getStores']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSelectModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule
      ],
      declarations: [
        AppComponent, AccountsListComponent, TransactionsListComponent, TransactionComponent
      ],
      providers: [{provide: BanksDataService, useValue: banksDataService}, MatNativeDateModule, FormBuilder ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'banks-frontend-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);

    const getAccountsSpy = banksDataService.getAccounts.and.returnValue( of (ACCOUNTS_1) );
    const getBudgetsSpy = banksDataService.getBudgets.and.returnValue( of(BUDGETS) );
    const getCategoriesSpy = banksDataService.getCategories.and.returnValue( of(CATEGORIES) );
    const getStoresSpy = banksDataService.getCategories.and.returnValue( of(STORES) );

    const getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1) );

    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.title).toEqual('banks-frontend-angular');

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('head title').textContent).toContain('banks-frontend-angular');
  });
});
