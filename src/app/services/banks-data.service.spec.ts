import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { BanksDataService } from '@app/services/banks-data.service';
import { Transaction, TransactionType, PeriodType } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { Bank } from '@app/models/bank.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { Store } from '@app/models/store.model';
import { Mapping, FixDate} from '@app/models/mapping.model';

import { Account, AccountOwnership, AccountType } from '@app/models/account.model';

const ALIMENTATION_CATEGORY = new Category(6, 'Alimentation', null);

const TRANSACTION_DATA_STR = '{"id":"T1","bank_id":"ing","client_id":"CLIENT1","account_id":"ACCOUNT1","transaction_id":"TRANSACTION1","accounting_date":"2020-09-24","effective_date":"2020-09-24","amount":-123.45,"description":"PAIEMENT PAR CARTE","type":"sepa_debit","ext_date":"2020-09-23","ext_period":"quarter","ext_budget_id":2,"ext_categories_ids":[6,7],"ext_store_id":2,"ext_mapping_id":24,"ext_splitted":false,"ext_split_of_id":null,"ext_to_purse":false}';
const TRANSACTION_DATA = JSON.parse(TRANSACTION_DATA_STR);

const TRANSACTION_DATA_EXPECTED = new Transaction('T1', new Bank('ing', 'ING'), 'CLIENT1', 'ACCOUNT1', 'TRANSACTION1',
      new Date(Date.UTC(2020, 8, 24)), new Date(Date.UTC(2020, 8, 24)), -123.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT,
      24, new Date(Date.UTC(2020, 8, 23)), PeriodType.QUARTER, new Budget(2, 'Courant'),
      [ALIMENTATION_CATEGORY, new Category(7, 'Supermarché', ALIMENTATION_CATEGORY)], new Store(2, 'Intermarché'), false, null, false);

const TRANSACTIONS_DATA = JSON.parse('{"transactions":[' + TRANSACTION_DATA_STR + '],"next_cursor":"next_cursor","total":5}');
// Date month starts at 0...
const TRANSACTIONS_DATA_EXPECTED = new TransactionsPage(
  [
    TRANSACTION_DATA_EXPECTED
  ],
  'next_cursor',
  5);

const TRANSACTIONS_DATA_2 = JSON.parse('{"transactions":[{"id":"T2","bank_id":"ing","client_id":"CLIENT2","account_id":"ACCOUNT2","transaction_id":"TRANSACTION2","accounting_date":"2020-09-23","effective_date":"2020-09-23","amount":-3.45,"description":"PAIEMENT PAR CARTE","type":"sepa_debit","ext_date":null,"ext_categories_ids":[],"ext_period":null,"ext_store_id":null,"ext_mapping_id":null,"ext_budget_id":null,"ext_splitted":false,"ext_split_of_id":null,"ext_to_purse":false}],"next_cursor":null,"total":5}');
const TRANSACTIONS_DATA_2_EXPECTED = new TransactionsPage(
  [
    new Transaction('T2', new Bank('ing', 'ING'), 'CLIENT2', 'ACCOUNT2', 'TRANSACTION2',
      new Date(Date.UTC(2020, 8, 23)), new Date(Date.UTC(2020, 8, 23)), -3.45, 'PAIEMENT PAR CARTE', TransactionType.SEPA_DEBIT,
      null, null, null, null, [], null, false, null, false)
  ],
  null,
  5);

const BANKS_DATA = [ {id: 'ing', name: 'ING'} ];
const BANKS_DATA_EXPECTED = [ new Bank('ing', 'ING') ];

const ACCOUNTS_DATA = JSON.parse('[{"type":"savings","ownership":"single","owner":"owner1","number":"number1","name":"livret1","id":"account1","balance":6044.09},{"type":"current","ownership":"joint","owner":"owner2","number":"number2","name":"Compte Courant","id":"account2","balance":6317.64},{"type":"home_loan","ownership":"joint","owner":"owner3","number":"number3","name":"Crédit Immobilier","id":"account3","balance":88064.58}]');
const ACCOUNTS_DATA_EXPECTED = [
  new Account(undefined, undefined, 'account1', 6044.09, 'number1', 'owner1', AccountOwnership.SINGLE, AccountType.SAVINGS,
    'livret1'),
  new Account(undefined, undefined, 'account2', 6317.64, 'number2', 'owner2', AccountOwnership.JOINT, AccountType.CURRENT,
    'Compte Courant'),
  new Account(undefined, undefined, 'account3', 88064.58, 'number3', 'owner3', AccountOwnership.JOINT, AccountType.HOME_LOAN,
    'Crédit Immobilier')
];

const BUDGETS_DATA = JSON.parse('[{"name":"Aucun","id":1},{"name":"Courant","id":2},{"name":"Plaisir","id":3},{"name":"Exceptionnel","id":4},{"name":"Épargne","id":5}]');
const CATEGORIES_DATA = JSON.parse('[{"up_category_id":null,"name":"Ressource","id":1},{"up_category_id":null,"name":"Alimentation","id":6},{"up_category_id":1,"name":"Allocation","id":3},{"up_category_id":1,"name":"Intérêts","id":5},{"up_category_id":1,"name":"Donation","id":4},{"up_category_id":1,"name":"Revenu","id":2},{"up_category_id":6,"name":"Supermarché","id":7}]');
const STORES_DATA = JSON.parse('[{"name":"Carrefour Chambourcy","id":3},{"name":"LIDL St-Germain-en-Laye","id":1},{"name":"Intermarché","id":2},{"name":"Monoprix","id":4},{"name":"Carrefour Market","id":5},{"name":"Naturalia","id":6}]');


describe('BanksDataService', () => {
  let service: BanksDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BanksDataService, DatePipe]
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

  it('should returns all banks', () => {
    expect(service).toBeTruthy();

    service.getBanks().subscribe((data: Bank[]) => {
      expect(data).toEqual(BANKS_DATA_EXPECTED);
    });
    const request = httpMock.expectOne(`${service.API_URL}/banks`);
    expect(request.request.method).toBe('GET');
    request.flush(BANKS_DATA);
  });

  it('should returns transactions data first page', () => {
    expect(service).toBeTruthy();

    service.getTransactionsPage(null, 2).subscribe((data: TransactionsPage) => {
      expect(data).toEqual(TRANSACTIONS_DATA_EXPECTED);
    });

    // Expect one call to get all banks
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    // Expect one call to get all budgets
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    // Expect one call to get all categories
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    // Expect one call to get all stores
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions?limit=2`);
    expect(request.request.method).toBe('GET');
    request.flush(TRANSACTIONS_DATA);
  });

  it('should returns transactions data next page', () => {
    expect(service).toBeTruthy();

    service.getTransactionsPage('next_cursor', 2).subscribe((data: TransactionsPage) => {
      expect(data).toEqual(TRANSACTIONS_DATA_2_EXPECTED);
    });

    // Expect one call to get all banks
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    // Expect one call to get all budgets
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    // Expect one call to get all categories
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    // Expect one call to get all stores
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions?cursor=${TRANSACTIONS_DATA_EXPECTED.nextCursor}&limit=2`);
    expect(request.request.method).toBe('GET');
    request.flush(TRANSACTIONS_DATA_2);
  });


  it('should returns all accounts', () => {
    expect(service).toBeTruthy();

    service.getAccounts().subscribe((data: Account[]) => {
      expect(data).toEqual(ACCOUNTS_DATA_EXPECTED);
    });

    // Expect one call to get all banks
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/accounts`);
    expect(request.request.method).toBe('GET');
    request.flush(ACCOUNTS_DATA);
  });


  it('should update a transaction and return updated transaction', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = PeriodType.QUARTER;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.updateTransaction(bankId, clientId, accountId, transactionId, date, period, storeId, budgetId, categoriesIds, null)
      .subscribe(
        (data: Transaction) => {
          expect(data).toEqual(TRANSACTION_DATA_EXPECTED);
        },
        error => expect(true).toBe(false)
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      ext_date: '2020-09-23',
      ext_period : period,
      ext_store_id: storeId,
      ext_budget_id: budgetId,
      ext_categories_ids: categoriesIds,
      amount: null
    });
    request.flush(TRANSACTION_DATA);
  });

  it('should update a transaction but API returns an error', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = null;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.updateTransaction(bankId, clientId, accountId, transactionId, date, period, storeId, budgetId, categoriesIds, null)
      .subscribe(
        data => expect(true).toBe(false),
        error => expect(error).toBe('Unable to update transaction info.')
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      ext_date: '2020-09-23',
      ext_period : null,
      ext_store_id: storeId,
      ext_budget_id: budgetId,
      ext_categories_ids: categoriesIds,
      amount: null
    });
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    request.flush('Invalid parameters', mockErrorResponse);
  });

  it('should update a transaction but an error occurs in client', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = null;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.updateTransaction(bankId, clientId, accountId, transactionId, date, period, storeId, budgetId, categoriesIds, null)
      .subscribe(
        data => expect(true).toBe(false),
        error => expect(error).toBe('Unable to update transaction info.')
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      ext_date: '2020-09-23',
      ext_period : null,
      ext_store_id: storeId,
      ext_budget_id: budgetId,
      ext_categories_ids: categoriesIds,
      amount: null
    });
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    request.error(new ErrorEvent('fail'));
  });

  it('should copy a transaction to purse', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = PeriodType.QUARTER;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.copyToPurse(bankId, clientId, accountId, transactionId)
      .subscribe(
        (data: Transaction[]) => {
          expect(data).toEqual([TRANSACTION_DATA_EXPECTED]);
        },
        error => expect(true).toBe(false)
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}/copy_to_purse`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual('');
    request.flush([TRANSACTION_DATA]);
  });


  it('should split a transaction and return splitted transaction', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = PeriodType.QUARTER;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.splitTransaction(bankId, clientId, accountId, transactionId)
      .subscribe(
        (data: Transaction[]) => {
          expect(data).toEqual([TRANSACTION_DATA_EXPECTED]);
        },
        error => expect(true).toBe(false)
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}/split`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual('');
    request.flush([TRANSACTION_DATA]);
  });

  it('should split a transaction but API returns an error', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = null;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.splitTransaction(bankId, clientId, accountId, transactionId)
      .subscribe(
        data => expect(true).toBe(false),
        error => expect(error).toBe('Unable to split transaction.')
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}/split`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual('');
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    request.flush('Invalid parameters', mockErrorResponse);
  });

  it('should split a transaction but an error occurs in client', () => {
    const bankId = 'ing';
    const clientId = 'CLIENT1';
    const accountId = 'ACCOUNT1';
    const transactionId = 'TRANSACTION1';
    const date = new Date(2020, 8, 23);
    const period = null;
    const storeId = 2;
    const budgetId = 2;
    const categoriesIds = [6, 7];

    expect(service).toBeTruthy();

    service.splitTransaction(bankId, clientId, accountId, transactionId)
      .subscribe(
        data => expect(true).toBe(false),
        error => expect(error).toBe('Unable to split transaction.')
      );

    // Expected calls
    httpMock.expectOne(`${service.API_URL}/banks`).flush(BANKS_DATA);
    httpMock.expectOne(`${service.API_URL}/budgets`).flush(BUDGETS_DATA);
    httpMock.expectOne(`${service.API_URL}/categories`).flush(CATEGORIES_DATA);
    httpMock.expectOne(`${service.API_URL}/stores`).flush(STORES_DATA);

    const request = httpMock.expectOne(`${service.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}/split`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual('');
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    request.error(new ErrorEvent('fail'));
  });


  it('should add a new store', () => {
    expect(service).toBeTruthy();

    const storeName = 'MyNewStore';

    service.addStore(storeName).subscribe(
      (data: Store) => expect(data).toEqual(new Store(1000000, storeName)),
      error => expect(true).toBe(false)
    );

    // Expect one call to add a store
    const request = httpMock.expectOne(`${service.API_URL}/stores/new`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(storeName);
    request.flush(JSON.parse('{"id":1000000,"name":"' + storeName + '"}'));
  });

  it('should add a new mapping rule', () => {
    expect(service).toBeTruthy();

    const pattern = 'PATTERN';
    const storeId = 1;
    const budgetId = 2;
    const categoriesIds = [3, 4];
    const fixDate = FixDate.PREVIOUS;
    const period = PeriodType.QUARTER;
    const body = {
      pattern,
      store_id: storeId,
      budget_id: budgetId,
      categories_ids: categoriesIds,
      fix_date: fixDate,
      period
    };

    service.addMapping(pattern, storeId, budgetId, categoriesIds, fixDate, period).subscribe(
      (data: Mapping) => expect(data).toEqual(new Mapping(pattern)),
      error => expect(true).toBe(false)
    );

    // Expect one call to add a mapping
    const request = httpMock.expectOne(`${service.API_URL}/mappings/new`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush(JSON.parse('{"id":1000000,"pattern":"PATTERN","fix_date":"previous","period":"quarter","budget_id":1,"categories_ids":[3,4],"store_id":5}'));
  });
});
