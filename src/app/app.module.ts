import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionComponent } from '@app/components/transaction/transaction.component';
import { TransactionsListComponent } from '@app/components/transactions-list/transactions-list.component';
import { AccountComponent } from '@app/components/account/account.component';
import { AccountsListComponent } from '@app/components/accounts-list/accounts-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    TransactionsListComponent,
    AccountComponent,
    AccountsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
