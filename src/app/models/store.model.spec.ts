import { Store } from './store.model';

describe('Store', () => {
  it('should create an instance', () => {
    const id = 1;
    const name = 'SUPERMARCHE';
    const store = new Store(id, name);
    expect(store).toBeTruthy();
    expect(store.id).toBe(id);
    expect(store.name).toBe(name);
  });
});
