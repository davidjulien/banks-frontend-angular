import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';

export enum AccountOwnership {
  SINGLE = 0,
    JOINT
}

export enum AccountType {
  CURRENT = 0,
    SAVINGS,
    HOME_LOAN
}

export class Account {
  constructor(
    public readonly bankId: string,
    public readonly clientId: string,
    public readonly accountId: string,
    public readonly balance: number,
    public readonly accountNumber: string,
    public readonly owner: string,
    public readonly ownership: AccountOwnership,
    public readonly type: AccountType,
    public readonly name: string) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class AccountAdapter implements Adapter<Account> {
  adapt(item: any): Account {
    return new Account(item.bank_id, item.client_id, item.id, item.balance, item.number, item.owner,
      AccountOwnership[item.ownership.toUpperCase() as keyof typeof AccountOwnership],
      AccountType[item.type.toUpperCase() as keyof typeof AccountType],
      item.name);
  }
}
