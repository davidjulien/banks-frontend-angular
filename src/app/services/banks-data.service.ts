import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, throwError } from 'rxjs';
import { map, first, tap, catchError } from 'rxjs/operators';

import { Transaction, PeriodType, TransactionAdapter } from '@app/models/transaction.model';
import { TransactionsPage, TransactionsPageAdapter } from '@app/models/transactions-page.model';
import { Bank, BankAdapter } from '@app/models/bank.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { Store } from '@app/models/store.model';
import { Account, AccountAdapter } from '@app/models/account.model';
import { Mapping, FixDate } from '@app/models/mapping.model';

@Injectable({
  providedIn: 'root'
})
export class BanksDataService {
  public readonly API_URL: string = '/api/1.0';

  constructor(
    private datepipe: DatePipe,
    private http: HttpClient,
    private bankAdapter: BankAdapter,
    private accountAdapter: AccountAdapter,
    private transactionAdapter: TransactionAdapter,
    private transactionsPageAdapter: TransactionsPageAdapter) { }

  getTransactionsPage(cursor: string, limit: number): Observable<TransactionsPage> {
    const cursorExtension = cursor === null ? '' : `?cursor=${cursor}`;
    const limitExtension = cursor === null ? `?limit=${limit}` : `&limit=${limit}`;
    return forkJoin([
      this.getBanks(),
      this.getBudgets(),
      this.getCategories(),
      this.getStores(),
      this.http.get(`${this.API_URL}/transactions${cursorExtension}${limitExtension}`)
    ]).pipe(
      map(([allBanks, allBudgets, allCategories, allStores, transactions]) => {
        return this.transactionsPageAdapter.adapt(transactions, allBanks, allBudgets, allCategories, allStores); } )
    );
  }

  getBanks(): Observable<Bank[]> {
    return this.http.get(`${this.API_URL}/banks`).pipe(
      map((banksData: any[]) =>
        banksData.map((subData: any) => this.bankAdapter.adapt(subData))
      ));
  }

  getBudgets(): Observable<Budget[]> {
    return this.http.get(`${this.API_URL}/budgets`).pipe(
      map((budgetsData: any[]) =>
        budgetsData.map((subData: any) => new Budget(subData.id, subData.name))
      ));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get(`${this.API_URL}/categories`).pipe(
      map((categoriesData: any[]) =>
        categoriesData.reduce((acc: Category[], subData: any) => {
          if (subData.up_category_id) {
            const upCategory: Category = acc.find((elt) => elt.id === subData.up_category_id);
            const category = new Category(subData.id, subData.name, upCategory);
            acc.push(category);
          } else {
            const category = new Category(subData.id, subData.name, null);
            acc.push(category);
          }
          return acc;
        }, [])));
  }

  getStores(): Observable<Store[]> {
    return this.http.get(`${this.API_URL}/stores`).pipe(
      map((storesData: any[]) =>
        storesData.map((subData: any) => new Store(subData.id, subData.name))
      ));
  }

  addStore(storeName: string): Observable<Store | string> {
    const body = storeName;
    return this.http.post(`${this.API_URL}/stores/new`, body).pipe(
      map((data: any) => new Store(data.id, data.name)),
      catchError((error) => this.handleError(error, 'Unable to add store.'))
    );
  }

  getAccounts(): Observable<Account[]> {
    return forkJoin([
      this.getBanks(),
      this.http.get(`${this.API_URL}/accounts`)
    ]).pipe(
      map(([allBanks, items]) =>
        (items as any[]).map((subItem: any) => this.accountAdapter.adapt(subItem, allBanks)) ) // Adapt api result to our data model
    );
  }

  updateTransaction(bankId: string, clientId: string, accountId: string, transactionId: string,
                    date: Date, period: string, storeId: number, budgetId: number,
                    categoriesIds: number[], amount: number): Observable<Transaction | string> {
    const body = {
      ext_date: this.datepipe.transform(date, 'yyyy-MM-dd'),
      ext_period: period == null ? null : period,
      ext_store_id: storeId,
      ext_budget_id: budgetId,
      ext_categories_ids: categoriesIds,
      amount
    };
    return forkJoin([
      this.getBanks(),
      this.getBudgets(),
      this.getCategories(),
      this.getStores(),
      this.http.patch(`${this.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}`, body)
    ]).pipe(
      map(([allBanks, allBudgets, allCategories, allStores, transaction]) =>
        this.transactionAdapter.adapt(transaction, allBanks, allBudgets, allCategories, allStores) ),
      catchError((error) => this.handleError(error, 'Unable to update transaction info.'))
    );
  }

  splitTransaction(bankId: string, clientId: string, accountId: string, transactionId: string): Observable<Transaction[] | string> {
    return forkJoin([
      this.getBanks(),
      this.getBudgets(),
      this.getCategories(),
      this.getStores(),
      this.http.post(`${this.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}/split`, '')
    ]).pipe(
      map(([allBanks, allBudgets, allCategories, allStores, transactions]) =>
        (transactions as any[]).map((tr: any) => this.transactionAdapter.adapt(tr, allBanks, allBudgets, allCategories, allStores))
      ),
      catchError((error) => this.handleError(error, 'Unable to split transaction.'))
    );
  }

  copyToPurse(bankId: string, clientId: string, accountId: string, transactionId: string): Observable<Transaction[] | string> {
    return forkJoin([
      this.getBanks(),
      this.getBudgets(),
      this.getCategories(),
      this.getStores(),
      this.http.post(`${this.API_URL}/transactions/${bankId}/${clientId}/${accountId}/${transactionId}/copy_to_purse`, '')
    ]).pipe(
      map(([allBanks, allBudgets, allCategories, allStores, transactions]) =>
        (transactions as any[]).map((tr: any) => this.transactionAdapter.adapt(tr, allBanks, allBudgets, allCategories, allStores))
      ),
      catchError((error) => this.handleError(error, 'Unable to copy transaction to purse.'))
    );
  }

  addMapping(pattern: string, storeId: number, budgetId: number, categoriesIds: number[], fixDate: FixDate, period: PeriodType): Observable<Mapping | string> {
    const body = {
      pattern,
      store_id: storeId,
      budget_id: budgetId,
      categories_ids: categoriesIds,
      fix_date: fixDate,
      period
    };
    return this.http.post(`${this.API_URL}/mappings/new`, body).pipe(
      map((data: any) => new Mapping(data.pattern),
      catchError((error) => this.handleError(error, 'Unable to add mapping.'))
    ));
  }

  private handleError(error: HttpErrorResponse, message: string): Observable<string> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(message);
  }
}
