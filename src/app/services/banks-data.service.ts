import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';

import { Transaction, TransactionAdapter } from '@app/models/transaction.model';
import { TransactionsPage, TransactionsPageAdapter } from '@app/models/transactions-page.model';
import { Bank, BankAdapter } from '@app/models/bank.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { Store } from '@app/models/store.model';
import { Account, AccountAdapter } from '@app/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class BanksDataService {
  public readonly API_URL: string = '/api/1.0';

  constructor(
    private http: HttpClient,
    private bankAdapter: BankAdapter,
    private accountAdapter: AccountAdapter,
    private transactionAdapter: TransactionsPageAdapter) { }

  getTransactionsPage(cursor: string, limit: number): Observable<TransactionsPage> {
    const cursorExtension = cursor === null ? '' : `/${cursor}`;
    return forkJoin([
      this.getBanks(),
      this.getBudgets(),
      this.getCategories(),
      this.getStores(),
      this.http.get(`${this.API_URL}/transactions${cursorExtension}?limit=${limit}`)
    ]).pipe(
      map(([allBanks, allBudgets, allCategories, allStores, transactions]) => {
        return this.transactionAdapter.adapt(transactions, allBanks, allBudgets, allCategories, allStores); } )
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

  getAccounts(): Observable<Account[]> {
    return forkJoin([
      this.getBanks(),
      this.http.get(`${this.API_URL}/accounts`)
    ]).pipe(
      map(([allBanks, items]) =>
        (items as any[]).map((subItem: any) => this.accountAdapter.adapt(subItem, allBanks)) ) // Adapt api result to our data model
    );
  }
}
