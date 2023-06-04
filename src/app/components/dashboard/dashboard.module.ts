import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './products/products.component';
import { BodyComponent } from './body/body.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { SublevelMenuComponent } from './sidebar/sub-level.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule , SPINNER} from 'ngx-ui-loader';

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
    ProductsComponent,
    BodyComponent,
    SidebarComponent,
    HomeComponent,
    SublevelMenuComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ]
})
export class DashboardModule { }
