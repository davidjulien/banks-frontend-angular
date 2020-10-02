import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { BanksDataService } from '@app/services/banks-data.service';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { Bank, BankAdapter } from '@app/models/bank.model';

const TRANSACTIONS_DATA = {
  transactions: [
    {id: 1, bank_id: 'ing', client_id: 'CLIENT', account_id: 'ACCOUNT', transaction_id: 'TRANSACTION',
      accounting_date: '2020-09-24', effective_date: '2020-09-24',
      amount: -123.45, description: 'PAIEMENT PAR CARTE', transaction_type: 'SEPA_DEBIT'}
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


});
