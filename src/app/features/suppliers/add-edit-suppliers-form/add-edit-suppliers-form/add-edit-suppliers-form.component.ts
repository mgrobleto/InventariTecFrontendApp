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
  styleUrls: ['./add-edit-suppliers-form.component.scss'],
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
      first_name: [null,[Validators.required]],
      last_name: [null,[Validators.required]],
      email: [null,[Validators.required]],
      phone: [null,[Validators.required]],
      s_address: [null,[Validators.required]],
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
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      s_address : formData.s_address,
      business: businessId
    }
    console.log(data);

    this.supplierService.addNewSupplier(data)
    .subscribe
    (
      (response:any) => {
        console.log(data);
        const createdSupplier = response?.data || response?.supplier || response || data;
        this._dialogRef.close(createdSupplier);
        this.onAddSupplier.emit(createdSupplier);
        swal.fire(
          '¡ Nuevo proveedor agregado !',
          'Proveedor: '+ formData.first_name,
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

  editSupplierInfo() {
    var formData = this.supplierForm.value;
    var data = 
    {
      supplier_id : this.dialogData.data.id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      s_address : formData.s_address,
      //agregar id business
    }

    this.supplierService.updateSupplier(data)
    .subscribe
    (
      (response:any) => {
        const updatedSupplier = response?.data || response?.supplier || response || data;
        this._dialogRef.close(updatedSupplier);
        this.onEditSupplier.emit(updatedSupplier);
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

