import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInvoicesComponent } from './view-invoices/list-invoices.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

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
