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
    expect(category1.level).toBe(1);

    const id2 = 2;
    const name2 = 'Supermarché';
    const category2 = new Category(id2, name2, category1);
    expect(category2).toBeTruthy();
    expect(category2.id).toBe(id2);
    expect(category2.name).toBe(name2);
    expect(category2.upCategory).toBe(category1);
    expect(category2.level).toBe(2);
  });

  it('should order categories correctly', () => {
    const id1 = 1;
    const name1 = 'Alimentation';
    const category1 = new Category(id1, name1, null);

    const id2 = 2;
    const name2 = 'Un supermarché';
    const category2 = new Category(id2, name2, category1);

    const id3 = 3;
    const name3 = 'Logement';
    const category3 = new Category(id3, name3, null);

    const id4 = 4;
    const name4 = 'Taxes';
    const category4 = new Category(id4, name4, category3);

    const id5 = 5;
    const name5 = 'Taxe habitation';
    const category5 = new Category(id5, name5, category4);

    const id6 = 6;
    const name6 = 'Taxe foncière';
    const category6 = new Category(id6, name6, category4);

    expect(category1.compareTo(category1)).toBe(0);
    expect(category1.compareTo(category2)).toBe(-1);
    expect(category2.compareTo(category1)).toBe(1);

    expect(category1.compareTo(category3)).toBe(-1);
    expect(category3.compareTo(category1)).toBe(1);

    expect(category2.compareTo(category3)).toBe(-1);
    expect(category3.compareTo(category2)).toBe(1);

    expect(category4.compareTo(category3)).toBe(1);
    expect(category4.compareTo(category5)).toBe(-1);
    expect(category5.compareTo(category4)).toBe(1);

    expect(category2.compareTo(category5)).toBe(-1);
    expect(category5.compareTo(category2)).toBe(1);

    expect(category5.compareTo(category6)).toBe(1);
    expect(category6.compareTo(category5)).toBe(-1);
  });

});
