import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllBills(){
    return this.httpClient.get<any>(this.url + '/bill/');
  }

  getBillById(value: any) {
    return this.httpClient.get<any>(this.url + '/bill/' + value.id + '/');
  }

  getBillStatus(){
    return this.httpClient.get<any>(this.url + '/billState/')
  }

  getMonth(){
    return this.httpClient.get<any>(this.url + '/month/')
  }

  getYear(){
    return this.httpClient.get<any>(this.url + '/year/')
  }

  getCurrencyType(){
    return this.httpClient.get<any>(this.url + '/currencyType/')
  }

  getPaymentMethod(){
    return this.httpClient.get<any>(this.url + '/paymentType/')
  }

  addNewBill(billData: any) {
    return this.httpClient.post(this.url + '/bill/', billData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  addNewSale(billDetailData: any){
    return this.httpClient.post<any>(this.url + '/sale/', billDetailData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllSales(){
    return this.httpClient.get<any>(this.url + '/sale/');
  }

  addBillItems(data: any){
    return this.httpClient.post<any>(this.url + '/billItems/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getBillItems() : Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + '/bill/')
  }

  update(data:any) {
    return this.httpClient.put(this.url + '/customer/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  delete(id:string){
    return this.httpClient.delete(this.url + '/customer/' + id);
  }

  updateBillState(data:any) {
    return this.httpClient.put(this.url + '/bill/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
