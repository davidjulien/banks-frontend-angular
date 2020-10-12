import { Account, AccountOwnership, AccountType } from './account.model';
import { Bank } from '@app/models/bank.model';

describe('Account', () => {
  it('should create an instance', () => {
    const bank: Bank = new Bank('ing', 'ING');
    const clientId = 'client';
    const accountId = 'account';
    const balance = 123.12;
    const accountNumber = 'number';
    const owner = 'owner';
    const ownership = AccountOwnership.SINGLE;
    const type = AccountType.SAVINGS;
    const name = 'name';

    const account = new Account(bank, clientId, accountId, balance, accountNumber, owner, ownership, type, name);
    expect(account).toBeTruthy();
    expect(account.bank).toBe(bank);
    expect(account.clientId).toBe(clientId);
    expect(account.balance).toBe(balance);
    expect(account.accountNumber).toBe(accountNumber);
    expect(account.owner).toBe(owner);
    expect(account.ownership).toBe(ownership);
    expect(account.type).toBe(type);
    expect(account.name).toBe(name);
  });
});
