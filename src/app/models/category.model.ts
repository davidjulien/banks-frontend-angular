export class Category {
  readonly level: number;
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly upCategory: Category) {
    if (this.upCategory) {
      this.level = 1 + this.upCategory.level;
    } else {
      this.level = 1;
    }
  }

  compareTo(category: Category): number {
    if (this === category) {
      return 0;
    } else if (this.level < category.level) {
      const up = this.compareTo(category.upCategory);
      if (up === 0) {
        return -1;
      } else {
        return up;
      }
    } else if (this.level > category.level) {
      return - category.compareTo(this);
    } else if (this.upCategory === null) {
      return this.name.localeCompare(category.name);
    } else if (this.upCategory.id === category.upCategory.id) {
      return this.name.localeCompare(category.name);
    } else {
      return this.upCategory.compareTo(category.upCategory);
    }
  }
}
