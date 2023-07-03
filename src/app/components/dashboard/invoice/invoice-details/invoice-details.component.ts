import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListInvoicesComponent } from '../view-invoices/list-invoices.component';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { BillService } from 'src/app/services/salesService/sales.service';
import { CoreService } from 'src/app/services/snackBar/core.service';
import { map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';


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
    'Categoria',
    'Precio',
    'Cantidad',
    'Total',
  ];

  //dataSource:any;
  data:any;
  productsData:any;

  constructor(
    public _dialogRef : MatDialogRef<InvoiceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _billService : BillService, 
    private _coreService : CoreService,
  ) {}

  ngOnInit(): void {
    this.data = this.dialogData.data;
    this.getBillItemsDetails(this.data);

    //this.productsData = this.dialogData.items;
    //this.dataSource = this.dialogData.items;
    //this.dataSource = this.items;
    //console.log(this.dialogData.data);
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
    this._billService.getBillItems().pipe( map( (items: any) => {
      return items.filter((billNumber : any) => billNumber.billNumber === values.billNumber)
    })).subscribe(
      (data: any) => {
        //console.log(values.billNumber)
        //this.items = data;
        data.forEach((element:any) => {
          this.productsData = element.billItems;
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
}
