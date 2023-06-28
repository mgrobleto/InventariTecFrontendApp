import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/components/shared/core.service';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { CategoriesService } from 'src/app/services/categoryService/categories.service';
import { EquipmentService } from 'src/app/services/equipmentService/equipment.service';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-equipment-form.component.html',
  styleUrls: ['./add-edit-equipment-form.component.scss']
})
export class AddEditEquipmentFormComponent implements OnInit {

  onAddEquipment = new EventEmitter();
  onEditEquipment = new EventEmitter();
/*   onEmitStatusChange = new EventEmitter();
 */  equipmentForm:any = FormGroup;
  dialogAction: any = 'Agregar';
  action: any = 'Agregar';
  responseMessage: any;
  equipmentCategories:any = [];
  
  constructor(
    private _fb : FormBuilder,
    private _equipmentService : EquipmentService,
    private _categoryService : CategoriesService,
    public _dialogRef : MatDialogRef<AddEditEquipmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    //this.productForm.patchValue(this.data);
    this.equipmentForm = this._fb.group({
      name: [null,[Validators.required]],
      category: [null,[Validators.required]],
    });
    //console.log(this.data);

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.equipmentForm.patchValue(this.dialogData.data);
    }

    this.getEquipmentCategories();
  }

  getEquipmentCategories() {
    this._categoryService.getEquipmentCategories().subscribe(
      (resp : any) => {
        console.log(resp);
        this.equipmentCategories = resp;
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

  handleSubmit(){
    if(this.dialogAction === "Editar") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.equipmentForm.value;
    var data = {
      name: formData.name,
      category : formData.category,
    }

    this._equipmentService.addEquipment(data).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddEquipment.emit();
        this.responseMessage = response.message;
        this._coreService.openSuccessSnackBar(this.responseMessage, "con exito!");
      },
      (error) => {
        console.log(data);
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  edit() {
    var formData = this.equipmentForm.value;
    var data = {
      id : this.dialogData.data.id,
      name: formData.name,
      category : formData.category,
    }

    this._equipmentService.update(data).subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditEquipment.emit();
        this.responseMessage = response.message;
        this._coreService.openSuccessSnackBar(this.responseMessage, "con exito");
      },
      (error) => {
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
