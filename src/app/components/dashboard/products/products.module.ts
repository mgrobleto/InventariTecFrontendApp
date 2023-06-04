import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { ListProductsComponent } from './view-products/list-products.component';
import { SharedModule } from '../../shared/shared.module';
import { AddEditFormComponent } from './add-edit-form/add-edit-form.component';


@NgModule({
  declarations: [
    AddProductComponent,
    ListProductsComponent,
    AddEditFormComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
