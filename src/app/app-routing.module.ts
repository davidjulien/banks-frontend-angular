import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsListComponent } from '@app/components/transactions-list/transactions-list.component';
import { AppComponent } from '@app/app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
