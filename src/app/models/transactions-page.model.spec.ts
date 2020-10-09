import { Transaction } from './transaction.model';
import { TransactionsPage } from './transactions-page.model';

describe('TransactionsPage', () => {
  it('should create an instance', () => {
    const transactions: Transaction[] = [];
    const nextCursor = 'next-cursor';
    const total = 5;

    const page: TransactionsPage = new TransactionsPage(transactions, nextCursor, total);
    expect(page).toBeTruthy();
    expect(page.data).toEqual(transactions);
    expect(page.nextCursor).toEqual(nextCursor);
    expect(page.total).toEqual(total);
  });
});
