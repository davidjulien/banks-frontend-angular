import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

import { Transaction, TransactionAdapter } from '../models/transaction.model';
import { TransactionsPage, TransactionsPageAdapter } from '../models/transactions-page.model';

@Injectable({
  providedIn: 'root'
})
export class BanksDataService {
  public readonly API_URL: string = '/api';

  constructor(private http: HttpClient, private adapter: TransactionsPageAdapter) { }

  getTransactionsPage(): Observable<TransactionsPage> {
    return this.http.get<TransactionsPage>(`${this.API_URL}/transactions.json`).pipe(
      map((item : any) => this.adapter.adapt(item) ) // Adapt api result to our data model
    );
  }
}
