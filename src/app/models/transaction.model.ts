import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { Bank } from './bank.model';
import { Budget } from './budget.model';
import { Category } from './category.model';
import { Store } from './store.model';

export enum TransactionType {
  CARD_DEBIT = 0,
    CARD_WITHDRAWAL,
    CHECK,
    SEPA_DEBIT,
    TRANSFER,
    INTERESTS,
    BANKS_FEES,
    OTHER
}

export enum PeriodType {
  NONE = 0,
    BIMESTER,
    QUARTER,
    SEMESTER,
    ANNUAL
}

export class Transaction {
  constructor(
    public readonly id: number,
    public readonly bank: Bank,
    public readonly clientId: string,
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly accountingDate: Date,
    public readonly effectiveDate: Date,
    public readonly amount: number,
    public readonly description: string,
    public readonly transactionType: TransactionType,
    public readonly date: Date,
    public readonly period: PeriodType,
    public readonly budget: Budget,
    public readonly categories: Category[],
    public readonly store: Store) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionAdapter {
  constructor() { }

  adapt(item: any, allBanks: Bank[], allBudgets: Budget[], allCategories: Category[], allStores: Store[]): Transaction {
    const bank: Bank = allBanks.find((aBank) => aBank.id === item.bank_id);
    const budget: Budget = allBudgets.find((aBudget) => aBudget.id === item.ext_budget_id);
    const categories: Category[] = item.ext_categories_id === null || item.ext_categories_id === undefined ? undefined :
      item.ext_categories_id.map((categoryId) => allCategories.find((aCategory) => aCategory.id === categoryId));
    const store: Store = allStores.find((aStore) => aStore.id === item.ext_store_id);
    const period: PeriodType = item.ext_period === null || item.ext_period === undefined ?
      PeriodType.NONE : PeriodType[item.ext_period.toUpperCase() as keyof typeof PeriodType];
    return new Transaction(item.id, bank, item.client_id, item.account_id,
      item.transaction_id, new Date(item.accounting_date), new Date(item.effective_date),
      item.amount, item.description, TransactionType[item.type.toUpperCase() as keyof typeof TransactionType],
      item.ext_date === null || item.ext_date === undefined ? undefined : new Date(item.ext_date),
      period, budget, categories, store);
  }
}
