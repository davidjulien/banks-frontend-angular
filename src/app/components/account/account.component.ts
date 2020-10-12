import { Component, OnInit, Input } from '@angular/core';
import { Account } from 'app/models/account.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  pAccount: Account;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set account(account: Account) {
    this.pAccount = account;
  }
  get account(): Account {
    return this.pAccount;
  }
}
