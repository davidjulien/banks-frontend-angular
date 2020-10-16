import { Category } from './category.model';

describe('Category', () => {
  it('should create an instance', () => {
    const id1 = 1;
    const name1 = 'Alimentation';
    const category1 = new Category(id1, name1, null);
    expect(category1).toBeTruthy();
    expect(category1.id).toBe(id1);
    expect(category1.name).toBe(name1);
    expect(category1.upCategory).toBe(null);

    const id2 = 2;
    const name2 = 'Supermarché';
    const category2 = new Category(id2, name2, category1);
    expect(category2).toBeTruthy();
    expect(category2.id).toBe(id2);
    expect(category2.name).toBe(name2);
    expect(category2.upCategory).toBe(category1);
  });
});
