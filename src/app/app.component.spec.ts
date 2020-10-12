import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

import { Bank } from '@app/models/bank.model';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';

import { TransactionsListComponent } from '@app/components/transactions-list/transactions-list.component';
import { TransactionComponent } from '@app/components/transaction/transaction.component';
import { AccountsListComponent } from '@app/components/accounts-list/accounts-list.component';
import { AccountComponent } from '@app/components/account/account.component';

import { BanksDataService } from '@app/services/banks-data.service';

// Date month starts at 0...
const TRANSACTIONS_PAGE_1 = new TransactionsPage(
  [
    new Transaction(1, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION1',
      new Date(Date.UTC(2020, 8, 24)), new Date(Date.UTC(2020, 8, 24)), -123.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT),
    new Transaction(2, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION2',
      new Date(Date.UTC(2020, 8, 23)), new Date(Date.UTC(2020, 8, 23)), 56.78, 'VIREMENT', TransactionType.TRANSFER)
  ],
  null,
  2);

const ACCOUNTS_1 = [
];

describe('AppComponent', () => {
  let banksDataService;

  beforeEach(async () => {
    banksDataService = jasmine.createSpyObj('BanksDataService', ['getTransactionsPage', 'getAccounts']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent, AccountsListComponent, TransactionsListComponent, TransactionComponent
      ],
      providers: [{provide: BanksDataService, useValue: banksDataService}]
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

    const getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1) );

    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.title).toEqual('banks-frontend-angular');

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('head title').textContent).toContain('banks-frontend-angular');
  });
});
