import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';

import { Transaction, TransactionAdapter } from '../models/transaction.model';
import { TransactionsPage, TransactionsPageAdapter } from '../models/transactions-page.model';
import { Bank, BankAdapter } from '../models/bank.model';
import { Account, AccountAdapter } from '../models/account.model';

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
      this.http.get(`${this.API_URL}/transactions${cursorExtension}?limit=${limit}`)
    ]).pipe(
      map(([allBanks, transactions]) => {
        return this.transactionAdapter.adapt(transactions, allBanks); } ) // Adapt api result to our data model
    );
  }

  getBanks(): Observable<Bank[]> {
    return this.http.get(`${this.API_URL}/banks`).pipe(
      map((banksData: any[]) =>
        banksData.map((subData: any) => this.bankAdapter.adapt(subData))
      ));
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get(`${this.API_URL}/accounts`).pipe(
      map((item: any[]) => item.map((subItem: any) => this.accountAdapter.adapt(subItem)) ) // Adapt api result to our data model
    );
  }
}
