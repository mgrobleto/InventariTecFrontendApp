import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { BodyComponent } from './body/body.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { SublevelMenuComponent } from './sidebar/sub-level.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule , SPINNER} from 'ngx-ui-loader';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { AddEditCategoryFormComponent } from './manage-categories/add-edit-category-form/add-edit-category-form.component';
import { AddEditEquipmentFormComponent } from './equipment/add-edit-equipment-form/add-edit-equipment-form.component';
import { AddEditFormComponent } from './products/add-edit-form/add-edit-form.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { CustomersComponent } from './customers/customers.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { IntlTelInputNgModule } from 'intl-tel-input-ng';
import { AddEditStockComponent } from './products/add-edit-stock/add-edit-stock.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text:'Cargando...',
  textColor: '#0e073e',
  textPosition: 'center-center',
  bgsColor: '#7b1fa2',
  fgsColor: '#7b1fa2',
  fgsType: SPINNER.circle,
  fgsSize: 100,
  hasProgressBar: false,
}

@NgModule({
  declarations: [
    DashboardComponent,
    BodyComponent,
    SidebarComponent,
    HomeComponent,
    SublevelMenuComponent,
    ProductsComponent,
    AddEditFormComponent,
    AddEditCategoryFormComponent,
    AddEditEquipmentFormComponent,
    ManageCategoriesComponent,
    EquipmentComponent,
    SettingsComponent,
    CustomersComponent,
    AddEditStockComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ]
})
export class DashboardModule { }
