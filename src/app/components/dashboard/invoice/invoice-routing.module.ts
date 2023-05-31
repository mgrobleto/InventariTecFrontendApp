import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';

const routes: Routes = [
  {
    path: 'createNewInvoice',
    component: CreateInvoiceComponent,
  },
  {
    path: 'allInvoices',
    component: ListInvoicesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
