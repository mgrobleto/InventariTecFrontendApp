import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationDialog } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { InvoiceSalesService } from 'src/app/data/service/invoiceSalesService/invoiceSales.service';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';
import { map } from 'rxjs';
import { EditInvoiceStatusComponent } from '../edit-invoice-status/edit-invoice-status.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

import swal from'sweetalert2';
import { ExportToExcelService } from 'src/app/shared/service/export-to-excel.service';


@Component({
  selector: 'app-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit, AfterViewInit {

  searchOptionsForm:any = FormGroup;
  searchOptions: any [] = [
    { value: 'date', description: "Por fecha"},
    { value: 'status', description: "Por estado de factura" },
  ];

  dataSource = new MatTableDataSource<any>();
  originalData: any[] = []; // Store original data for filtering
  filterBill:any;
  billDetails:any = [];
  items:any = [];
  responseMessage:any;
  displayedColumns: string[] = ['Numero de Factura', 'Nombre Cliente', 'Total', 'Tipo de pago', 'Fecha', 'Ver detalle', 'Eliminar'];
  displayedColumnsWithSelect: string[] = ['select', 'Numero de Factura', 'Nombre Cliente', 'Total', 'Tipo de pago', 'Fecha', 'Ver detalle', 'Eliminar'];
  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  billState: any;

  // Selection
  selection = new SelectionModel<any>(true, []);

  // Filter properties
  selectedCategory: string = 'all';
  selectedPriceRange: string = 'all';
  selectedShowOption: string = 'all';
  selectedSortOption: string = 'default';

  constructor(
    private _billService : InvoiceSalesService, 
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _fb: FormBuilder,
    private datePipe: DatePipe,
    private excelExportService : ExportToExcelService
  ) { 

    this.searchOptionsForm = this._fb.group({
      searchBy:['date'],
      dateSelected:[''],
      bill_state:[''],
    })

    this.searchOptionsForm.get("searchBy") ?.valueChanges.subscribe(
      (value: any) => {
        this.searchOptionsForm.patchValue({
          dateSelected: '',
          bill_state:''
        })
      }
    )
  }

  exportToExcel(): void
  {
    const tableId = 'sales-details';
    const columnsToInclude = ['ID', 'Numero de Factura', 'Nombre Cliente', 'Total', 'Tipo de pago', 'Fecha']
    const fileName = 'VentasReporte'

    this.excelExportService.ExportToExcelComponent(tableId, columnsToInclude, fileName);
 
  }

  handleSearchAction() {
    if(this.searchOptionsForm.value.searchBy === "date"){

      var dateSelected = this.searchOptionsForm.controls['dateSelected'].value;
      this.searchByDate(dateSelected);

    }else {
      var billState = this.searchOptionsForm.controls['bill_state'].value;
      this.searchByBillStatus(billState);
    }
  }

  searchByDate(date: any) {

    //var dateSelected = this.searchOptionsForm.controls['dateSelected'].value;
    date.value = this.datePipe.transform(date.value, "YYYY-MM-dd");

    //console.log(date);

    this._billService.getAllInvoices().pipe(
      map( (bill : any) => {
      return bill.data.filter((bill : any) => bill.created_at === date.value)
    })).subscribe(
      (response: any) => {
        this.dataSource.data = response;
      }, (error : any) => {
        console.log(error);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    )
  }

  searchByBillStatus(billStatus: any) {

    this._billService.getAllInvoices().pipe(map( (bill : any) => {
      return bill.filter((bill : any) => bill.bill_state === billStatus)
    })).subscribe(
      (response: any) => {
        this.dataSource.data = response;
      }, (error : any) => {
        console.log(error);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    )
  }

  ngOnInit(): void { 
    this.ngxService.start();
    this.getAllBills();
    //this.getBillState()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  

  addNewBill() {
    this.router.navigate(['/dashboard/invoice/createNewInvoice']);
  }

  getAllBills() {
    this._billService.getAllInvoices().subscribe(
      (data: any) => {
        console.log(data);
        this.ngxService.stop();
        this.originalData = data.data || [];
        this.dataSource.data = this.originalData;
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

  /* getBillState(){
    this._billService.getBillStatus().subscribe(
      (resp : any) => {
        this.billState = resp;
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
  } */

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  toggleSelectAll(event: any): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  toggleSelection(row: any): void {
    this.selection.toggle(row);
  }

  // Helper method for client initial
  getClientInitial(customer: any): string {
    if (!customer) return '?';
    const first = customer.first_name?.charAt(0) || '';
    const last = customer.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }

  /* getBillItemsDetails(values: any) {
    this._billService.getBillItems().pipe( map( (items: any) => {
      return items.filter((billNumber : any) => billNumber.billNumber === values.billNumber)
    })).subscribe(
      (response: any) => {
        //this.items = response.billItems;

        this.items.push({productName: response.productName, category:response.category, price:response.price, amount_products:response.amount_products, total_sale:response.total_sale})
        this.items = [...this.items]
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          ///data: values,
          items: this.items
        }
        dialogConfig.width = '30%';
        const dialogRef =  this.dialog.open(InvoiceDetailsComponent, dialogConfig);
        this.router.events.subscribe(() => {
          dialogRef.close();
        })

      }, (error : any) => {
        console.log(error);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    )
  } */

  handleViewAction(values : any) {

    //this.getBillItemsDetails(values);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
      //items: this.items
    }
    dialogConfig.width = '50%';
    //dialogConfig.height= 'auto';
    const dialogRef =  this.dialog.open(InvoiceDetailsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
  }

  handleEditAction(values:any) {
   const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(EditInvoiceStatusComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.getAllBills();
    });
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar esta factura',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteInvoice(values.invoice_id);
      dialogRef.close();
    })
  }

  deleteInvoice(id: string) {
    this._billService.deleteInvoice(id)
    .subscribe(
      (response:any) => {
        this.ngxService.stop();
        this.getAllBills();
        swal.fire(
          'Factura eliminada correctamente',
          this.responseMessage = response?.message,
          'success'
        )
        //this._coreService.openSuccessSnackBar(this.responseMessage, "con exito");
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
      //this._coreService.openFailureSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }
}
