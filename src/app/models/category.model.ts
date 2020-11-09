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
}
