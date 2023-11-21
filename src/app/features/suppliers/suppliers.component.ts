import {HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import swal from'sweetalert2';

import { AddEditSuppliersFormComponent } from './add-edit-suppliers-form/add-edit-suppliers-form/add-edit-suppliers-form.component';

import { SuppliersService } from 'src/app/data/service/suppliersService/suppliers.service';

@Component({
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent {
  dataSource = new MatTableDataSource<any>();
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Correo Electrónico','Contacto', 'Dirección','Editar', 'Eliminar'];

  fileName= 'ClientesInfo.xlsx';

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor
  (
    private supplierService: SuppliersService,
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllSuppliers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  exportToExcel() {
    /* pass here the table id */
    let element = document.getElementById('ClientsData');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  }
  

  openEditClientForm(data : any) {
    const dialogRef = this.dialog.open(AddEditSuppliersFormComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getAllSuppliers();
        }
      }
    });
  }


  getAllSuppliers() {
    this.supplierService.getAllSuppliers()
    .subscribe
    (
      (response: any) => {

        console.log(response);
        this.ngxService.stop();
        this.dataSource.data = response;

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

  applyFilter(event: Event) {
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
    const dialogRef = this.dialog.open(AddEditSuppliersFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    /* const sub = dialogRef.componentInstance.onAddCustomer.subscribe((response) => {
      this.getAllClients();
    }); */
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditSuppliersFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

   /*  const sub = dialogRef.componentInstance.onEditCustomer.subscribe((response) => {
      this.getAllClients();
    }); */
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar el ' + 'cliente' + values.fullName,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteSupplier(values.id);
      dialogRef.close();
    })
  }

  deleteSupplier(id: string) {
    this.supplierService.deleteSupplier(id)
    .subscribe
    (
      (response:any) => {

        this.ngxService.stop();
        this.getAllSuppliers();
        this.responseMessage = response?.message;
        swal.fire (
          'El cliente ha sido eliminado',
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
