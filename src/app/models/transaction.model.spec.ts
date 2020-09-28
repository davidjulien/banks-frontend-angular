import { Transaction, TransactionType } from './transaction.model';
import { Bank } from './bank.model';

describe('Transaction', () => {
  it('should create an instance', () => {
    const id = 1;
    const bank = new Bank('ing', 'ING');
    const clientId = 'CLIENT';
    const accountId = 'ACCOUNT';
    const fetchingAt = new Date(Date.UTC(2020, 9, 24, 12, 0, 0));
    const transactionId = 'TRANSACTIONID';
    const accountingDate = new Date(Date.UTC(2020, 9, 24));
    const effectiveDate = accountingDate;
    const amount = 2000.00;
    const description = 'PAIEMENT PAR CARTE';
    const transactionType = TransactionType.SEPA_DEBIT;
    const transaction = new Transaction(id, bank, clientId, accountId, fetchingAt, transactionId,
      accountingDate, effectiveDate, amount, description, transactionType);
    expect(transaction).toBeTruthy();
    expect(transaction.bank).toBe(bank);
    expect(transaction.amount).toBe(amount);
    expect(transaction.description).toBe(description);
  });
});
