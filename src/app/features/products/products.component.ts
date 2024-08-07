import {HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

import { ProductService } from 'src/app/data/service/productService/product.service';
import { ProductCategorieService } from 'src/app/data/service/productCategoryService/productCategories.service';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { ExportToExcelService } from 'src/app/shared/service/export-to-excel.service';

import { AddEditFormComponent } from './components/add-edit-form/add-edit-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

import * as XLSX from 'xlsx';
import swal from'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit{

  dataSource = new MatTableDataSource<any>();
  //productDetails:any;
  productsCategories:any;
  productStocks:any;
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Descripcion', 'Stock','Costo', 'Precio Total', 'Categoria', 'Editar', 'Eliminar'];
  productStockColumns: string[] = ['ID', 'Nombre', 'Stock','Editar'];

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor(
    private productService : ProductService, 
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private productCategoryService : ProductCategorieService,
    private excelExportService : ExportToExcelService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  exportToExcel() {
    const tableId = 'productsData';
    const columnsToInclude = ['ID', 'Nombre', 'Descripcion', 'Stock', 'Costo', 'Precio Total', 'Categoría']
    const fileName = 'Inventario Productos'

    this.excelExportService.ExportToExcelComponent(tableId, columnsToInclude, fileName);
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
    this.productService.getAllProducts()
    .subscribe
    (
      (response: any) => {

        console.log(response);
        this.ngxService.stop();
        this.dataSource.data = response.data;
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
    this.productCategoryService.getProductsCategories()
    .subscribe
    (
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

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Guardar"
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response) => {
      this.getAllProducts();
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

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar el ' + values.name +' producto',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id)
    .subscribe
    (
      (response:any) => {

        this.ngxService.stop();
        this.getAllProducts();
        this.responseMessage = response?.message;

        swal.fire(
          'El producto ha sido eliminado correctamente',
          this.responseMessage = response?.message,
          'success'
        )

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
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salió mal!',
          footer: this.responseMessage
        })

      }
    );
  }


}
