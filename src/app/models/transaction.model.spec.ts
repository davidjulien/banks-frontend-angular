import { Transaction, TransactionType, PeriodType } from './transaction.model';
import { Bank } from './bank.model';
import { Budget } from './budget.model';
import { Category } from './category.model';
import { Store } from './store.model';

describe('Transaction', () => {
  it('should create an instance', () => {
    const id = '1';
    const bank: Bank = new Bank('ing', 'ING');
    const clientId = 'CLIENT';
    const accountId = 'ACCOUNT';
    const transactionId = 'TRANSACTIONID';
    const accountingDate = new Date(Date.UTC(2020, 9, 24));
    const effectiveDate = accountingDate;
    const amount = 2000.00;
    const description = 'PAIEMENT PAR CARTE';
    const transactionType = TransactionType.SEPA_DEBIT;
    const mappingId = 5;
    const date = new Date(Date.UTC(2020, 9, 22));
    const period = PeriodType.MONTH;
    const budget = new Budget(2, 'Courant');
    const categories = [new Category(1, 'Alimentation', null)];
    const store = new Store(1, 'SUPERMARCHE');
    const splitted = false;
    const splitOfId = null;
    const transaction = new Transaction(id, bank, clientId, accountId, transactionId,
      accountingDate, effectiveDate, amount, description, transactionType,
      mappingId, date, period, budget, categories, store, splitted, splitOfId
    );
    expect(transaction).toBeTruthy();
    expect(transaction.bank).toBe(bank);
    expect(transaction.amount).toBe(amount);
    expect(transaction.description).toBe(description);
  });
});
