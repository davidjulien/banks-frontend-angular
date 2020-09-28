import { Bank } from './bank.model';

describe('Bank', () => {
  it('should create an instance', () => {
    const id = 'ing';
    const name = 'ING';
    const bank = new Bank(id, name);

    expect(bank).toBeTruthy();
    expect(bank.id).toBe(id);
    expect(bank.name).toBe(name);
  });
});
