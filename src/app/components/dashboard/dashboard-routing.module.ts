import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import {  ProductsComponent} from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { CustomersComponent } from './customers/customers.component';
import { GlobalConstants } from 'src/app/components/shared/global-constants';


const routes: Routes = [
  { path: '', component:DashboardComponent, children:[
    {
      path: '', 
      component:HomeComponent
    },
    {
      path: 'home', 
      component:HomeComponent
    },
    {
      path: 'invoice', 
      //component:InvoiceComponent,
      loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
    },
    {
      path: 'products', 
      component:ProductsComponent,
      //loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
    },
    {
      path: 'manageCategories', 
      component:ManageCategoriesComponent,
      //loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
    },
    {
      path: 'equipment', 
      component:EquipmentComponent,
      //loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
    },
    {
      path: 'customers', 
      component:CustomersComponent,
      //loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
    },
    {
      path: 'settings', 
      component:SettingsComponent,
      //loadChildren: () => import('./equipment/equipment.module').then(m => m.ProductsModule)
    },
    {
      path: 'logout', 
      redirectTo:'login', 
      pathMatch: 'full',
      //loadChildren: () => import('./equipment/equipment.module').then(m => m.ProductsModule)
    },
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
