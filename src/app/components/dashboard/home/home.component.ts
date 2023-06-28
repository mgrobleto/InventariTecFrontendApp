import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BillService } from 'src/app/services/salesService/sales.service';
import { ProductService } from 'src/app/services/productService/product.service';
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../../shared/global-constants';
import { CoreService } from '../../shared/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalIncome:string="0";
  totalSales:string="0";
  totalProducts:string="0";
  billDate: any;
  billDetails:any;
  responseMessage: any;
  month: any;
  monthReturned: any;
  currentMonth: any;
  monthSelect: any = FormGroup;

  constructor(
    private _billService:BillService,
    private _productService:ProductService,
    private datePipe: DatePipe,
    private _coreService: CoreService,
    private _fb : FormBuilder,
  ){}

  ngOnInit(): void {

    this.getMonth();

    this.monthSelect = this._fb.group({
        id_month: [null,[Validators.required]],
      });

    this.currentMonth = new Date().getMonth();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    console.log(monthNames[this.currentMonth]);
    const value = monthNames[this.currentMonth];

    

    if(this.monthSelect.controls['id_month'].value === null) {
      this.monthSelect.controls['id_month'].setValue(value);
      var initialValue = this.monthSelect.controls['id_month'].value;
      this.getMonthValues(initialValue);
    }
  }

  getMonthValues(value: any){
    //var monthSelected = this.monthSelect.controls['id_month'].value;
    this.monthReturned = value;
    console.log(value)

    this.getTotalSalesByMonth(value);
  }


  getMonth() {
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
  }

  getTotalSalesByMonth(selectedMonth : any) {
    this._billService.getAllBills().pipe( map ( (resp : any) => {
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

  getTotalIncome() {

  }

  getMostSellProducts() {

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

    const barChart = new Chart('barChart',{
      type:'bar',
      data: {
        labels: labelGraphic,
        datasets:[{
          label:"Total",
          data: graphicData,
          backgroundColor:[
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive:true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
}
