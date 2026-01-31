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
  previewLogoUrl = '';
  createdAt: Date = new Date();

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
    const userInfo = this.authService.getUserInfo();
    const baseInvoiceNumber = Number(userInfo?.business?.invoice_number);
    const businessId = userInfo?.business?.id;
    const storageKey = businessId ? `invoice_counter_offset_${businessId}` : 'invoice_counter_offset_default';
    const storedOffset = Number(localStorage.getItem(storageKey));
    const safeBase = Number.isFinite(baseInvoiceNumber) ? baseInvoiceNumber : 1;
    const safeOffset = Number.isFinite(storedOffset) ? storedOffset : 0;

    this.invoiceForm.controls['invoice_number'].setValue(safeBase + safeOffset);
  }

  private incrementInvoiceCounter(): void {
    const userInfo = this.authService.getUserInfo();
    const businessId = userInfo?.business?.id;
    const storageKey = businessId ? `invoice_counter_offset_${businessId}` : 'invoice_counter_offset_default';
    const storedOffset = Number(localStorage.getItem(storageKey));
    const safeOffset = Number.isFinite(storedOffset) ? storedOffset : 0;
    localStorage.setItem(storageKey, String(safeOffset + 1));
  }

  ngOnInit(): void {
    this.previewLogoUrl = new URL('assets/tecnorefill-logo.png', document.baseURI).toString();

    var myDate = new Date();
    this.createdAt = myDate;

    this.invoiceForm = this._fb.group({
      invoice_number: [null, [Validators.required]],
      invoice_date: [null, [Validators.required]],
      customer_name: [null,[Validators.required]],
      //phoneNumber: [null,[Validators.required]],
      //sub_total: [null,[Validators.required]],
      iva: [0],
      total: [null,[Validators.required]],
      payment_type: [null,[Validators.required]],
      product: [null,[Validators.required]],
      category: [null,[Validators.required]],
      cost_price_at_time: [null,[Validators.required]],
      quantity: [null,[Validators.required]],
      sale_price_at_time: [null,[Validators.required]],
      description: [''],
      currency: ['NIO'], // Add currency field
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


    this.invoiceForm.controls['iva'].setValue(0);
    this.invoiceForm.controls['currency'].setValue('NIO');
    this.invoiceForm.controls['currency'].disable();

    this.invoiceForm.controls['invoice_date'].setValue(
      this.datePipe.transform(myDate, "YYYY-MM-dd")
    );

    this.invoiceForm.get('quantity')?.valueChanges.subscribe(() => {
      this.updateLineSubtotal();
    });
    this.invoiceForm.get('cost_price_at_time')?.valueChanges.subscribe(() => {
      this.updateLineSubtotal();
    });

    this.invoiceForm.valueChanges.subscribe(() => {
      this.validateSubmit();
    });
    
    //console.log(this.billDate);
  }

  onDueDateChange(event: any): void {
    const selected = event?.value as Date | null;
    if (!selected) {
      return;
    }

    // Keep due date as date-only (no time)
    const normalized = this.datePipe.transform(selected, 'YYYY-MM-dd');
    if (normalized) {
      this.invoiceForm.controls['invoice_date'].setValue(normalized);
    }
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
    dialogConfig.width = "650px";
    dialogConfig.panelClass = "customer-dialog";
    const dialogRef = this.dialog.open(AddEditCustomerFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.componentInstance.onAddCustomer.subscribe((createdCustomer: any) => {
      this.getCustomers(createdCustomer);
    });
  }

  getCustomers(selectedCustomer?: any) {
    this._customerService.getAllCustomers().subscribe(
      (resp) => {
        this.customers = resp.data;
        if (selectedCustomer) {
          const selectedId = typeof selectedCustomer === 'object'
            ? (selectedCustomer?.id || this.customers.find((customer: any) =>
                customer.email === selectedCustomer?.email ||
                customer.phone === selectedCustomer?.phone
              )?.id)
            : selectedCustomer;
          if (selectedId) {
            this.invoiceForm.controls['customer_name'].setValue(selectedId);
            this.getCustomerInfo(selectedId);
          }
        }
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
      this.updateLineSubtotal();
    }
    else if (temp > this.productStockQuantity) {
      this._coreService.openFailureSnackBar(GlobalConstants.stock, GlobalConstants.error);
    }
    else if (temp != '') {
      this.invoiceForm.controls['quantity'].setValue('1');
      this.updateLineSubtotal();
    } 

    // establece la cantidad de productos que va a comprar
    this.productQuantity = temp;

    console.log(this.productQuantity);

  }

  private updateLineSubtotal(): void {
    const quantity = Number(this.invoiceForm.controls['quantity']?.value || 0);
    const price = Number(this.invoiceForm.controls['cost_price_at_time']?.value || 0);
    const subtotal = quantity * price;
    this.invoiceForm.controls['sale_price_at_time']?.setValue(subtotal);
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

    var productName = this.dataSource.find((e: {product : any}) => e.product === invoiceDetailFormData.product);
    //console.log(productName);

    if( productName ===  undefined && this.productQuantity <= this.productStockQuantity) {

      this.dataSource.push({
        //id: invoiceDetailFormData.product,
        product:invoiceDetailFormData.product, 
        quantity:+invoiceDetailFormData.quantity, 
        cost_price_at_time:invoiceDetailFormData.cost_price_at_time, 
        sale_price_at_time:invoiceDetailFormData.sale_price_at_time,
        description: invoiceDetailFormData.description || ''
      })

      this.dataSource = [...this.dataSource]
      this.recalculateTotals();
      //this._coreService.openSuccessSnackBar(GlobalConstants.productAdded, "con exito");
      //this.productQuantity = 0;

    } else if(this.productQuantity > this.productStockQuantity) {
      this._coreService.openSuccessSnackBar(GlobalConstants.stock, GlobalConstants.error);
    } else
    {
      this._coreService.openSuccessSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
    this.validateSubmit();
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
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource]
    this.recalculateTotals();
    this.validateSubmit();
  }

  updateCartItem(item: any): void {
    const quantity = Number(item?.quantity || 0);
    const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
    if (safeQuantity !== quantity) {
      item.quantity = safeQuantity;
    }

    const price = Number(item?.cost_price_at_time || 0);
    item.sale_price_at_time = Number((safeQuantity * price).toFixed(2));

    this.dataSource = [...this.dataSource];
    this.recalculateTotals();
    this.validateSubmit();
  }

  private recalculateTotals(): void {
    this.totalAmount = this.dataSource.reduce((sum: number, item: any) => sum + (item.sale_price_at_time || 0), 0);
    const totalAmountValue = Number(this.totalAmount.toFixed(2));
    this.ivatMount = 0;
    this.netAmount = totalAmountValue;
    this.invoiceForm.controls['sale_price_at_time'].setValue(totalAmountValue);
    this.invoiceForm.controls['total'].setValue(totalAmountValue);
    this.invoiceForm.controls['iva'].setValue(0);
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
      iva: 0,
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
        this.incrementInvoiceCounter();

        this.invoiceForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
        this.ngOnInit();
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
    )

    //this._billService.addNewSale()

  }

  // Preview helper methods
  getClientName(): string {
    if (this.customerDetail && this.customerDetail[0]) {
      return `${this.customerDetail[0].first_name} ${this.customerDetail[0].last_name}`;
    }
    return '';
  }

  getClientAddress(): string {
    if (this.customerDetail && this.customerDetail[0]) {
      return this.customerDetail[0].c_adress || this.customerDetail[0].c_address || this.customerDetail[0].address || '';
    }
    return '';
  }

  getBusinessName(): string {
    try {
      const userInfo = this.authService.getUserInfo();
      return userInfo?.business?.name || 'Mi Empresa';
    } catch {
      return 'Mi Empresa';
    }
  }

  getBusinessInitial(): string {
    try {
      const userInfo = this.authService.getUserInfo();
      const name = userInfo?.business?.name || 'M';
      return name.charAt(0).toUpperCase();
    } catch {
      return 'M';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/invoice/allInvoices']);
  }

  cancelInvoice(): void {
    if (confirm('¿Está seguro que desea cancelar? Se perderán todos los datos no guardados.')) {
      this.goBack();
    }
  }

  saveDraft(): void {
    // TODO: Implement draft save functionality
    this._coreService.openSuccessSnackBar('Borrador guardado exitosamente', 'success');
  }
}

