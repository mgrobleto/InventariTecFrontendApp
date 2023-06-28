import {HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/productService/product.service';
import { AddEditFormComponent } from './add-edit-form/add-edit-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/components/shared/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { ConfirmationDialog } from 'src/app/components/shared/confirmation-dialog.component';
import { CategoriesService } from 'src/app/services/categoryService/categories.service';
import { MatPaginator } from '@angular/material/paginator';
import { AddEditStockComponent } from './add-edit-stock/add-edit-stock.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  encapsulation!: ViewEncapsulation.None;
  productDetails:any;
  productsCategories:any;
  productStocks:any;
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Descripcion', 'Costo', 'Precio Total', 'Tipo de moneda', 'Categoria', 'Editar', 'Eliminar'];
  productStockColumns: string[] = ['ID', 'Nombre', 'Stock','Editar'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private productService : ProductService, 
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _categoryService : CategoriesService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllProducts();
    this.getProductStock();
  }

  ngAfterViewInit() {
    this.productDetails.paginator = this.paginator;
  }
  

  openEditProductForm(data : any) {
    const dialogRef = this.dialog.open(AddEditFormComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getAllProducts();
        }
      }
    });
  }


  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        console.log(response);
        this.ngxService.stop();
        this.productDetails = new MatTableDataSource(response);
        //this.productDetails = response;
      }, (error : any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
      );
  }

  getProductsCategories() {
    this._categoryService.getProductsCategories().subscribe(
      (resp : any) => {
        console.log(resp);
        this.productsCategories = resp;
      }, (err : any) => {
        console.log(err);
        if(err.message?.message){
          this.responseMessage = err.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    )
  }

  getProductStock() {
    this.productService.getProductStock().subscribe(
      (response: any) => {
        console.log(response);
        this.productStocks = new MatTableDataSource(response);
        //this.productDetails = response;
      }, (error : any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
      );
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.productDetails.filter = filterValue.trim().toLowerCase();
  }

  applyStockFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.productStocks.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Agregar"
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response) => {
      this.getAllProducts();
      this.getProductStock();
    });
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.getAllProducts();
    });
  }

  handleEditStockAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditStockComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.getProductStock();
    });
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar el' + values.name +' producto',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  /* onChange(status:any, id:any) {
    this.ngxService.start();
    var data = {
      status:status,
      id:id
    }

    this.productService.updateStatus(data).subscribe((response:any) => {

    })
  } */

  deleteProduct(id: string) {
      this.productService.delete(id).subscribe(
        (response:any) => {
          this.ngxService.stop();
          this.getAllProducts();
          this.responseMessage = response?.message;
          this._coreService.openSuccessSnackBar("Producto eliminado", "con exito");
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          this.ngxService.stop();
          console.log(error.error?.message);
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }


}
