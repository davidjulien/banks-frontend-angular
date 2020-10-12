import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Account } from '@app/models/account.model';
import { BanksDataService } from '@app/services/banks-data.service';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {
  accounts$: Observable<Account[]>;

  constructor(private banksDataService: BanksDataService) { }

  ngOnInit(): void {
    this.accounts$ = this.banksDataService.getAccounts();
  }
}
