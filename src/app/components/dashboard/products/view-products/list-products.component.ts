import {HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AddEditFormComponent } from '../add-edit-form/add-edit-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/components/shared/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { ConfirmationDialog } from 'src/app/components/shared/confirmation-dialog.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  productDetails:any;
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Descripcion', 'Stock', 'Costo', 'Precio Total', 'Categoria', 'Editar', 'Eliminar'];

  constructor(
    private productService : ProductService, 
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllProducts();
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
      }, (error : HttpErrorResponse) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSnackBar(this.responseMessage,GlobalConstants.error);
      }
      );
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDetails.filter = filterValue.trim().toLowerCase();
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
      message: 'eliminar ' + values.name +' producto',
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
          this._coreService.openSnackBar(this.responseMessage, "con exito");
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
        this._coreService.openSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }

  editProductDetails(id : string) {
    this.getAllProducts();
  }
   
    //console.log(this.openDialog.confirmed);

  redirect(){
    this.router.navigate(['dashboard/products/addNewProduct'])
  }
}
