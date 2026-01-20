import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { ListInvoicesComponent } from './components/view-invoices/list-invoices.component';
import { InvoiceComponent } from './invoice.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { SharedModule } from '../../shared/shared.module';
import { EditInvoiceStatusComponent } from './components/edit-invoice-status/edit-invoice-status.component';


@NgModule({
  declarations: [
    InvoiceComponent,
    CreateInvoiceComponent,
    ListInvoicesComponent,
    InvoiceDetailsComponent,
    EditInvoiceStatusComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule
  ]
})
export class InvoiceModule { }

