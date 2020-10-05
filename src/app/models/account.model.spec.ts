import { Account, AccountOwnership, AccountType } from './account.model';

describe('Account', () => {
  it('should create an instance', () => {
    const bankId = 'ing';
    const clientId = 'client';
    const accountId = 'account';
    const balance = 123.12;
    const accountNumber = 'number';
    const owner = 'owner';
    const ownership = AccountOwnership.SINGLE;
    const type = AccountType.SAVINGS;
    const name = 'name';

    const account = new Account(bankId, clientId, accountId, balance, accountNumber, owner, ownership, type, name);
    expect(account).toBeTruthy();
    expect(account.bankId).toBe(bankId);
    expect(account.clientId).toBe(clientId);
    expect(account.balance).toBe(balance);
    expect(account.accountNumber).toBe(accountNumber);
    expect(account.owner).toBe(owner);
    expect(account.ownership).toBe(ownership);
    expect(account.type).toBe(type);
    expect(account.name).toBe(name);
  });
});
