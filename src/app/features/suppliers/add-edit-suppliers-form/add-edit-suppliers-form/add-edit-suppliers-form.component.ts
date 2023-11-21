import { Component, Inject, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../../../../shared/global-constants';
import swal from'sweetalert2';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { SuppliersService } from 'src/app/data/service/suppliersService/suppliers.service';

@Component({
  selector: 'app-add-edit-suppliers-form',
  templateUrl: './add-edit-suppliers-form.component.html',
  styleUrls: ['./add-edit-suppliers-form.component.css'],
})
export class AddEditSuppliersFormComponent {

  onAddSupplier = new EventEmitter();
  onEditSupplier = new EventEmitter();

  dialogAction: any = 'Agregar';
  action: any = 'Agregar';

  supplierForm:any = FormGroup;
  responseMessage: any;
  
  constructor
  (
    private authService: AuthService,
    private supplierService: SuppliersService,
    private _fb : FormBuilder,
    public _dialogRef : MatDialogRef<AddEditSuppliersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {}

  ngOnInit(): void {
    this.supplierForm = this._fb.group({
      fullName: [null,[Validators.required]],
      fullLastName: [null,[Validators.required]],
      email: [null,[Validators.required]],
      phoneNumber: [null,[Validators.required]],
      address: [null,[Validators.required]],
    });

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.supplierForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Editar") 
    {
      this.editSupplierInfo();
    } else {
      this.addNewSupplier();
    }
  }

  addNewSupplier() {
    var formData = this.supplierForm.value;
    var businessId = this.authService.getUserInfo().business.id;
    var data = 
    {
      name: formData.name,
      email: formData.email,
      phone: formData.phoneNumber,
      address : formData.address,
      businessId: businessId
    }
    console.log(data);

    this.supplierService.addNewSupplier(data)
    .subscribe
    (
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddSupplier.emit();
        swal.fire(
          '¡ Nuevo proveedor agregado !',
          'Proveedor: '+ formData.fullName,
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

  editSupplierInfo() {
    var formData = this.supplierForm.value;
    var data = 
    {
      id : this.dialogData.data.id,
      name: formData.name,
      fullLastName : formData.fullLastName,
      email: formData.email,
      phone: formData.phoneNumber,
      address : formData.address,
      //agregar id business
    }

    this.supplierService.updateSupplier(data)
    .subscribe
    (
      (response:any) => {
        this._dialogRef.close();
        this.onEditSupplier.emit();
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
