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
  originalData: any[] = [];
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Apellido', 'Correo Electrónico','Contacto', 'Dirección', 'Editar', 'Eliminar'];

  // Filter properties
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
      address: row?.address ?? row?.c_address ?? row?.c_adress ?? ''
    }));

    const fileName = 'InformacionProveedores';
    const columns = [
      { header: 'Nombre', key: 'firstName', width: 18 },
      { header: 'Apellido', key: 'lastName', width: 18 },
      { header: 'Correo Electrónico', key: 'email', width: 26 },
      { header: 'Contacto', key: 'phone', width: 16 },
      { header: 'Dirección', key: 'address', width: 30 }
    ];

    this.excelExportService.exportJsonToExcel(exportRows, columns, fileName);
  }

  getSupplierStatus(supplier: any): 'active' | 'inactive' {
    return supplier?.status === 'inactive' ? 'inactive' : 'active';
  }

  updateStatus(supplier: any, status: 'active' | 'inactive'): void {
    const payload = {
      supplier_id: supplier?.id,
      first_name: supplier?.first_name ?? supplier?.name ?? '',
      last_name: supplier?.last_name ?? '',
      email: (supplier?.email?.trim() || supplier?.contact?.trim() || GlobalConstants.emptyFieldPlaceholder),
      phone: (supplier?.phone?.trim() || supplier?.contact?.trim() || GlobalConstants.emptyFieldPlaceholder),
      s_address: (supplier?.s_address?.trim() || supplier?.address?.trim() || supplier?.c_address?.trim() || supplier?.c_adress?.trim() || GlobalConstants.emptyFieldPlaceholder),
      status
    };

    this.supplierService.updateSupplier(payload).subscribe(
      () => {
        this._coreService.openSuccessSnackBar(
          `Estado actualizado a ${status === 'active' ? 'Activo' : 'Inactivo'}`,
          'success'
        );
        this.getAllSuppliers();
      },
      (error: any) => {
        const message = error?.error?.message || error?.message || GlobalConstants.genericError;
        this._coreService.openFailureSnackBar(message, GlobalConstants.error);
      }
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
        this.originalData = response.data || [];
        this.dataSource.data = [...this.originalData];
        this.applySort();

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

  onSortChange(sortOption: string): void {
    this.selectedSortOption = sortOption;
    this.applySort();
  }

  private applySort(): void {
    const rows = [...this.originalData];

    if (this.selectedSortOption === 'name') {
      rows.sort((a, b) => {
        const nameA = `${a?.first_name || ''} ${a?.last_name || ''}`.trim();
        const nameB = `${b?.first_name || ''} ${b?.last_name || ''}`.trim();
        return nameA.localeCompare(nameB);
      });
    } else if (this.selectedSortOption === 'id') {
      rows.sort((a, b) => (Number(a?.id) || 0) - (Number(b?.id) || 0));
    }

    this.dataSource.data = rows;
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

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllSuppliers();
        }
      }
    });
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: `Esta seguro de eliminar el proveedor ${values.first_name}.`,
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

