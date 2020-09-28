import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '@app/models/transaction.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  pTransaction: Transaction;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set transaction(transaction: Transaction) {
    this.pTransaction = transaction;
  }
  get transaction(): Transaction {
    return this.pTransaction;
  }
}
