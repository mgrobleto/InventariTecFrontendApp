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
  private readonly monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  monthReturned: any;
  currentMonth: any;
  monthSelect: any = FormGroup;
  userData: any = [];
  userName: string = '';
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
    const value = this.monthNames[this.currentMonth];
    console.log(value);

    if(this.monthSelect.controls['id_month'].value === null) {
      this.monthSelect.controls['id_month'].setValue(value);
      var initialValue = this.monthSelect.controls['id_month'].value;
      this.updateMonthData(initialValue);
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
    this.router.navigate(['products/'])
  }

  redirectToeEquipmentInventory(){
    this.router.navigate(['settings'])
  }

  getTotalProducts() {
    this._productService.getAllProducts().subscribe(
      (response : any) => {
        this.products = response?.data || [];
        this.totalProducts = this.products.length;
      }
    )
  }

  redirectToAddNewInvoice () {
    this.router.navigate(['/invoice/createNewInvoice']);
  }

  redirectToAddNewClient() {
    this.router.navigate(['/clients/']);
  }

  redirectToAddNewProduct() {
    this.router.navigate(['products'])
  }

  getMonthValues(value: any){
    this.monthReturned = value;
    console.log(value)
    this.updateMonthData(value);
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

  private updateMonthData(selectedMonth: string) {
    this._billService.getAllInvoices()
      .pipe(
        map((resp: any) => this.extractInvoices(resp)),
        map((invoices: any[]) => this.filterInvoicesByMonth(invoices, selectedMonth))
      )
      .subscribe(
        (filtered: any[]) => {
          this.billDetails = filtered;
          this.totalSales = filtered.length;
          this.totalIncome = filtered.reduce((sum, item) => {
            const total = Number(item?.total ?? 0);
            return sum + (Number.isFinite(total) ? total : 0);
          }, 0);

          const dailyTotals = this.buildDailyTotals(filtered);
          const chartData = dailyTotals.labels.length > 14
            ? this.buildWeeklyTotals(filtered)
            : dailyTotals;
          this.showGraphic(chartData.labels, chartData.data);
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

  private buildDailyTotals(invoices: any[]): { labels: string[]; data: number[] } {
    const totalsByDay = new Map<string, number>();

    invoices.forEach((invoice) => {
      const parsed = this.parseDate(invoice?.created_at ?? invoice?.invoice_date);
      if (!parsed) {
        return;
      }
      const key = this.datePipe.transform(parsed, 'yyyy-MM-dd');
      if (!key) {
        return;
      }
      const total = Number(invoice?.total ?? 0);
      const safeTotal = Number.isFinite(total) ? total : 0;
      totalsByDay.set(key, (totalsByDay.get(key) || 0) + safeTotal);
    });

    const sortedKeys = Array.from(totalsByDay.keys()).sort((a, b) => a.localeCompare(b));
    const labels = sortedKeys.map((key) => {
      const parsed = this.parseDate(key);
      return parsed ? (this.datePipe.transform(parsed, 'dd/MM') || '') : key;
    });
    const data = sortedKeys.map((key) => totalsByDay.get(key) || 0);

    return { labels, data };
  }

  private buildWeeklyTotals(invoices: any[]): { labels: string[]; data: number[] } {
    const totalsByWeek = new Map<string, number>();

    invoices.forEach((invoice) => {
      const parsed = this.parseDate(invoice?.created_at ?? invoice?.invoice_date);
      if (!parsed) {
        return;
      }
      const year = parsed.getFullYear();
      const month = parsed.getMonth(); // 0-based
      const weekNumber = Math.ceil(parsed.getDate() / 7);
      const key = `${year}-${month + 1}-W${weekNumber}`;
      const total = Number(invoice?.total ?? 0);
      const safeTotal = Number.isFinite(total) ? total : 0;
      totalsByWeek.set(key, (totalsByWeek.get(key) || 0) + safeTotal);
    });

    const sortedKeys = Array.from(totalsByWeek.keys()).sort((a, b) => a.localeCompare(b));
    const labels = sortedKeys.map((key) => {
      const weekLabel = key.split('-W')[1];
      return `Semana ${weekLabel}`;
    });
    const data = sortedKeys.map((key) => totalsByWeek.get(key) || 0);

    return { labels, data };
  }

  private extractInvoices(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }
    return response?.data || [];
  }

  private filterInvoicesByMonth(invoices: any[], monthName: string): any[] {
    if (!monthName) return invoices;
    return invoices.filter((invoice) => this.getInvoiceMonthName(invoice) === monthName);
  }

  private getInvoiceMonthName(invoice: any): string | null {
    const rawMonth = invoice?.id_month ?? invoice?.month ?? invoice?.month_name;

    if (rawMonth !== undefined && rawMonth !== null) {
      if (typeof rawMonth === 'number' && rawMonth >= 1 && rawMonth <= 12) {
        return this.monthNames[rawMonth - 1];
      }

      const asNumber = Number(rawMonth);
      if (Number.isFinite(asNumber) && asNumber >= 1 && asNumber <= 12) {
        return this.monthNames[asNumber - 1];
      }

      if (typeof rawMonth === 'string') {
        const normalized = rawMonth.toLowerCase();
        const match = this.monthNames.find((name) => name.toLowerCase() === normalized);
        if (match) {
          return match;
        }
      }
    }

    const parsed = this.parseDate(invoice?.created_at ?? invoice?.invoice_date);
    if (!parsed) {
      return null;
    }

    return this.monthNames[parsed.getMonth()];
  }

  private parseDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  private formatInvoiceDate(value: any): string {
    const parsed = this.parseDate(value);
    if (!parsed) return '';
    return this.datePipe.transform(parsed, 'dd/MM') || '';
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

