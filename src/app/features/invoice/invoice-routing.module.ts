import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInvoicesComponent } from './components/view-invoices/list-invoices.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';

const routes: Routes = [
  {
    path: 'createNewInvoice',
    component: CreateInvoiceComponent,
  },
  {
    path: 'createQuote',
    component: CreateInvoiceComponent,
    data: { mode: 'quote' }
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

