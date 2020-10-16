import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Bank } from '@app/models/bank.model';
import { Transaction, TransactionType, PeriodType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';

import { TransactionsListComponent } from './transactions-list.component';
import { TransactionComponent } from '@app/components/transaction/transaction.component';

import { BanksDataService } from '@app/services/banks-data.service';
import { PaginatedData } from '@app/helper/infinite-scroll-data.adapter.ts';

// Date month starts at 0...
const TRANSACTIONS_PAGE_1 = new TransactionsPage(
  [
    new Transaction(1, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION1',
      new Date(Date.UTC(2020, 8, 24)), new Date(Date.UTC(2020, 8, 24)), -123.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT,
      null, PeriodType.NONE, null, null, null),
    new Transaction(2, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION2',
      new Date(Date.UTC(2020, 8, 23)), new Date(Date.UTC(2020, 8, 23)), 56.78, 'VIREMENT', TransactionType.TRANSFER,
      null, PeriodType.NONE, null, null, null)
  ],
  'next_cursor',
  4);

const TRANSACTIONS_PAGE_2 = new TransactionsPage(
  [
    new Transaction(3, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION3',
      new Date(Date.UTC(2020, 8, 22)), new Date(Date.UTC(2020, 8, 22)), -3.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT,
      null, PeriodType.NONE, null, null, null),
    new Transaction(4, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTION4',
      new Date(Date.UTC(2020, 8, 21)), new Date(Date.UTC(2020, 8, 21)), 5.8, 'VIREMENT', TransactionType.TRANSFER,
      null, PeriodType.NONE, null, null, null)
  ],
  null,
  4);



describe('TransactionsListComponent', () => {
  let banksDataService;
  let component: TransactionsListComponent;
  let fixture: ComponentFixture<TransactionsListComponent>;
  let getTransactionsPageSpy;

  beforeEach(async () => {
    banksDataService = jasmine.createSpyObj('BanksDataService', ['getTransactionsPage']);
    TestBed.configureTestingModule({
      declarations: [ TransactionsListComponent, TransactionComponent ],
      providers: [{provide: BanksDataService, useValue: banksDataService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1) );

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getTransactionsPageSpy).toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements.length).toBe(TRANSACTIONS_PAGE_1.data.length);
  }));

  it('should load more', fakeAsync(() => {
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1) );

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getTransactionsPageSpy).toHaveBeenCalled();
    expect(getTransactionsPageSpy).toHaveBeenCalledTimes(1);

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements.length).toBe(TRANSACTIONS_PAGE_1.data.length);

    // Load more
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs('next_cursor', 10).and.returnValue( of(TRANSACTIONS_PAGE_2));

    component.loadMore();

    expect(getTransactionsPageSpy).toHaveBeenCalled();
    expect(getTransactionsPageSpy).toHaveBeenCalledTimes(2);

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements2 = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements2.length).toBe(TRANSACTIONS_PAGE_1.data.length + TRANSACTIONS_PAGE_2.data.length);
  }));

  it('should not load if it is already loading', fakeAsync(() => {
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1) );

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getTransactionsPageSpy).toHaveBeenCalled();
    expect(getTransactionsPageSpy).toHaveBeenCalledTimes(1);

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements.length).toBe(TRANSACTIONS_PAGE_1.data.length);

    // Load more
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs('next_cursor', 10).and.returnValue( of(TRANSACTIONS_PAGE_2));

    component.loadMore();
    component.loadMore(); // Load again, should not trigger an other getTransactionsPage

    expect(getTransactionsPageSpy).toHaveBeenCalled();
    expect(getTransactionsPageSpy).toHaveBeenCalledTimes(2); // And not 3

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements2 = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements2.length).toBe(TRANSACTIONS_PAGE_1.data.length + TRANSACTIONS_PAGE_2.data.length);
  }));



  it('should reset', fakeAsync(() => {
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1) );

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getTransactionsPageSpy).toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements.length).toBe(TRANSACTIONS_PAGE_1.data.length);

    // Reset
    getTransactionsPageSpy = banksDataService.getTransactionsPage.
      withArgs(null, 10).and.returnValue( of(TRANSACTIONS_PAGE_1));

    component.reset();

    expect(getTransactionsPageSpy).toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    // Verify display
    const transactionsElements2 = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements2.length).toBe(TRANSACTIONS_PAGE_1.data.length);
  }));
});
