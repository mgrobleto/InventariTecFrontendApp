import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceSalesService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  token = this.authService.getAuthToken();

  headerObj = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${this.token}`,
  })

  createNewInvoice(invoiceData: any) {
    return this.httpClient.post(this.url + '/invoice/create-invoice/', invoiceData, { headers: this.headerObj });
  }

  updateInvoice(invoiceData: any) {
    return this.httpClient.put(this.url + '/invoice/update-invoice/', invoiceData, { headers: this.headerObj  });
  }

  deleteInvoice(invoice_id: string) {
    const httpOptions = {
      headers: this.headerObj, 
      body: invoice_id
    }
    return this.httpClient.delete(this.url + '/invoice/delete-invoice/', httpOptions)
  }

  getAllInvoices(){
    return this.httpClient.get<any>(this.url + '/invoice/list-invoices/', { headers: this.headerObj });
  }

  addNewSale(invoiceDetailData: any){
    return this.httpClient.post<any>(this.url + '/sale/create-sale/', invoiceDetailData, { headers: this.headerObj });
  }

  // deberia de existir este endpoint? al eliminar una factura que se borre dicrectamente el sale referido a esa factura
  //deleteSale() {}

  getTotalSales() {
    return this.httpClient.get(this.url + '/invoice/total-sales-invoice/', { headers: this.headerObj });
  }

  getAllSales(){
    return this.httpClient.get<any>(this.url + '/sale/');
  }
}
