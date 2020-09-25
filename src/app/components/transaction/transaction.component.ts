import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '@app/models/transaction.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  _transaction: Transaction;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set transaction(transaction: Transaction) {
    this._transaction = transaction;
  }
  get transaction(): Transaction {
    return this._transaction;
  }
}
