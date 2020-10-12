import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AccountComponent } from './account.component';
import { Account, AccountType, AccountOwnership } from '@app/models/account.model';
import { Bank } from '@app/models/bank.model';

const account1 = new Account(new Bank('ing', 'ING'), 'CLIENT', 'ACCOUNT1', 1234.56, 'NUMBER', 'OWNER',
  AccountOwnership.SINGLE, AccountType.CURRENT, 'Compte courant');

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.account = account1;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.account).toBe(account1);

    const nameElements = fixture.debugElement.queryAll(By.css('div.name'));
    expect(nameElements.length).toBe(1);
    expect(nameElements[0].nativeElement.innerHTML).toBe('ING / Compte courant');

    const balanceElements = fixture.debugElement.queryAll(By.css('div.balance'));
    expect(balanceElements.length).toBe(1);
    expect(balanceElements[0].nativeElement.innerHTML).toBe('1234.56 €');
  });
});
