import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { InvoiceSalesService } from 'src/app/data/service/invoiceSalesService/invoiceSales.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-edit-invoice-status',
  templateUrl: './edit-invoice-status.component.html',
  styleUrls: ['./edit-invoice-status.component.scss']
})
export class EditInvoiceStatusComponent implements OnInit {
  
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();

  billForm:any = FormGroup;
  dialogAction: any = 'Agregar';
  action: any = 'Agregar';
  responseMessage: any;
  productsCategories:any = [];
  billState:any= [];
  billDetails: any;
  
  constructor(
    private _fb : FormBuilder,
    private _billService:InvoiceSalesService,
    public _dialogRef : MatDialogRef<EditInvoiceStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    //this.productForm.patchValue(this.data);
    this.billForm = this._fb.group({
      billNumber: [null, [Validators.required]],
      customer_name: [null,[Validators.required]],
      customer_type: [null,[Validators.required]],
      phoneNumber: [null,[Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      sub_total: [null,[Validators.required]],
      iva: [null,[Validators.required]],
      total: [null,[Validators.required]],
      currency_type: [null,[Validators.required]],
      payment_type: [null,[Validators.required]],
      id_month: [null,[Validators.required]],
      id_year: [null,[Validators.required]],
      created_at: [null,[Validators.required]],
      bill_state: [null,[Validators.required]],
      productName: [null,[Validators.required]],
      category: [null,[Validators.required]],
      price: [null,[Validators.required]],
      amount_products: [null,[Validators.required]],
      total_sale: [null,[Validators.required]],
    });
    //console.log(this.data);

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.billForm.patchValue(this.dialogData.data);
    }

    //this.getBillState();
  }

 /*  getBillState(){
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

  getAllBills() {
    this._billService.getAllInvoices().subscribe(
      (data: any) => {
        console.log(data);
        this.billDetails = data;
        //this.productDetails = response;
      }, (error : any) => {
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

  handleSubmit(){
    if(this.dialogAction === "Editar") {
      //this.edit();
    } 
  }

  /* edit() {
    var formData = this.billForm.value;

    var data = {
      id : this.dialogData.data.id,
      billNumber : this.dialogData.data.billNumber,
      customer_name: this.dialogData.data.customer_name,
      customer_type: this.dialogData.data.customer_type,
      phoneNumber: this.dialogData.data.phoneNumber,
      sub_total: this.dialogData.data.sub_total,
      iva: this.dialogData.data.iva,
      total: this.dialogData.data.total,
      currency_type: this.dialogData.data.currency_type,
      payment_type: this.dialogData.data.payment_type,
      id_month : this.dialogData.data.id_month,
      id_year: this.dialogData.data.id_year,
      created_at: this.dialogData.data.created_at,
      bill_state: formData.bill_state,
      billItems: this.dialogData.data.billItems,
    }

    this._billService.updateBillState(data).subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditProduct.emit();
        swal.fire(
          'Estado de factura actualizado a: ' + data.bill_state,
          'Número de Factura: '+ data.billNumber,
          'success'
        )
        this.responseMessage = response.message;
        //this._coreService.openSuccessSnackBar("Estado actualizado", "con éxito");
      },
      (error) => {
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No pudimos completar la acción.',
          footer: this.responseMessage
        })
        //this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  } */
}

