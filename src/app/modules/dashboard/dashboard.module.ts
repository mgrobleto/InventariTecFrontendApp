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
import { SettingsComponent } from '../../pages/settings/settings.component';

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
