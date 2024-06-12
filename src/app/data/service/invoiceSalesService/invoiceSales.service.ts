import { HttpClient, HttpHeaders, HttpBackend} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceSalesService {

  url = environment.apiUrl;
  token : string | null = null;

  constructor (
    private httpClient: HttpClient, 
    handler : HttpBackend, 
    private authService: AuthService
  ) { 
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
  }

  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  createNewInvoice(invoiceData: any) {
    this.refreshAuthToken();
    return this.httpClient.post(this.url + '/invoice/create-invoice/', invoiceData, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  updateInvoice(invoiceData: any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.url + '/invoice/update-invoice/', invoiceData, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  deleteInvoice(invoice_id: string) {
    this.refreshAuthToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${this.token}`,
      }),  
      body: invoice_id
    }
    return this.httpClient.delete(this.url + '/invoice/delete-invoice/', httpOptions)
  }

  getAllInvoices() {
    this.refreshAuthToken();
    return this.httpClient.get<any>(this.url + '/invoice/list-invoices/', { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  addNewSale(invoiceDetailData: any) {
    this.refreshAuthToken();
    return this.httpClient.post<any>(this.url + '/sale/create-sale/', invoiceDetailData, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  // deberia de existir este endpoint? al eliminar una factura que se borre dicrectamente el sale referido a esa factura
  //deleteSale() {}

  getTotalSales() {
    this.refreshAuthToken();
    return this.httpClient.get(this.url + '/invoice/total-sales-invoice/', { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  getAllSales() {
    return this.httpClient.get<any>(this.url + '/sale/');
  }
}
