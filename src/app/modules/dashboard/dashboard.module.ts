import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { BodyComponent } from '../../layout/body/body.component';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { HomeComponent } from '../../pages/home/home.component';
import { SublevelMenuComponent } from '../../core/components/sidebar/sub-level.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule , SPINNER} from 'ngx-ui-loader';
import { ProductsComponent } from '../../features/products/products.component';
import { AddEditFormComponent } from '../../features/products/components/add-edit-form/add-edit-form.component';
import { ListProductsComponent } from 'src/app/features/products/components/view-products/list-products.component';
import { CustomersComponent } from 'src/app/features/customers/customers.component';
import { SuppliersComponent } from 'src/app/features/suppliers/suppliers.component';
import { SettingsComponent } from '../../pages/settings/settings.component';

import { AddEditProductCategoryFormComponent } from 'src/app/features/productCategory/components/add-edit-form/add-edit-productCategory-form.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Cargando, por favor espera...',
  textColor: '#F6F7ED',
  textPosition: 'center-center',
  overlayColor: 'rgba(0, 31, 63, 0.45)',
  bgsColor: '#1E488F',
  fgsColor: '#74C365',
  fgsType: SPINNER.circle,
  fgsSize: 90,
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
    ListProductsComponent,
    AddEditProductCategoryFormComponent,
    CustomersComponent,
    SuppliersComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ]
})
export class DashboardModule { }

