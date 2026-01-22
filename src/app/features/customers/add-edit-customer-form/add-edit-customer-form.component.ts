import { Component, Inject, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../../../shared/global-constants';
import swal from'sweetalert2';

import { CustomerService } from 'src/app/data/service/customerService/customer.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-add-edit-customer-form',
  templateUrl: './add-edit-customer-form.component.html',
  styleUrls: ['./add-edit-customer-form.component.scss']
})
export class AddEditCustomerFormComponent {

  onAddCustomer = new EventEmitter();
  onEditCustomer = new EventEmitter();

  dialogAction: any = 'Agregar';
  action: any = 'Agregar';

  customerForm:any = FormGroup;
  responseMessage: any;
  
  constructor
  (
    private customerService: CustomerService,
    private authService: AuthService,
    private _fb : FormBuilder,
    public _dialogRef : MatDialogRef<AddEditCustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {}

  ngOnInit(): void {
    this.customerForm = this._fb.group({
      first_name: [null,[Validators.required]],
      last_name: [null,[Validators.required]],
      email: [null,[Validators.required]],
      phone: [null,[Validators.required]],
      c_address: [null,[Validators.required]],
    });

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.customerForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Editar") 
    {
      this.editCustomerInfo();
    } else {
      this.addNewCustomer();
    }
  }

  addNewCustomer() {
    var formData = this.customerForm.value;
    var businessId = this.authService.getUserInfo().business.id;
    var data = 
    {
      first_name: formData.first_name,
      last_name : formData.last_name,
      email: formData.email,
      phone: formData.phone,
      c_address : formData.c_address,
      business: businessId
    }
    console.log(data);

    this.customerService.addNewCustomer(data)
    .subscribe
    (
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddCustomer.emit();
        swal.fire(
          '¡ Nuevo cliente agregado !',
          'Cliente: '+ formData.first_name + ' ' + formData.last_name,
          'success'
        )
        this.responseMessage = response.message;
      },
      (error) => {
        console.log(data);
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
      }
    );
  }

  editCustomerInfo() {
    var formData = this.customerForm.value;
    var data = 
    {
      customer_id : this.dialogData.data.id,
      first_name: formData.first_name,
      last_name : formData.last_name,
      email: formData.email,
      phone: formData.phone,
      c_address : formData.c_address,
      // id business
    }

    this.customerService.updateCustomerInfo(data)
    .subscribe
    (
      (response:any) => {
        this._dialogRef.close();
        this.onEditCustomer.emit();
        swal.fire(
          '¡ Información editada con éxito !',
          '',
          'success'
        )
        this.responseMessage = response.message;
        //this._coreService.openSuccessSnackBar("Producto actualizado", "con éxito");
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
    );
  }
}

