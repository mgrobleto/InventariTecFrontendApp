import { Component, OnInit, Inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../../shared/global-constants';
import { map, filter } from 'rxjs';
import { DatePipe} from '@angular/common';
import swal from'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Services
import { ProductService } from 'src/app/data/service/productService/product.service';
import { ProductCategorieService } from 'src/app/data/service/productCategoryService/productCategories.service';
import { InvoiceSalesService } from 'src/app/data/service/invoiceSalesService/invoiceSales.service';
import { CustomerService } from 'src/app/data/service/customerService/customer.service';
import { PaymentMethodService } from '../../../../data/service/paymentType/paymentMethod.service';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';

// Form Components
import { AddEditCustomerFormComponent } from 'src/app/features/customers/add-edit-customer-form/add-edit-customer-form.component';

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
    'Precio',
    'Cantidad',
    'Total',
    'Eliminar',
  ];
  
  payment_type:any;
  productsByCategorySelected:any;
  productsCategories:any;
  productDetail:any;
  customers:any;
  customerDetail:any;

  productId:any;


  dataSource:any = [];
  responseMessage: any;
  
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

  isSubmitDisabled = true;

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
    private dialog: MatDialog,
    private router: Router
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
      //phoneNumber: [null,[Validators.required]],
      //sub_total: [null,[Validators.required]],
      iva: [null,[Validators.required]],
      total: [null,[Validators.required]],
      payment_type: [null,[Validators.required]],
      product: [null,[Validators.required]],
      category: [null,[Validators.required]],
      cost_price_at_time: [null,[Validators.required]],
      quantity: [null,[Validators.required]],
      sale_price_at_time: [null,[Validators.required]],
    })

    this.ngxService.start();
    this.getProductsCategories();
    this.getPaymentType();
    this.getDGIInvoiceDetail();
    this.getCustomers();

    /* const value = new Date().getMonth();
    this.yearValue = new Date().getFullYear();
    //this.invoiceForm.controls['id_year'].setValue(year);
    //console.log("el año"+ year);
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.currentMonth = monthNames[value];
    //this.getMonth(); */


    this.invoiceForm.controls['iva'].setValue(0.15); // el iva se establece en un valor de 15.0

    this.invoiceForm.controls['invoice_date'].setValue(
      this.datePipe.transform(myDate, "YYYY-MM-dd")
    );

    this.invoiceForm.valueChanges.subscribe(() => {
      this.validateSubmit();
    });
    
    //console.log(this.billDate);
  }

  getPaymentType() {
    this.paymentMethodsService.getPaymentType().subscribe(
      (resp : any) => {
        this.payment_type = resp;
        this.ngxService.stop();
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

  handleAddCustomerAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Agregar"
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditCustomerFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  getCustomers() {
    this._customerService.getAllCustomers().subscribe(
      (resp) => {
        this.customers = resp.data;
      }, 
      (error) =>{
        console.log(error);
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    )
  }

  getProductsCategories() {
    this._categoryService.getProductsCategories().subscribe(
      (resp : any) => {
        console.log(resp);
        this.productsCategories = resp.data;
        this.ngxService.stop();
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
    this.productService.getAllProducts().pipe(map((products : any) => {
      return products.data.filter((product : any) => product.category === value);
    }))
    .subscribe(
      (response: any) => {
        
        this.productsByCategorySelected = response;
        console.log('Productos por categoria: '+ this.productsByCategorySelected);
        console.log('valor que le entra: '+ value);
        this.invoiceForm.controls['cost_price_at_time'].setValue('');
        this.invoiceForm.controls['quantity'].setValue('');
        this.invoiceForm.controls['sale_price_at_time'].setValue(0);

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

  getProductDetails(value:any) {
    //var currency_type: any;
    this.productService.getAllProducts().pipe(
      map((products: any) => {
      return products.data.filter((product : any) => product.id === value)
    }))
    .subscribe(
      (response: any) => {

        this.productDetail = response;

        console.log(this.productDetail);

        this.productDetail.forEach((element:any) => {
          this.price = element.sale_price;
          console.log('este es el precio:' + this.price);
          this.productStockQuantity = element.stock;
        });
      
        //console.log(this.productStockQuantity);
        this.invoiceForm.controls['cost_price_at_time'].setValue(this.price);
        this.invoiceForm.controls['quantity'].setValue('1');
        this.invoiceForm.controls['sale_price_at_time'].setValue(this.price * 1);

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
    var temp = this.invoiceForm.controls['quantity'].value;
    
    if(temp > 0 && temp <= this.productStockQuantity){
      this.invoiceForm.controls['sale_price_at_time'].setValue(this.invoiceForm.controls['quantity'].value * this.invoiceForm.controls['cost_price_at_time'].value);
    }
    else if (temp > this.productStockQuantity) {
      this._coreService.openFailureSnackBar(GlobalConstants.stock, GlobalConstants.error);
    }
    else if (temp != '') {
      this.invoiceForm.controls['quantity'].setValue('1');
      this.invoiceForm.controls['sale_price_at_time'].setValue(this.invoiceForm.controls['quantity'].value * this.invoiceForm.controls['cost_price_at_time'].value);
    } 

    // establece la cantidad de productos que va a comprar
    this.productQuantity = temp;

    console.log(this.productQuantity);

  }

  validateAddProduct() {
    if( this.invoiceForm.controls['sale_price_at_time'].value === 0 || this.invoiceForm.controls['cost_price_at_time'].value === null || 
        this.invoiceForm.controls['quantity'].value <= 0) {
     return true;
    } else 
     return false;
  }

  addProductToSaleList() {
    var invoiceDetailFormData = this.invoiceForm.value;
    var temp = this.invoiceForm.controls['iva'].value;
    //var twoPlaces = Number.toFied(2)x;

    var productName = this.dataSource.find((e: {product : any}) => e.product === invoiceDetailFormData.product);
    //console.log(productName);

    if( productName ===  undefined && this.productQuantity <= this.productStockQuantity) {

      this.totalAmount = this.totalAmount + invoiceDetailFormData.sale_price_at_time;
      var totalAmountValue = this.totalAmount.toFixed(2);
      this.ivatMount = this.totalAmount * temp;

      //var iva = this.ivatMount.toFixed(2);
      //this.ivatMount.toFixed(2);

      this.netAmount = parseFloat(totalAmountValue) + this.ivatMount;

      var netTotal = this.netAmount.toFixed(2);
      this.invoiceForm.controls['sale_price_at_time'].setValue(totalAmountValue);
      this.invoiceForm.controls['total'].setValue(netTotal);

      this.dataSource.push({
        //id: invoiceDetailFormData.product,
        product:invoiceDetailFormData.product, 
        quantity:+invoiceDetailFormData.quantity, 
        cost_price_at_time:invoiceDetailFormData.cost_price_at_time, 
        sale_price_at_time:invoiceDetailFormData.sale_price_at_time
      })

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

  validateForm() {
    return this.netAmount !== 0 && this.invoiceForm.valid;
  }

  validateSubmit() {
    this.isSubmitDisabled = !this.validateForm();
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

  getCustomerInfo(value : any) {
    this._customerService.getAllCustomers().pipe(map((customers : any) => {
      return customers.data.filter((customer : any) => customer.id === value);
    }))
    .subscribe(
      (response: any) => {
        
        this.customerDetail = response;
        console.log(this.customerDetail)

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

  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.sale_price_at_time;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource]
    this.invoiceForm.controls['sale_price_at_time'].reset();
    this.invoiceForm.controls['total'].reset();
  }

  submitAction() {
    var billFormData = this.invoiceForm.value;
    //var billDetailFormData = this.invoiceDetailForm.value;
    var businessId = this.authService.getUserInfo().business.id;

    var dateSelected = this.invoiceForm.controls['invoice_date'].value
    console.log(dateSelected)
    var selectedDate = this.datePipe.transform(dateSelected, "YYYY-MM-dd");

    //var phoneNumberValue = this.invoiceForm.controls['phoneNumber'].value;

    //console.log(selectedDate);

    /* var customerInfo = {
      id: this.customerDetail.id,
      first_name: this.customerDetail.first_name,
      last_name : this.customerDetail.last_name,
      email: this.customerDetail.email,
      phone: this.customerDetail.phone,
      c_adress: this.customerDetail.c_adress
    } */

    var invoiceData = {
      invoice_number : billFormData.invoice_number,
      invoice_date : billFormData.invoice_date,
      sub_total:billFormData.sale_price_at_time,
      iva: billFormData.iva,
      total: billFormData.total,
      customer: billFormData.customer_name,
      business: businessId,
      payment_type: billFormData.payment_type,
      sale: this.dataSource,
    }

    console.log(invoiceData);

    this._billService.createNewInvoice(invoiceData).subscribe(
      (response:any) => {
        console.log(invoiceData);
        this.responseMessage = response.message;
        console.log(this.responseMessage);
        swal.fire(
          'Venta registrada',
          'Número de Factura: '+ billFormData.invoice_number,
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

    //this._billService.addNewSale()

    this.invoiceForm.reset();
    this.dataSource = [];
    this.totalAmount = 0;
    this.ngOnInit();
  }
}
