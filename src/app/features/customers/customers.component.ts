import {HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddEditCustomerFormComponent } from './add-edit-customer-form/add-edit-customer-form.component';
import { MatPaginator } from '@angular/material/paginator';
import swal from'sweetalert2';

import { CustomerService } from 'src/app/data/service/customerService/customer.service';
import { ExportToExcelService } from 'src/app/shared/service/export-to-excel.service';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {

  dataSource = new MatTableDataSource<any>();
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Apellido', 'Correo Electrónico','Contacto', 'Dirección', 'Editar', 'Eliminar'];
  selectedShowOption: string = 'all';
  selectedSortOption: string = 'default';

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor
  (
    private customerService: CustomerService,
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private excelExportService : ExportToExcelService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllClients();
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

    const fileName = 'ClientesInfo';
    const columns = [
      { header: 'Nombre', key: 'firstName', width: 18 },
      { header: 'Apellido', key: 'lastName', width: 18 },
      { header: 'Correo Electrónico', key: 'email', width: 26 },
      { header: 'Contacto', key: 'phone', width: 16 },
      { header: 'Dirección', key: 'address', width: 30 }
    ];

    this.excelExportService.exportJsonToExcel(exportRows, columns, fileName);
  }

  getCustomerStatus(customer: any): 'active' | 'inactive' {
    return customer?.status === 'inactive' ? 'inactive' : 'active';
  }

  updateStatus(customer: any, status: 'active' | 'inactive'): void {
    const payload = {
      customer_id: customer?.id,
      first_name: customer?.first_name,
      last_name: customer?.last_name,
      email: customer?.email,
      phone: customer?.phone,
      c_address: customer?.c_address,
      status
    };

    this.customerService.updateCustomerInfo(payload).subscribe(
      () => {
        this._coreService.openSuccessSnackBar(
          `Estado actualizado a ${status === 'active' ? 'Activo' : 'Inactivo'}`,
          'success'
        );
        this.getAllClients();
      },
      (error: any) => {
        const message = error?.error?.message || error?.message || GlobalConstants.genericError;
        this._coreService.openFailureSnackBar(message, GlobalConstants.error);
      }
    );
  }
  

  openEditClientForm(data : any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    dialogConfig.width = "650px";
    dialogConfig.panelClass = "customer-dialog";
    const dialogRef = this.dialog.open(AddEditCustomerFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getAllClients();
        }
      }
    });
  }


  getAllClients() {
    this.customerService.getAllCustomers()
    .subscribe
    (
      (response: any) => {

        this.ngxService.stop();
        this.dataSource.data = response.data;
        console.log(this.dataSource.data);

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
    dialogConfig.width = "650px";
    dialogConfig.panelClass = "customer-dialog";
    const dialogRef = this.dialog.open(AddEditCustomerFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddCustomer.subscribe((response) => {
      this.getAllClients();
    });
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "650px";
    dialogConfig.panelClass = "customer-dialog";
    const dialogRef = this.dialog.open(AddEditCustomerFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

   const sub = dialogRef.componentInstance.onEditCustomer.subscribe((response) => {
      this.getAllClients();
    });
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar el ' + 'cliente ' + values.first_name,
      confirmation: true
    }
    dialogConfig.panelClass = 'confirmation-dialog';
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteCustomer(values.id);
      dialogRef.close();
    })
  }

  deleteCustomer(id: string) {
    this.customerService.deleteCustomer(id)
    .subscribe
    (
      (response:any) => {

        this.ngxService.stop();
        this.getAllClients();
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
            text: 'No pudimos completar la acción.',
            footer: this.responseMessage
          })
      }
    );
  }
}

