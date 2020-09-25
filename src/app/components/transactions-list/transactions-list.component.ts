import { Component, OnInit } from '@angular/core';
import { Transaction } from '@app/models/transaction.model';
import { TransactionsPage } from '@app/models/transactions-page.model';
import { BanksDataService } from '@app/services/banks-data.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  public transactions: Transaction[];

  constructor(private banksDataService: BanksDataService) { 
    this.transactions = [];
  }

  ngOnInit(): void {
    this.banksDataService.getTransactionsPage().subscribe((transactionsPage: TransactionsPage) => {
      this.transactions = this.transactions.concat(transactionsPage.transactions);
    });
  }

}
