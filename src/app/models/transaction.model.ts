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
  MONTH = 'month',
    BIMESTER = 'bimester',
    QUARTER = 'quarter',
    SEMESTER = 'semester',
    ANNUAL = 'annual'
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly bank: Bank,
    public readonly clientId: string,
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly accountingDate: Date,
    public readonly effectiveDate: Date,
    public readonly amount: number,
    public readonly description: string,
    public readonly transactionType: TransactionType,
    public readonly mappingId: number,
    public readonly date: Date,
    public readonly period: PeriodType,
    public readonly budget: Budget,
    public readonly categories: Category[],
    public readonly store: Store,
    public readonly splitted: boolean,
    public readonly splitOfId: string,
    public readonly toPurse: boolean
  ) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionAdapter {
  constructor() { }

  adapt(item: any, allBanks: Bank[], allBudgets: Budget[], allCategories: Category[], allStores: Store[]): Transaction {
    const bank: Bank = allBanks.find((aBank) => aBank.id === item.bank_id);
    const budget: Budget = item.ext_budget_id === null ? null : allBudgets.find((aBudget) => aBudget.id === item.ext_budget_id);
    const categories: Category[] = item.ext_categories_ids === null
      ? null : item.ext_categories_ids.map((categoryId) => allCategories.find((aCategory) => aCategory.id === categoryId));
    const store: Store = item.ext_store_id === null ? null : allStores.find((aStore) => aStore.id === item.ext_store_id);
    const period: PeriodType = item.ext_period === null ? null : PeriodType[item.ext_period.toUpperCase() as keyof typeof PeriodType];
    const splitOfId = item.ext_split_of_id === null ? null : item.ext_split_of_id;
    return new Transaction(item.id, bank, item.client_id, item.account_id,
      item.transaction_id, new Date(item.accounting_date), new Date(item.effective_date),
      item.amount, item.description, TransactionType[item.type.toUpperCase() as keyof typeof TransactionType],
      item.ext_mapping_id, item.ext_date === null ? null : new Date(item.ext_date),
      period, budget, categories, store, item.ext_splitted, splitOfId, item.ext_to_purse);
  }
}
