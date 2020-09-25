import { Bank } from './bank.model';

describe('Bank', () => {
  it('should create an instance', () => {
    const id: string = "ing";
    const name: string = "ING";
    const bank: Bank = new Bank(id, name);

    expect(bank).toBeTruthy();
    expect(bank.id).toBe(id);
    expect(bank.name).toBe(name);
  });
});
