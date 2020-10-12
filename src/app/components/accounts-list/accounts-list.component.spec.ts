import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { AccountsListComponent } from './accounts-list.component';
import { AccountComponent } from '@app/components/account/account.component';
import { Bank } from '@app/models/bank.model';
import { Account } from '@app/models/account.model';

import { BanksDataService } from '@app/services/banks-data.service';

const ACCOUNTS_1 = [
];

describe('AccountsListComponent', () => {
  let banksDataService;
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;
  let getAccountsSpy;

  beforeEach(async () => {
    banksDataService = jasmine.createSpyObj('BanksDataService', ['getAccounts']);
    await TestBed.configureTestingModule({
      declarations: [ AccountsListComponent, AccountComponent ],
      providers: [{provide: BanksDataService, useValue: banksDataService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    getAccountsSpy = banksDataService.getAccounts.and.returnValue( of(ACCOUNTS_1) );

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getAccountsSpy).toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    // Verify display
    const accountsElements = fixture.debugElement.queryAll(By.css('app-account'));
    expect(accountsElements.length).toBe(ACCOUNTS_1.length);
  }));
});
