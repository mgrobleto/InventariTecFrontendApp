import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from '../../pages/home/home.component';
import { ProductsComponent} from '../../features/products/products.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { ProductCategoryComponent } from 'src/app/features/productCategory/product-category/product-category.component';


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
      loadChildren: () => import('../../features/invoice/invoice.module').then(m => m.InvoiceModule)
    },
    {
      path: 'products', 
      component:ProductsComponent,
      //loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
    },
    {
      path: 'categories', 
      component:ProductCategoryComponent,
      //loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
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
