import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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

  getTransactionsPage(): Observable<TransactionsPage> {
    return forkJoin(
      this.getBanks(),
      this.http.get<TransactionsPage>(`${this.API_URL}/transactions`)
    ).pipe(map(([allBanks, transactions]) =>
      this.transactionAdapter.adapt(transactions, allBanks) ) // Adapt api result to our data model
    );
  }

  getBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.API_URL}/banks`).pipe(
      map((item: any[]) => item.map((subItem: any) => this.bankAdapter.adapt(subItem)) ) // Adapt api result to our data model
    );
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.API_URL}/accounts`).pipe(
      map((item: any[]) => item.map((subItem: any) => this.accountAdapter.adapt(subItem)) ) // Adapt api result to our data model
    );
  }

}
