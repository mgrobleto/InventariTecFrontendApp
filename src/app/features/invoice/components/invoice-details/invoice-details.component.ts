import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListInvoicesComponent } from '../view-invoices/list-invoices.component';
import { GlobalConstants } from '../../../../shared/global-constants';
import { InvoiceSalesService } from 'src/app/data/service/invoiceSalesService/invoiceSales.service';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

import { PaymentMethodService } from 'src/app/data/service/paymentType/paymentMethod.service';


import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  public dataSource = new MatTableDataSource<any>();
  items:any;
  responseMessage:any;

  displayedColumns: string[] = [
    'Producto',
    'Precio',
    'Cantidad',
    'Total',
  ];

  //dataSource:any;
  data:any;
  productsData:any;
  paymentTypeName: any;
  logoUrl = '';

  constructor(
    public _dialogRef : MatDialogRef<InvoiceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _billService : InvoiceSalesService, 
    private _coreService : CoreService,
    private paymentType : PaymentMethodService
  ) {}

  ngOnInit(): void {
    this.logoUrl = new URL('assets/tecnorefill-logo.png', document.baseURI).toString();
    this.data = this.dialogData.data;
    this.getBillItemsDetails(this.data);
    //this.getPaymentTypeName(this.data);

    //this.productsData = this.dialogData.data;
    //this.dataSource.data = this.data.sale;
    //this.dataSource = this.items;
    //console.log('INFO DE LA FACTURA SELECCIONADA: ' + this.dataSource);
    //console.log(this.dataSource);
  }

  /* generateReportPDF() {
    
    let DATA: any = document.getElementById('reportData');


    html2canvas(DATA)!.then((canvas) => {

      const FILEURI = canvas.toDataURL('base64');
      var docDefinition = {
        content: [{
          image: FILEURI,
          width: 500,
        }]
      }

      pdfMake.createPdf(docDefinition).download("Detalle venta.pdf");
    });
  } */

  getDocumentDefinition() {
    throw new Error('Method not implemented.');
  }


 getBillItemsDetails(values: any) {
    this._billService.getAllInvoices().pipe( map( (items: any) => {
      return items.data.filter((invoiceId : any) => invoiceId.invoice_id === values.invoice_id)
    })).subscribe(
      (data: any) => {
        //console.log(values.billNumber)
        //this.items = data;
        console.log('Datos recibidos: ', data)
        data.forEach((element:any) => {
          this.productsData = element.sales;
        });
        //this.items = data;
        this.dataSource.data = this.productsData;
        console.log(this.dataSource.data);

        //this.items.push({productName: response.billItems.productName, category:response.category, price:response.price, amount_products:response.amount_products, total_sale:response.total_sale})
        //this.items = [...this.items]

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

  getPaymentTypeName(value: any) {
    console.log('valor que entraa ' + value)
    this.paymentType.getPaymentType().pipe(
      map( (type: any) => {
        return type.data.filter((typeId: any) => typeId.id === value.data.payment_type)
      })
    )
    .subscribe(
      (data : any) => {
        
        data.forEach((element:any) => {
          this.paymentTypeName = element.name;
        })
        console.log(this.paymentTypeName)

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
}

