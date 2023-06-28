import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ListInvoicesComponent } from './view-invoices/list-invoices.component';
import { InvoiceComponent } from './invoice.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { SharedModule } from '../../shared/shared.module';
import { IntlTelInputNgModule } from 'intl-tel-input-ng';
import { EditInvoiceStatusComponent } from './edit-invoice-status/edit-invoice-status.component';


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
