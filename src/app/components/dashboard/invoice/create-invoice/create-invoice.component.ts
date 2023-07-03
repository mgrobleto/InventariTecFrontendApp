import { Component, OnInit, Inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/productService/product.service';
import { CategoriesService } from 'src/app/services/categoryService/categories.service';
import { CoreService } from 'src/app/services/snackBar/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { map } from 'rxjs';
import { BillService } from 'src/app/services/salesService/sales.service';
import { CustomerService } from 'src/app/services/customerService/customer.service';
import { DatePipe} from '@angular/common';
import swal from'sweetalert2';

interface productStock {
  productName: String,
  stock: Number,
}

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers: [DatePipe]
})
export class CreateInvoiceComponent implements OnInit {

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
  billState:any= [];
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
  billDate:any;


  constructor(
    private _fb : FormBuilder,
    private productService : ProductService, 
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _categoryService : CategoriesService,
    private _billService : BillService,
    private _customerService : CustomerService,
    private datePipe: DatePipe,
  ) { 
    
  }

  generateBillId() {
    this.billDate = new Date();
    this.billDate = this.billDate.getTime().toString();
    console.log(this.billDate)
    this.invoiceForm.controls['billNumber'].setValue(this.billDate)
  }

  ngOnInit(): void {

    var myDate = new Date();

    this.invoiceForm = this._fb.group({
      billNumber: [null, [Validators.required]],
      customer_name: [null,[Validators.required]],
      customer_type: [null,[Validators.required]],
      phoneNumber: [null,[Validators.required]],
      sub_total: [null,[Validators.required]],
      iva: [null,[Validators.required]],
      total: [null,[Validators.required]],
      currency_type: [null],
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
    })

    this.ngxService.start();
    this.generateBillId();
    this.getProductsCategories();
    this.getCustomersType();
    this.getPaymentType();
    this.getCurrencyType();
    this.getMonth();
    this.getYear();
    this.getBillState();

    this.invoiceForm.controls['iva'].setValue(0.0);
    console.log(this.invoiceForm.controls['iva'].value);

    this.billDate = this.datePipe.transform(myDate, "YYYY-MM-dd");
    this.invoiceForm.controls['created_at'].setValue(this.billDate);
    console.log(this.billDate);
  }
  
  getCustomersType() {
    this._customerService.getCustomerType().subscribe(
      (resp : any) => {
        this.customerType = resp;
      }, (err : any) => {
        console.log(err);
        if(err.message?.message){
          this.responseMessage = err.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  getPaymentType() {
    this._billService.getPaymentMethod().subscribe(
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

  getCurrencyType() {
    this._billService.getCurrencyType().subscribe(
      (resp : any) => {
        this.currency = resp;
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

  getMonth() {
    this._billService.getMonth().subscribe(
      (resp : any) => {
        resp.forEach((element:any) => {
          this.month = element.name;
        });
        this.invoiceForm.controls['id_month'].setValue(this.month);
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

  getYear() {
    this._billService.getYear().subscribe(
      (resp : any) => {
        resp.forEach((element:any) => {
          this.year = element.name;
        });
        this.invoiceForm.controls['id_year'].setValue(this.year);
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

  getBillState(){
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
  }

  getProductsCategories() {
    this._categoryService.getProductsCategories().subscribe(
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
    this.productService.getAllProducts().pipe( map( (product: any) => {
      return product.filter((product : any) => product.category === value)
    })).subscribe(
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

    var currency_type: any;

    this.productService.getAllProducts().pipe( map( (product: any) => {
      return product.filter((product : any) => product.name === value)
    })).subscribe(
      (response: any) => {
        this.productDetail = response;
        console.log(this.productDetail);
        this.productDetail.forEach((element:any) => {
          this.price = element.price;
          currency_type = element.currency;
          this.productStockQuantity = element.stock;
        });
        //console.log(this.productStockQuantity);
        this.invoiceForm.controls['price'].setValue(this.price);
        this.invoiceForm.controls['currency_type'].setValue(currency_type);
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

  addProductToBillList() {
    var billDetailFormData = this.invoiceForm.value;
    var temp = this.invoiceForm.controls['iva'].value;

    var productName = this.dataSource.find((e: {productName : any}) => e.productName === billDetailFormData.productName);
    //console.log(productName);

    if( productName ===  undefined && this.productQuantity <= this.productStockQuantity) {
      this.totalAmount = this.totalAmount + billDetailFormData.total_sale;
      this.ivatMount = this.totalAmount * temp;
      this.netAmount = this.totalAmount + this.ivatMount;
      this.invoiceForm.controls['sub_total'].setValue(this.totalAmount);
      this.invoiceForm.controls['total'].setValue(this.netAmount);
      this.dataSource.push({productName:billDetailFormData.productName, category:billDetailFormData.category, price:billDetailFormData.price, amount_products:billDetailFormData.amount_products, total_sale:billDetailFormData.total_sale})
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
    if(this.netAmount === 0 ||  this.invoiceForm.controls['customer_name'].value === null || this.invoiceForm.controls['customer_type'].value === null ||
       this.invoiceForm.controls['id_month'].value === null ||
      this.invoiceForm.controls['id_year'].value === null ||
      this.invoiceForm.controls['currency_type'].value === null ||
      this.invoiceForm.controls['payment_type'].value === null ||
      this.invoiceForm.controls['bill_state'].value === null) {
        return true;
    } else {
      return false;
    }
  }

  calculateIvaMount() {
    var temp = this.invoiceForm.controls['iva'].value;

    if(this.totalAmount > 0){
      this.ivatMount = this.totalAmount * temp;

      console.log(this.ivatMount);
  
      this.invoiceForm.controls['iva'].setValue(this.ivatMount);
      this.netAmount = this.totalAmount + this.ivatMount;
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

  updateProductStock() {

  }

  submitAction() {
    var billFormData = this.invoiceForm.value;
    //var billDetailFormData = this.invoiceDetailForm.value;

    var dateSelected = this.invoiceForm.controls['created_at'].value
    console.log(dateSelected)
    var selectedDate = this.datePipe.transform(dateSelected, "YYYY-MM-dd");

    //var phoneNumberValue = this.invoiceForm.controls['phoneNumber'].value;

    //console.log(selectedDate);

    var billData = {
      billNumber : billFormData.billNumber,
      customer_name: billFormData.customer_name,
      customer_type: billFormData.customer_type,
      phoneNumber: billFormData.phoneNumber,
      sub_total:billFormData.sub_total,
      iva: billFormData.iva,
      total: billFormData.total,
      currency_type: billFormData.currency_type,
      payment_type: billFormData.payment_type,
      id_month : billFormData.id_month,
      id_year:billFormData.id_year,
      created_at: selectedDate,
      bill_state: billFormData.bill_state,
      billItems: this.dataSource,
    }

    console.log(billData);

    this._billService.addNewBill(billData).subscribe(
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
        this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    )

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
