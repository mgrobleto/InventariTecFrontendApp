import { Component, OnInit, Inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../../shared/global-constants';
import { map } from 'rxjs';
import { DatePipe} from '@angular/common';
import swal from'sweetalert2';

// services
import { ProductService } from 'src/app/data/service/productService/product.service';
import { ProductCategorieService } from 'src/app/data/service/productCategoryService/productCategories.service';
import { InvoiceSalesService } from 'src/app/data/service/invoiceSalesService/invoiceSales.service';
import { CustomerService } from 'src/app/data/service/customerService/customer.service';
import { PaymentMethodService } from '../../../../data/service/paymentType/paymentMethod.service';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers: [DatePipe]
})
export class CreateInvoiceComponent implements OnInit {

  //traer el tipo de moneda
  // seleccionar cliente agregado o agregar form para agregar cliente
  // traer el detalle de las facturas

  displayedColumns: string[] = [
    'Nombre',
    'Categoria',
    'Precio',
    'Cantidad',
    'Total',
    'Eliminar',
  ];
  
  productsByCategorySelected:any =[];
  productsCategories:any=[];
  productDetail:any = [];
  productStock:any = [];
  customers:any =[];
  customerType:any = [];
  currency:any= [];
  payment_type:any= [];
  month:any= [];
  year:any= [];
  dataSource:any = [];
  responseMessage: any;
  billId:any;
  sub_total:any;
  iva:any;
  totalAmount:number = 0; //corresponde al total de las ventas
  netAmount:number = 0; //corresponde al total neto de la factura
  ivatMount:number = 0;
  price:any; //corresponde al modelo de detalle de venta
  productStockQuantity:any;
  productQuantity:number = 0; //corresponde
  invoiceForm:any = FormGroup;
  invoiceDetailForm:any = FormGroup;
  currentMonth: any;
  yearValue: any;


  constructor(
    private _fb : FormBuilder,
    private productService : ProductService, 
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _categoryService : ProductCategorieService,
    private _billService : InvoiceSalesService,
    private _customerService : CustomerService,
    private paymentMethodsService : PaymentMethodService,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) { }

  // esto ya no
  /* generateBillId() {
    this.billDate = new Date();
    this.billDate = this.billDate.getTime().toString();
    console.log(this.billDate)
    this.invoiceForm.controls['billNumber'].setValue(this.billDate)
  } */

  getDGIInvoiceDetail() {
    var invoiceNumber = this.authService.getUserInfo().business.invoice_number;
    this.invoiceForm.controls['invoice_number'].setValue(invoiceNumber);
  }

  ngOnInit(): void {

    var myDate = new Date();

    this.invoiceForm = this._fb.group({
      invoice_number: [null, [Validators.required]],
      invoice_date: [null, [Validators.required]],
      customer_name: [null,[Validators.required]],
      phoneNumber: [null,[Validators.required]],
      sub_total: [null,[Validators.required]],
      iva: [null,[Validators.required]],
      total: [null,[Validators.required]],
      //payment_type: [null,[Validators.required]],
      productName: [null,[Validators.required]],
      category: [null,[Validators.required]],
      price: [null,[Validators.required]],
      amount_products: [null,[Validators.required]],
      total_sale: [null,[Validators.required]],
    })

    this.ngxService.start();
    this.getProductsCategories();
    this.getPaymentType();
    this.getDGIInvoiceDetail();

    /* const value = new Date().getMonth();
    this.yearValue = new Date().getFullYear();
    //this.invoiceForm.controls['id_year'].setValue(year);
    //console.log("el año"+ year);
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.currentMonth = monthNames[value];
    //this.getMonth(); */


    this.invoiceForm.controls['iva'].setValue(15.0); // el iva se establece en un valor de 15.0

    this.invoiceForm.controls['invoice_date'].setValue(
      this.datePipe.transform(myDate, "YYYY-MM-dd")
    );
    //console.log(this.billDate);
  }

  getPaymentType() {
    this.paymentMethodsService
    .getPaymentType()
    .subscribe(
      (resp : any) => {
        this.payment_type = resp;
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

  getProductsCategories() {
    this._categoryService
    .getProductsCategories()
    .subscribe(
      (resp : any) => {
        console.log(resp);
        this.ngxService.stop();
        this.productsCategories = resp;
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
  }

  getProductsByCategory(value: any) {
    this.productService.getAllProducts()
    .pipe( 
      map((product: any) => {
      return product.filter((product : any) => product.category === value)
    }))
    .subscribe(
      (response: any) => {
        this.productsByCategorySelected = response;
        console.log(this.productsByCategorySelected);
        this.invoiceForm.controls['price'].setValue('');
        this.invoiceForm.controls['amount_products'].setValue('');
        this.invoiceForm.controls['total_sale'].setValue(0);
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

  getProductDetails(value:any){
    //var currency_type: any;
    this.productService.getAllProducts()
    .pipe(
      map((product: any) => {
      return product.filter((product : any) => product.name === value)
    }))
    .subscribe(
      (response: any) => {

        this.productDetail = response;
        console.log(this.productDetail);

        this.productDetail.forEach((element:any) => {
          this.price = element.sale_price;
          //currency_type = element.currency;
          this.productStockQuantity = element.stock;
        });

        //console.log(this.productStockQuantity);
        this.invoiceForm.controls['price'].setValue(this.price);
        this.invoiceForm.controls['amount_products'].setValue('1');
        this.invoiceForm.controls['total_sale'].setValue(this.price * 1);

      }, (error : any) => {
        console.log(error);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        //this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    )
  }

  setQuantity(values: any) {
    var temp = this.invoiceForm.controls['amount_products'].value;
    
    if(temp > 0 && temp <= this.productStockQuantity){
      this.invoiceForm.controls['total_sale'].setValue(this.invoiceForm.controls['amount_products'].value * this.invoiceForm.controls['price'].value);
    }
    else if (temp > this.productStockQuantity) {
      this._coreService.openFailureSnackBar(GlobalConstants.stock, GlobalConstants.error);
    }
    else if (temp != '') {
      this.invoiceForm.controls['amount_products'].setValue('1');
      this.invoiceForm.controls['total_sale'].setValue(this.invoiceForm.controls['amount_products'].value * this.invoiceForm.controls['price'].value);
    } 

    // establece la cantidad de productos que va a comprar
    this.productQuantity = temp;

    console.log(this.productQuantity);

  }

  validateAddProduct() {
    if( this.invoiceForm.controls['total_sale'].value === 0 || this.invoiceForm.controls['total_sale'].value === null || 
        this.invoiceForm.controls['amount_products'].value <= 0) {
     return true;
    } else 
     return false;
  }

  addProductToSaleList() {
    var invoiceDetailFormData = this.invoiceForm.value;
    var temp = this.invoiceForm.controls['iva'].value;
    //var twoPlaces = Number.toFied(2)x;

    var productName = this.dataSource.find((e: {productName : any}) => e.productName === invoiceDetailFormData.productName);
    //console.log(productName);

    if( productName ===  undefined && this.productQuantity <= this.productStockQuantity) {
      this.totalAmount = this.totalAmount + invoiceDetailFormData.total_sale;
      var totalAmountValue = this.totalAmount.toFixed(2);
      this.ivatMount = this.totalAmount * temp;
      //var iva = this.ivatMount.toFixed(2);
      //this.ivatMount.toFixed(2);
      this.netAmount = parseFloat(totalAmountValue) + this.ivatMount;

      var netTotal = this.netAmount.toFixed(2);
      this.invoiceForm.controls['sub_total'].setValue(totalAmountValue);
      this.invoiceForm.controls['total'].setValue(netTotal);

      this.dataSource.push({productName:invoiceDetailFormData.productName, category:invoiceDetailFormData.category, price:invoiceDetailFormData.price, amount_products:invoiceDetailFormData.amount_products, total_sale:invoiceDetailFormData.total_sale})
      this.dataSource = [...this.dataSource]
      //this._coreService.openSuccessSnackBar(GlobalConstants.productAdded, "con exito");
      //this.productQuantity = 0;

    } else if(this.productQuantity > this.productStockQuantity) {
      this._coreService.openSuccessSnackBar(GlobalConstants.stock, GlobalConstants.error);
    } else
    {
      this._coreService.openSuccessSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  validateSubmit() {
    if(this.netAmount === 0 ||  this.invoiceForm.controls['customer_name'].value === null ||
      this.invoiceForm.controls['payment_type'].value === null) {
        return true;
    } else {
      return false;
    }
  }

  // ya no se usa
  calculateIvaMount() {
    var temp = this.invoiceForm.controls['iva'].value;

    if(this.totalAmount > 0){
      var totalAmountValue = this.totalAmount.toFixed(2);
      this.ivatMount = parseFloat(totalAmountValue) * temp;
      var iva = this.ivatMount.toFixed(2);

      console.log(this.ivatMount);
  
      this.invoiceForm.controls['iva'].setValue(iva);
      this.netAmount = parseFloat(totalAmountValue) + parseFloat(iva);
      this.invoiceForm.controls['total'].setValue(this.netAmount);
    } else {
      this.invoiceForm.controls['iva'].setValue(temp);
    }
  }

  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total_sale;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource]
    this.invoiceForm.controls['sub_total'].reset();
  }

  submitAction() {
    var billFormData = this.invoiceForm.value;
    //var billDetailFormData = this.invoiceDetailForm.value;

    var dateSelected = this.invoiceForm.controls['invoice_date'].value
    console.log(dateSelected)
    var selectedDate = this.datePipe.transform(dateSelected, "YYYY-MM-dd");

    //var phoneNumberValue = this.invoiceForm.controls['phoneNumber'].value;

    //console.log(selectedDate);

    var billData = {
      invoice_number : billFormData.billNumber,
      customer_name: billFormData.customer_name,
      phoneNumber: billFormData.phoneNumber,
      sub_total:billFormData.sub_total,
      iva: billFormData.iva,
      total: billFormData.total,
      payment_type: billFormData.payment_type,
      id_month : billFormData.id_month,
      id_year:billFormData.id_year,
      created_at: selectedDate,
      bill_state: billFormData.bill_state,
      billItems: this.dataSource,
    }

    console.log(billData);

    this._billService.createNewInvoice(billData).subscribe(
      (response:any) => {
        console.log(billData);
        this.responseMessage = response.message;
        console.log(this.responseMessage);
        swal.fire(
          'Venta registrada',
          'Número de Factura: '+ billFormData.billNumber,
          'success'
        )
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
          text: 'Algo salió mal!',
          footer: this.responseMessage
        })
        //this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    )

    this.invoiceForm.reset();
    this.dataSource.reset();
    this.totalAmount = 0;
    this.ngOnInit();

    /* this.dataSource.forEach((element : any) => {

      // restamos el stock actual con la cantidad de produtos comprados
      this.productStockQuantity = this.productStockQuantity - element.amount_products;
    })

    this.productService.updateProductStock().pipe(map( (product : any) => {
      return product.filter((product : any) => product.productName === value)
    })).subscribe(
      (response: any) => {
        this.productStock = response;
        this.productStock.forEach((element:any) => {
          this.productStockQuantity = element.stock;
        });
        console.log(this.productStockQuantity);
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

    this.productDetail.forEach((element:any) => {
      element.stock = element.stock - this.productQuantity;
    });

    console.log(this.productDetail); */
    
    
    /* var billDetailData = {
      billNumber : billFormData.billNumber, // id de la factura creada anteriormente
      billItems: JSON.stringify(this.dataSource),
    }
  
    this._billService.addBillItems(billDetailData).subscribe(
      (response:any) => {
        console.log(billDetailData);
        this.responseMessage = response.message;
        //this._coreService.openSuccessSnackBar(GlobalConstants.saleAdded)
        swal.fire(
          'Venta registrada',
          'Número de Factura: '+ billFormData.billNumber,
          'success'
        )
        //this._coreService.openSnackBar(this.responseMessage, "con exito!");
      },
      (error) => {
        //console.log(billDetailData);
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    ) */
  }
}
