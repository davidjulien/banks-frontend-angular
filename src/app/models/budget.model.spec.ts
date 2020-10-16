import { Budget } from './budget.model';

describe('Budget', () => {
  it('should create an instance', () => {
    const id = 1;
    const name = 'Courant';
    const budget = new Budget(id, name);

    expect(budget).toBeTruthy();
    expect(budget.id).toBe(id);
    expect(budget.name).toBe(name);
  });
});
