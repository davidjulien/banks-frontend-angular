import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TransactionComponent } from './transaction.component';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { Bank } from '@app/models/bank.model';

// Date month starts at 0
const transaction1 = new Transaction(1, 'ing', 'CLIENT', 'ACCOUNT', 'TRANSACTIONID',
  new Date(2020, 0, 24), new Date(2020, 3, 24), 123.45, 'PAIEMENT PAR CARTE', TransactionType.CARD_DEBIT);

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.transaction = transaction1;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.transaction).toBe(transaction1);

    const amountElements = fixture.debugElement.queryAll(By.css('div.amount'));
    expect(amountElements.length).toBe(1);
    expect(amountElements[0].nativeElement.innerHTML).toBe('123.45 €');

    const descriptionElements = fixture.debugElement.queryAll(By.css('div.description'));
    expect(descriptionElements.length).toBe(1);
    expect(descriptionElements[0].nativeElement.innerHTML).toBe(transaction1.description);

    const dateElements = fixture.debugElement.queryAll(By.css('div.date'));
    expect(dateElements.length).toBe(1);
    expect(dateElements[0].nativeElement.innerHTML).toBe('2020/01/24');
  });
});
