import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { TransactionComponent } from './transaction.component';
import { Transaction, TransactionType, PeriodType } from '@app/models/transaction.model';
import { Bank } from '@app/models/bank.model';
import { Budget } from '@app/models/budget.model';
import { Category } from '@app/models/category.model';
import { Store } from '@app/models/store.model';

import { BanksDataService } from '@app/services/banks-data.service';

const BUDGETS = [new Budget(1, 'Courant'), new Budget(2, 'Extra')];

const CAT_ALIMENTATION = new Category(1, 'Alimentation', null);
const CAT_SUPERMARCHE = new Category(2, 'Supermarché', CAT_ALIMENTATION);
const CATEGORIES = [CAT_ALIMENTATION, CAT_SUPERMARCHE];

const STORES = [new Store(1, 'Auchan'), new Store(2, 'Carrefour'), new Store(6, 'MONSUPERMARCHE')];

// Date month starts at 0
const transaction1 = new Transaction('T1', new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTIONID',
  new Date(2020, 0, 24), new Date(2020, 3, 24), 123.45, 'PAIEMENT PAR CARTE', TransactionType.CARD_DEBIT,
  undefined, undefined, undefined, undefined, undefined);

const transaction2 = new Transaction('T1', new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT', 'TRANSACTIONID',
  new Date(2020, 0, 24), new Date(2020, 3, 24), 123.45, 'PAIEMENT PAR CARTE', TransactionType.CARD_DEBIT,
  new Date(2020, 0, 20), PeriodType.MONTH, new Budget(1, 'Courant'), [CAT_ALIMENTATION, CAT_SUPERMARCHE], new Store(6, 'MONSUPERMARCHE'));

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let banksDataService;

  beforeEach(async () => {
    banksDataService = jasmine.createSpyObj('BanksDataService', ['updateTransaction']);

    await TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, BrowserAnimationsModule,
        MatDatepickerModule, MatInputModule, MatNativeDateModule ],
      providers: [ {provide: BanksDataService, useValue: banksDataService}, MatNativeDateModule, FormBuilder ],
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

    const formElements = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements.length).toBe(0);
  });

  it('should display a transaction without extended data, switch to edition mode and cancel', () => {
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

    // Verify that we are not in edition mode (no form)
    const formElements = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements.length).toBe(0);

    // Click on div to switch to edition mode
    const extendedInfoElements = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements.length).toBe(1);
    extendedInfoElements[0].nativeElement.click();
    fixture.detectChanges();

    // Verify that we are in edition mode
    const formElements2 = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements2.length).toBe(1);

    const extendedInfoElements2 = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements2.length).toBe(0);

    // Click on cancel
    const updateButtons = fixture.debugElement.queryAll(By.css('button[class="btn"]'));
    expect(updateButtons.length).toBe(1);
    updateButtons[0].nativeElement.click();
    fixture.detectChanges();

    // Check that data have not been updated
    const extendedInfoElements3 = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements3.length).toBe(1);
  });


  it('should display a transaction with extended data, switch to edition mode and update', () => {
    component.transaction = transaction1;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.transaction).toBe(transaction1);

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
    expect(storeElements[0].nativeElement.innerHTML).toBe('(no store)');

    const budgetElements = fixture.debugElement.queryAll(By.css('div.budget'));
    expect(budgetElements.length).toBe(1);
    expect(budgetElements[0].nativeElement.innerHTML).toBe('(no budget)');

    const categoriesElements = fixture.debugElement.queryAll(By.css('div.categories'));
    expect(categoriesElements.length).toBe(1);
    expect(categoriesElements[0].nativeElement.innerHTML).toBe('(no categories)');

    // Verify that we are not in edition mode (no form)
    const formElements = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements.length).toBe(0);

    // Click on div to switch to edition mode
    const extendedInfoElements = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements.length).toBe(1);
    extendedInfoElements[0].nativeElement.click();
    fixture.detectChanges();

    // Verify that we are in edition mode
    const formElements2 = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements2.length).toBe(1);

    const extendedInfoElements2 = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements2.length).toBe(0);

    // Update transaction info simulated call
    const updateTransactionSpy = banksDataService.updateTransaction.and.returnValue( of(transaction2) );

    // Click on update
    const updateButtons = fixture.debugElement.queryAll(By.css('button[type="submit"]'));
    expect(updateButtons.length).toBe(1);
    updateButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.transaction).toBe(transaction2);

    // Check that data have been updated
    const extendedInfoElements3 = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements3.length).toBe(1);

    const dateElements2 = fixture.debugElement.queryAll(By.css('div.accounting_date'));
    expect(dateElements2.length).toBe(1);
    expect(dateElements2[0].nativeElement.innerHTML).toBe('2020/01/24');

    const storeElements2 = fixture.debugElement.queryAll(By.css('div.store'));
    expect(storeElements2.length).toBe(1);
    expect(storeElements2[0].nativeElement.innerHTML).toBe('MONSUPERMARCHE');

    const budgetElements2 = fixture.debugElement.queryAll(By.css('div.budget'));
    expect(budgetElements2.length).toBe(1);
    expect(budgetElements2[0].nativeElement.innerHTML).toBe('Courant');

    const categoriesElements2 = fixture.debugElement.queryAll(By.css('div.categories'));
    expect(categoriesElements2.length).toBe(1);
    expect(categoriesElements2[0].nativeElement.innerText).toBe('Alimentation > Supermarché');
  });

  it('should display a transaction with extended data, switch to edition mode, patch transaction but update failed', () => {
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

    // Verify that we are not in edition mode (no form)
    const formElements = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements.length).toBe(0);

    // Click on div to switch to edition mode
    const extendedInfoElements = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements.length).toBe(1);
    extendedInfoElements[0].nativeElement.click();
    fixture.detectChanges();

    // Verify that we are in edition mode
    const formElements2 = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements2.length).toBe(1);

    const errorElement = fixture.debugElement.queryAll(By.css('div.error'));
    expect(errorElement.length).toBe(0);

    const extendedInfoElements2 = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements2.length).toBe(0);

    // Update transaction info will fail
    const updateTransactionSpy = banksDataService.updateTransaction.and.returnValue( throwError('Network error') );

    // Click on update
    const updateButtons = fixture.debugElement.queryAll(By.css('button[type="submit"]'));
    expect(updateButtons.length).toBe(1);
    updateButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.transaction).toBe(transaction2);

    // Verify that we are still in edition mode
    const formElements3 = fixture.debugElement.queryAll(By.css('form'));
    expect(formElements3.length).toBe(1);

    // Check that extended_info is not displayed
    const extendedInfoElements3 = fixture.debugElement.queryAll(By.css('div.extended_info'));
    expect(extendedInfoElements3.length).toBe(0);

    // Check error message is displayed
    const errorElement2 = fixture.debugElement.queryAll(By.css('div.error'));
    expect(errorElement2.length).toBe(1);
    expect(errorElement2[0].nativeElement.innerText).toBe('Network error');
  });

});
