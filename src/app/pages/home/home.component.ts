import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { InvoiceSalesService } from 'src/app/data/service/invoiceSalesService/invoiceSales.service';
import { ProductService } from 'src/app/data/service/productService/product.service';
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../../shared/global-constants';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalIncomes:any;
  totalIncome:number = 0;
  products:any[] = [];
  equipments:any[] = [];
  totalSalesByMonth:any[] = [];
  billItems:any[] = [];
  totalSales:any = 0;
  totalProducts:any;
  totalEquipments:any;
  billDate: any;
  billDetails:any;
  responseMessage: any;
  month: any;
  monthReturned: any;
  currentMonth: any;
  monthSelect: any = FormGroup;
  userData: any = [];
  userName: number = 0;
  barChart: any

  constructor(
    private authService: AuthService,
    private _billService:InvoiceSalesService,
    private _productService:ProductService,
    private datePipe: DatePipe,
    private _coreService: CoreService,
    private _fb : FormBuilder,
    public router : Router,
  ){}

  ngOnInit(): void {

    this.getUserInfo();
    this.getTotalProducts();
    this.initializeMonths();

    this.monthSelect = this._fb.group({
        id_month: [null,[Validators.required]],
      });

    this.currentMonth = new Date().getMonth();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const value = monthNames[this.currentMonth];
    console.log(value);

    if(this.monthSelect.controls['id_month'].value === null) {
      this.monthSelect.controls['id_month'].setValue(value);
      var initialValue = this.monthSelect.controls['id_month'].value;
      this.getMonthValues(initialValue);
      this.getTotalSales(initialValue);
      this.getTotalIncomeByMonth(initialValue);
    }
  }

  initializeMonths() {
    this.month = [
      { name: "Enero" },
      { name: "Febrero" },
      { name: "Marzo" },
      { name: "Abril" },
      { name: "Mayo" },
      { name: "Junio" },
      { name: "Julio" },
      { name: "Agosto" },
      { name: "Septiembre" },
      { name: "Octubre" },
      { name: "Noviembre" },
      { name: "Diciembre" }
    ];
  }

  getUserInfo() {
   this.userData = this.authService.getUserInfo();
   this.userName = this.userData.business.name;
  }

  redirectToProductsInventory(){
    this.router.navigate(['dashboard/products/'])
  }

  redirectToeEquipmentInventory(){
    this.router.navigate(['dashboard/equipment'])
  }

  getTotalProducts() {
    this._productService.getAllProducts().subscribe(
      (response : any) => {
        this.products = response;
        this.totalProducts = this.products.length;
      }
    )
  }

  redirectToAddNewInvoice () {
    this.router.navigate(['/dashboard/invoice/createNewInvoice']);
  }

  redirectToAddNewClient() {
    this.router.navigate(['/dashboard/clients/']);
  }

  redirectToAddNewProduct() {
    this.router.navigate(['dashboard/products'])
  }

  getTotalSales(value : any) {

    this.totalSales = 0;
    var amount:any = 0;
    //this.totalSales = this._billService.getAllBills().pipe(map( resp => resp.billItems.length))

    this._billService.getAllInvoices().pipe( map ( (resp : any) => {
      return resp.filter((month : any) => month.id_month === value)
    })).subscribe(
      (response : any) => {

        response.forEach((items : any)=> {
          this.billItems = items.billItems;
          amount = this.billItems.length;
          this.totalSales += amount;
        })

        console.log(this.billItems.length);

        console.log(this.totalSales)
        
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
  }

  getTotalIncomeByMonth(value : any) {

    this.totalIncome = 0;
    var amount:any = 0;
    var incomeValue: any = 0;

    this._billService.getAllInvoices().pipe( map ( (resp : any) => {
      return resp.filter((month : any) => month.id_month === value)
    })).subscribe(
      (response : any) => {

        response.forEach((items : any)=> {
          this.totalIncomes = items.total;
          amount = parseFloat(this.totalIncomes);
          incomeValue += amount;
          this.totalIncome = incomeValue.toFixed(2)
        })

        //console.log(this.billItems.length);

        //console.log(this.totalSales)
        
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
  }

  getMonthValues(value: any){
    //var monthSelected = this.monthSelect.controls['id_month'].value;
    this.monthReturned = value;
    console.log(value)

    this.getTotalSalesByMonth(value);
  }


  /* getMonth() {
    this._billService.getMonth().subscribe(
      (resp : any) => {
        this.month = resp;
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

  getTotalSalesByMonth(selectedMonth : any) {
    this._billService.getAllInvoices().pipe( map ( (resp : any) => {
      return resp.filter((month : any) => month.id_month === selectedMonth)
    })).subscribe(
      (data : any) => {
        
        console.log(data);
        this.billDetails = data;
        console.log(this.billDetails);

        const labelTemp = this.billDetails.map((value:any) => value.created_at);
        //const labelTemp = this.datePipe.transform(this.billDetails.map((value:any) => value.created_at), "EEEE, MMMM d, y");
        const dataTemp = this.billDetails.map((value : any) => value.total);

        console.log(labelTemp);
        this.showGraphic(labelTemp, dataTemp);
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
  }

  showGraphic(labelGraphic:any[], graphicData:any[]){

    const labels = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo'
    ]

    if(this.barChart){
      this.barChart.destroy();
    }

    this.barChart = new Chart('barChart',{
      type:'bar',
      data: {
        labels: labelGraphic,
        datasets:[{
          label:"Total",
          data: graphicData,
          backgroundColor:[
            '#1E488F',
            '#9EC4FE',
            '#1E488F',
            '#9EC4FE',
            '#1E488F',
            '#9EC4FE',
            '#1E488F',
          ],
          borderColor: [
            '#001F3F',
            '#1E488F',
            '#001F3F',
            '#1E488F',
            '#001F3F',
            '#1E488F',
            '#001F3F',
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive:true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#1E488F'
            },
            grid: {
              color: 'rgba(30, 72, 143, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#1E488F'
            },
            grid: {
              color: 'rgba(30, 72, 143, 0.1)'
            }
          }
        }
      }
    });

  }

  getProductsPercent(): number {
    const total = (this.totalProducts || 0) + (this.totalSales || 0);
    if (total === 0) return 50;
    return ((this.totalProducts || 0) / total) * 100;
  }

  getSalesPercent(): number {
    const total = (this.totalProducts || 0) + (this.totalSales || 0);
    if (total === 0) return 50;
    return ((this.totalSales || 0) / total) * 100;
  }

  getProductsDashArray(): string {
    const circumference = 2 * Math.PI * 80; // ≈ 502.65
    const productsPercent = this.getProductsPercent();
    const dashLength = (productsPercent / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getSalesDashArray(): string {
    const circumference = 2 * Math.PI * 80; // ≈ 502.65
    const salesPercent = this.getSalesPercent();
    const dashLength = (salesPercent / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getSalesDashOffset(): number {
    const circumference = 2 * Math.PI * 80; // ≈ 502.65
    const productsPercent = this.getProductsPercent();
    const productsDashLength = (productsPercent / 100) * circumference;
    // Start sales segment after products segment
    return 125.66 - productsDashLength; // 125.66 is 1/4 of circumference (starting at top)
  }
  
}
