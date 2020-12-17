import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionComponent } from '@app/components/transaction/transaction.component';
import { TransactionsListComponent } from '@app/components/transactions-list/transactions-list.component';
import { AccountComponent } from '@app/components/account/account.component';
import { AccountsListComponent } from '@app/components/accounts-list/accounts-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';




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
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  providers: [MatNativeDateModule, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
