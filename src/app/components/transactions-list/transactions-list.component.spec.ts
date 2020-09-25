import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Bank } from '@app/models/bank.model';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { BanksDataService } from '@app/services/banks-data.service';
import { TransactionsListComponent } from './transactions-list.component';
import { TransactionComponent } from '@app/components/transaction/transaction.component';

// Date month starts at 0...
const TRANSACTIONS_PAGE = new TransactionsPage(
  [
    new Transaction(1, new Bank("ing", "ING"), "CLIENT", "ACCOUNT", new Date(Date.UTC(2020,8,24,12,0,0)), "TRANSACTION1", new Date(Date.UTC(2020,8,24)), new Date(Date.UTC(2020,8,24)), -123.45, "PAIEMENT PAR CARTE", TransactionType.SEPA_DEBIT),
    new Transaction(2, new Bank("ing", "ING"), "CLIENT", "ACCOUNT", new Date(Date.UTC(2020,8,24,12,0,0)), "TRANSACTION2", new Date(Date.UTC(2020,8,23)), new Date(Date.UTC(2020,8,23)), 56.78, "VIREMENT", TransactionType.TRANSFER)
  ]);


describe('TransactionsListComponent', () => {
  let component: TransactionsListComponent;
  let fixture: ComponentFixture<TransactionsListComponent>;
  let getTransactionsPageSpy;

  beforeEach(async () => {
    const banksDataService = jasmine.createSpyObj('BanksDataService', ['getTransactionsPage']);
    getTransactionsPageSpy = banksDataService.getTransactionsPage.and.returnValue( of(TRANSACTIONS_PAGE) );
    TestBed.configureTestingModule({
      declarations: [ TransactionsListComponent, TransactionComponent ],
      providers: [{provide: BanksDataService, useValue: banksDataService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(getTransactionsPageSpy).toHaveBeenCalled();

    // Verify component state
    expect(component.transactions).toEqual(TRANSACTIONS_PAGE.transactions);

    // Verify display
    const transactionsElements = fixture.debugElement.queryAll(By.css('app-transaction'));
    expect(transactionsElements.length).toBe(TRANSACTIONS_PAGE.transactions.length);
  });
});
