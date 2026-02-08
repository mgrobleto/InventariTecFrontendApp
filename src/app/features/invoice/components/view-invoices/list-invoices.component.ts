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
import { MatSelect } from '@angular/material/select';
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
  ];

  dataSource = new MatTableDataSource<any>();
  originalData: any[] = []; // Store original data for filtering
  filterBill:any;
  billDetails:any = [];
  items:any = [];
  responseMessage:any;
  displayedColumns: string[] = ['Numero de Factura', 'Nombre Cliente', 'Total', 'Tipo de pago', 'Fecha', 'Ver detalle', 'Eliminar'];
  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  billState: any;

  // Selection
  selection = new SelectionModel<any>(true, []);

  // Filter properties
  selectedSortOption: string = 'default';
  recentDays = 7;

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
    })

    this.searchOptionsForm.get("searchBy") ?.valueChanges.subscribe(
      (value: any) => {
        this.searchOptionsForm.patchValue({
          dateSelected: ''
        })
      }
    )
  }

  exportToExcel(): void
  {
    const rows = (this.dataSource.filteredData?.length ? this.dataSource.filteredData : this.dataSource.data) || [];
    const exportRows = rows.map((row: any) => ({
      invoiceNumber: row?.invoice_number ?? '',
      customer: row?.customer ? `${row.customer.first_name || ''} ${row.customer.last_name || ''}`.trim() : '',
      total: Number(row?.total ?? 0),
      paymentType: row?.payment_type?.payment_type_name ?? '',
      date: this.datePipe.transform(row?.invoice_date ?? row?.created_at ?? row?.date, 'dd/MM/yy HH:mm') || ''
    }));

    const fileName = 'VentasReporte';
    const columns = [
      { header: 'Numero de Factura', key: 'invoiceNumber', width: 20 },
      { header: 'Nombre Cliente', key: 'customer', width: 28 },
      { header: 'Total', key: 'total', width: 14, numFmt: '#,##0.00' },
      { header: 'Tipo de pago', key: 'paymentType', width: 20 },
      { header: 'Fecha', key: 'date', width: 18 }
    ];

    this.excelExportService.exportJsonToExcel(exportRows, columns, fileName);
 
  }

  handleSearchAction() {
    if(this.searchOptionsForm.value.searchBy === "date"){

      var dateSelected = this.searchOptionsForm.controls['dateSelected'].value;
      this.searchByDate(dateSelected);

    }
  }

  searchByDate(dateValue: Date | string | null) {
    const normalized = dateValue
      ? this.datePipe.transform(dateValue, 'yyyy-MM-dd')
      : null;

    if (!normalized) {
      this.resetFilters();
      return;
    }

    this._billService.getAllInvoices().pipe(
      map((bill: any) => {
        const rows = bill.data || bill || [];
        return rows.filter((row: any) => {
          const createdAt = this.datePipe.transform(
            row.created_at ?? row.invoice_date ?? row.date,
            'yyyy-MM-dd'
          );
          return createdAt === normalized;
        });
      })
    ).subscribe(
      (response: any) => {
        this.applySort(response);
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

  resetFilters(): void {
    this.searchOptionsForm.patchValue({ dateSelected: '' });
    this.applySort([...this.originalData]);
    this.selection.clear();
    this.paginator?.firstPage();
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
    this.router.navigate(['/invoice/createNewInvoice']);
  }

  getAllBills() {
    this._billService.getAllInvoices().subscribe(
      (data: any) => {
        console.log(data);
        this.ngxService.stop();
        this.originalData = data.data || [];
        this.applySort([...this.originalData]);
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

  toggleSelect(select: MatSelect): void {
    if (select.panelOpen) {
      select.close();
    } else {
      select.open();
    }
  }


  onSortChange(sortOption: string): void {
    this.selectedSortOption = sortOption;
    this.applySort([...this.dataSource.data]);
  }

  private applySort(rows: any[]): void {
    const sorted = [...rows];

    if (this.selectedSortOption === 'date') {
      sorted.sort((a, b) => {
        const dateA = this.getInvoiceDate(a)?.getTime() || 0;
        const dateB = this.getInvoiceDate(b)?.getTime() || 0;
        return dateA - dateB;
      });
    } else if (this.selectedSortOption === 'total') {
      sorted.sort((a, b) => (Number(a?.total) || 0) - (Number(b?.total) || 0));
    } else if (this.selectedSortOption === 'number') {
      sorted.sort((a, b) => (Number(a?.invoice_number) || 0) - (Number(b?.invoice_number) || 0));
    }

    this.dataSource.data = sorted;
    this.selection.clear();
    this.paginator?.firstPage();
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

  getInvoiceState(bill: any): string {
    if (this.isRecentInvoice(bill)) {
      return 'Reciente';
    }

    return 'Pendiente';
  }

  private isPendingInvoice(bill: any): boolean {
    if (bill?.pending === true) {
      return true;
    }

    const state = (bill?.bill_state ?? bill?.state ?? bill?.status ?? '')
      .toString()
      .toLowerCase();

    if (state === 'pending' || state === 'pendiente') {
      return true;
    }

    return !this.isRecentInvoice(bill);
  }

  private isRecentInvoice(bill: any): boolean {
    const dateValue = this.getInvoiceDate(bill);

    if (!dateValue) {
      return false;
    }

    const now = new Date();
    const diffMs = now.getTime() - dateValue.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= this.recentDays;
  }

  private getInvoiceDate(bill: any): Date | null {
    const rawValue = bill?.invoice_date ?? bill?.created_at ?? bill?.date;

    if (!rawValue) {
      return null;
    }

    if (rawValue instanceof Date) {
      return rawValue;
    }

    if (typeof rawValue === 'number') {
      const parsed = new Date(rawValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
      const parsed = new Date(normalized);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }

      const fallback = new Date(trimmed);
      return isNaN(fallback.getTime()) ? null : fallback;
    }

    return null;
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
    dialogConfig.width = 'auto';
    dialogConfig.maxWidth = '95vw';
    dialogConfig.maxHeight = '95vh';
    dialogConfig.panelClass = 'invoice-details-dialog';
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
      message: `Esta seguro de eliminar la factura ${values.invoice_number ?? ''}`.trim() + '.',
      confirmation: true
    }
    dialogConfig.panelClass = 'confirmation-dialog';
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
          text: 'No pudimos completar la acción.',
          footer: this.responseMessage
        })
      //this._coreService.openFailureSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }
}

