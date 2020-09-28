import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { BanksDataService } from '@app/services/banks-data.service';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { Bank } from '@app/models/bank.model';

const TRANSACTIONS_DATA = {
  transactions: [
    {id: 1, bank: {id: 'ing', name: 'ING'}, clientId: 'CLIENT', accountId: 'ACCOUNT', fetchingAt: '2020-09-24T12:00:00Z', transactionId: 'TRANSACTION', accountingDate: '2020-09-24', effectiveDate: '2020-09-24',
      amount: -123.45, description: 'PAIEMENT PAR CARTE', transactionType: 'SEPA_DEBIT'}
  ]
};
// Date month starts at 0...
const TRANSACTIONS_DATA_EXPECTED = new TransactionsPage(
  [
    new Transaction(1, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', new Date(Date.UTC(2020, 8, 24, 12, 0, 0)), 'TRANSACTION',
      new Date(Date.UTC(2020, 8, 24)), new Date(Date.UTC(2020, 8, 24)), -123.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT)
  ]);

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
    const request = httpMock.expectOne(`${service.API_URL}/transactions.json`);
    expect(request.request.method).toBe('GET');
    request.flush(TRANSACTIONS_DATA);
  });

});
