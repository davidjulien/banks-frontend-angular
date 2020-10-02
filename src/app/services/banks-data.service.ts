import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Transaction, TransactionAdapter } from '../models/transaction.model';
import { TransactionsPage, TransactionsPageAdapter } from '../models/transactions-page.model';
import { Bank, BankAdapter } from '../models/bank.model';

@Injectable({
  providedIn: 'root'
})
export class BanksDataService {
  public readonly API_URL: string = '/api/1.0';

  constructor(private http: HttpClient, private bankAdapter: BankAdapter, private adapter: TransactionsPageAdapter) { }

  getTransactionsPage(): Observable<TransactionsPage> {
    return this.http.get<TransactionsPage>(`${this.API_URL}/transactions`).pipe(
      map((item: any) => this.adapter.adapt(item) ) // Adapt api result to our data model
    );
  }

  getBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.API_URL}/banks`).pipe(
      map((item: any[]) => item.map((subItem: any) => this.bankAdapter.adapt(subItem)) ) // Adapt api result to our data model
    );
  }

}
