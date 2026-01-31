import {HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

import { MatPaginator } from '@angular/material/paginator';
import swal from'sweetalert2';

import { AddEditSuppliersFormComponent } from './add-edit-suppliers-form/add-edit-suppliers-form/add-edit-suppliers-form.component';

import { SuppliersService } from 'src/app/data/service/suppliersService/suppliers.service';
import { ExportToExcelService } from 'src/app/shared/service/export-to-excel.service';

@Component({
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent {
  dataSource = new MatTableDataSource<any>();
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Apellido', 'Correo Electrónico','Contacto', 'Dirección', 'Estado', 'Editar', 'Eliminar'];

  // Filter properties
  selectedShowOption: string = 'all';
  selectedSortOption: string = 'default';

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor
  (
    private supplierService: SuppliersService,
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private excelExportService : ExportToExcelService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllSuppliers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  exportToExcel() {
    const rows = (this.dataSource.filteredData?.length ? this.dataSource.filteredData : this.dataSource.data) || [];
    const exportRows = rows.map((row: any) => ({
      firstName: row?.first_name ?? row?.name ?? '',
      lastName: row?.last_name ?? '',
      email: row?.email ?? '',
      phone: row?.phone ?? row?.contact ?? '',
      address: row?.address ?? row?.c_address ?? row?.c_adress ?? '',
      status: row?.status ?? ''
    }));

    const fileName = 'InformacionProveedores';
    const columns = [
      { header: 'Nombre', key: 'firstName', width: 18 },
      { header: 'Apellido', key: 'lastName', width: 18 },
      { header: 'Correo Electrónico', key: 'email', width: 26 },
      { header: 'Contacto', key: 'phone', width: 16 },
      { header: 'Dirección', key: 'address', width: 30 },
      { header: 'Estado', key: 'status', width: 12 }
    ];

    this.excelExportService.exportJsonToExcel(exportRows, columns, fileName);
  }

  getSupplierStatus(supplier: any): 'active' | 'inactive' {
    return supplier?.status === 'inactive' ? 'inactive' : 'active';
  }

  updateStatus(supplier: any, status: 'active' | 'inactive'): void {
    supplier.status = status;
    this._coreService.openSuccessSnackBar(
      `Estado actualizado a ${status === 'active' ? 'Activo' : 'Inactivo'}`,
      'success'
    );
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
        this.dataSource.data = response.data;

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
    dialogConfig.width = "auto";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.panelClass = 'supplier-dialog';
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    const dialogRef = this.dialog.open(AddEditSuppliersFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddSupplier.subscribe((response) => {
      this.getAllSuppliers();
    });
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "auto";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.panelClass = 'supplier-dialog';
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
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
      message: 'eliminar el ' + 'proveedor con nombre ' + values.first_name,
      confirmation: true
    }
    dialogConfig.panelClass = 'confirmation-dialog';
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
          'Proveedor eliminado',
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
            text: 'No pudimos completar la acción.',
            footer: this.responseMessage
          })
      }
    );
  }
}

