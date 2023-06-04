import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ListInvoicesComponent } from './view-invoices/list-invoices.component';
import { InvoiceComponent } from './invoice.component';


@NgModule({
  declarations: [
    InvoiceComponent,
    CreateInvoiceComponent,
    ListInvoicesComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
