import { TransactionsPage } from './transactions-page.model';

describe('TransactionsPage', () => {
  it('should create an instance', () => {
    const page: TransactionsPage = new TransactionsPage([]);
    expect(page).toBeTruthy();
    expect(page.transactions).toEqual([]);
  });
});
