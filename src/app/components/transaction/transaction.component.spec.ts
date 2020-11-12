import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TransactionComponent } from './transaction.component';
import { Transaction, TransactionType, PeriodType } from '@app/models/transaction.model';
import { Bank } from '@app/models/bank.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { Store } from '@app/models/store.model';

const BUDGETS = [new Budget(1, 'Courant'), new Budget(2, 'Extra')];

const CAT_ALIMENTATION = new Category(1, 'Alimentation', null);
const CAT_SUPERMARCHE = new Category(2, 'Supermarché', CAT_ALIMENTATION);
const CATEGORIES = [CAT_ALIMENTATION, CAT_SUPERMARCHE];

const STORES = [new Store(1, 'Auchan'), new Store(2, 'Carrefour'), new Store(6, 'MONSUPERMARCHE')];

// Date month starts at 0
const transaction1 = new Transaction(1, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTIONID',
  new Date(2020, 0, 24), new Date(2020, 3, 24), 123.45, 'PAIEMENT PAR CARTE', TransactionType.CARD_DEBIT,
  undefined, PeriodType.NONE, undefined, undefined, undefined);

const transaction2 = new Transaction(1, new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTIONID',
  new Date(2020, 0, 24), new Date(2020, 3, 24), 123.45, 'PAIEMENT PAR CARTE', TransactionType.CARD_DEBIT,
  new Date(2020, 0, 20), PeriodType.NONE, new Budget(1, 'Courant'), [CAT_ALIMENTATION, CAT_SUPERMARCHE], new Store(6, 'MONSUPERMARCHE'));

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatSelectModule, MatFormFieldModule, BrowserAnimationsModule,
        MatDatepickerModule, MatNativeDateModule ],
      providers: [ MatNativeDateModule ],
      declarations: [ TransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
  });

  it('should display a transaction without extended data', () => {
    component.transaction = transaction1;
    component.budgets$ = of(BUDGETS);
    component.categories$ = of(CATEGORIES);
    component.stores$ = of(STORES);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.transaction).toBe(transaction1);

    const amountElements = fixture.debugElement.queryAll(By.css('div.amount'));
    expect(amountElements.length).toBe(1);
    expect(amountElements[0].nativeElement.innerHTML).toBe('123.45 €');

    const descriptionElements = fixture.debugElement.queryAll(By.css('div.description'));
    expect(descriptionElements.length).toBe(1);
    expect(descriptionElements[0].nativeElement.innerHTML).toBe(transaction1.description);

    const dateElements = fixture.debugElement.queryAll(By.css('div.accounting_date'));
    expect(dateElements.length).toBe(1);
    expect(dateElements[0].nativeElement.innerHTML).toBe('2020/01/24');

    const storeElements = fixture.debugElement.queryAll(By.css('div.store'));
    expect(storeElements.length).toBe(1);
    expect(storeElements[0].nativeElement.innerHTML).toBe('(no store)');

    const budgetElements = fixture.debugElement.queryAll(By.css('div.budget'));
    expect(budgetElements.length).toBe(1);
    expect(budgetElements[0].nativeElement.innerHTML).toBe('(no budget)');

    const categoriesElements = fixture.debugElement.queryAll(By.css('div.categories'));
    expect(categoriesElements.length).toBe(1);
    expect(categoriesElements[0].nativeElement.innerHTML).toBe('(no categories)');
  });

  it('should display a transaction with extended data', () => {
    component.transaction = transaction2;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.transaction).toBe(transaction2);

    const amountElements = fixture.debugElement.queryAll(By.css('div.amount'));
    expect(amountElements.length).toBe(1);
    expect(amountElements[0].nativeElement.innerHTML).toBe('123.45 €');

    const descriptionElements = fixture.debugElement.queryAll(By.css('div.description'));
    expect(descriptionElements.length).toBe(1);
    expect(descriptionElements[0].nativeElement.innerHTML).toBe(transaction2.description);

    const dateElements = fixture.debugElement.queryAll(By.css('div.accounting_date'));
    expect(dateElements.length).toBe(1);
    expect(dateElements[0].nativeElement.innerHTML).toBe('2020/01/24');

    const storeElements = fixture.debugElement.queryAll(By.css('div.store'));
    expect(storeElements.length).toBe(1);
    expect(storeElements[0].nativeElement.innerHTML).toBe('MONSUPERMARCHE');

    const budgetElements = fixture.debugElement.queryAll(By.css('div.budget'));
    expect(budgetElements.length).toBe(1);
    expect(budgetElements[0].nativeElement.innerHTML).toBe('Courant');

    const categoriesElements = fixture.debugElement.queryAll(By.css('div.categories'));
    expect(categoriesElements.length).toBe(1);
    expect(categoriesElements[0].nativeElement.innerText).toBe('Alimentation > Supermarché');
  });
});
