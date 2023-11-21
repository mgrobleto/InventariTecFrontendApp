import {HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/data/service/productService/product.service';
import { AddEditFormComponent } from '../../products/components/add-edit-form/add-edit-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../../shared/global-constants';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CategoriesService } from 'src/app/data/service/categoryService/categories.service';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import swal from'sweetalert2';

@Component({
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent {
  dataSource = new MatTableDataSource<any>();
  //productDetails:any;
  productsCategories:any;
  productStocks:any;
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Descripcion', 'Stock','Costo', 'Precio Total', 'Tipo de moneda', 'Categoria', 'Editar', 'Eliminar'];
  productStockColumns: string[] = ['ID', 'Nombre', 'Stock','Editar'];

  fileName= 'InventarioProductos.xlsx';

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor(
    private productService : ProductService, 
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _categoryService : CategoriesService
    ){}

  ngOnInit(): void {
    /* this.ngxService.start();
    this.getAllProducts(); */
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  exportToExcel() {
    /* pass here the table id */
    let element = document.getElementById('productsData');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
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
        this.dataSource.data = response;
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

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      this.productService.deleteProduct(id).subscribe(
        (response:any) => {
          this.ngxService.stop();
          this.getAllProducts();
          this.responseMessage = response?.message;
          swal.fire(
            'El producto ha sido eliminado correctamente',
            this.responseMessage = response?.message,
            'success'
          )
          //this._coreService.openSuccessSnackBar("Producto eliminado", "con exito");
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
        //this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }
}
