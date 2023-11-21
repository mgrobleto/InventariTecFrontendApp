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
      fullName: [null,[Validators.required]],
      fullLastName: [null,[Validators.required]],
      email: [null,[Validators.required]],
      phoneNumber: [null,[Validators.required]],
      address: [null,[Validators.required]],
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
      fullName: formData.fullName,
      fullLastName : formData.fullLastName,
      email: formData.email,
      phone: formData.phoneNumber,
      address : formData.address,
      businessId: businessId
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
          'Cliente: '+ formData.fullName,
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
          text: 'Algo salió mal!',
          footer: this.responseMessage
        })
      }
    );
  }

  editCustomerInfo() {
    var formData = this.customerForm.value;
    var data = 
    {
      id : this.dialogData.data.id,
      fullName: formData.fullName,
      fullLastName : formData.fullLastName,
      email: formData.email,
      phone: formData.phoneNumber,
      address : formData.address,
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
          text: 'Algo salió mal!',
          footer: this.responseMessage
        })
        //this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}
