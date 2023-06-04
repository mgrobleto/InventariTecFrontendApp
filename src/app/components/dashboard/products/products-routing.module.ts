import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ListProductsComponent } from './view-products/list-products.component';

const routes: Routes = [
  {
    path: 'addNewProduct',
    component: AddProductComponent,
  },
  {
    path: 'allProducts',
    component: ListProductsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
