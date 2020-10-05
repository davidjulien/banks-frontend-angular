import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { BanksDataService } from '@app/services/banks-data.service';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { Bank } from '@app/models/bank.model';
import { Account, AccountOwnership, AccountType } from '@app/models/account.model';

const TRANSACTIONS_DATA = {
  transactions: [
    {id: 1, bank_id: 'ing', client_id: 'CLIENT', account_id: 'ACCOUNT', transaction_id: 'TRANSACTION',
      accounting_date: '2020-09-24', effective_date: '2020-09-24',
      amount: -123.45, description: 'PAIEMENT PAR CARTE', transaction_type: 'sepa_debit'}
  ]
};
// Date month starts at 0...
const TRANSACTIONS_DATA_EXPECTED = new TransactionsPage(
  [
    new Transaction(1, 'ing', 'CLIENT', 'ACCOUNT', 'TRANSACTION',
      new Date(Date.UTC(2020, 8, 24)), new Date(Date.UTC(2020, 8, 24)), -123.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT)
  ]);

const BANKS_DATA = [ {id: 'ing', name: 'ING'} ];
const BANKS_DATA_EXPECTED = [ new Bank('ing', 'ING') ];

const ACCOUNTS_DATA = JSON.parse('[{"type":"savings","ownership":"single","owner":"owner1","number":"number1","name":"livret1","id":"account1","balance":6044.09},{"type":"current","ownership":"joint","owner":"owner2","number":"number2","name":"Compte Courant","id":"account2","balance":6317.64},{"type":"home_loan","ownership":"joint","owner":"owner3","number":"number3","name":"Crédit Immobilier","id":"account3","balance":88064.58}]');
const ACCOUNTS_DATA_EXPECTED = [
  new Account(undefined, undefined, 'account1', 6044.09, 'number1', 'owner1', AccountOwnership.SINGLE, AccountType.SAVINGS, 'livret1'),
  new Account(undefined, undefined, 'account2', 6317.64, 'number2', 'owner2', AccountOwnership.JOINT, AccountType.CURRENT, 'Compte Courant'),
  new Account(undefined, undefined, 'account3', 88064.58, 'number3', 'owner3', AccountOwnership.JOINT, AccountType.HOME_LOAN, 'Crédit Immobilier')
];


describe('BanksDataService', () => {
  let service: BanksDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BanksDataService]
    });
    service = TestBed.inject(BanksDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should returns transactions data', () => {
    expect(service).toBeTruthy();

    service.getTransactionsPage().subscribe((data: TransactionsPage) => {
      expect(data).toEqual(TRANSACTIONS_DATA_EXPECTED);
    });
    const request = httpMock.expectOne(`${service.API_URL}/transactions`);
    expect(request.request.method).toBe('GET');
    request.flush(TRANSACTIONS_DATA);
  });

  it('should returns all banks', () => {
    expect(service).toBeTruthy();

    service.getBanks().subscribe((data: Bank[]) => {
      expect(data).toEqual(BANKS_DATA_EXPECTED);
    });
    const request = httpMock.expectOne(`${service.API_URL}/banks`);
    expect(request.request.method).toBe('GET');
    request.flush(BANKS_DATA);
  });

  it('should returns all accounts', () => {
    expect(service).toBeTruthy();

    service.getAccounts().subscribe((data: Account[]) => {
      expect(data).toEqual(ACCOUNTS_DATA_EXPECTED);
    });
    const request = httpMock.expectOne(`${service.API_URL}/accounts`);
    expect(request.request.method).toBe('GET');
    request.flush(ACCOUNTS_DATA);
  });

});
