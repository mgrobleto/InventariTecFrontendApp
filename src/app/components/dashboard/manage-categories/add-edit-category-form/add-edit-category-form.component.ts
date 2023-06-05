import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/components/shared/core.service';
import { GlobalConstants } from 'src/app/components/shared/global-constants';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-category-form.component.html',
  styleUrls: ['./add-edit-category-form.component.scss']
})
export class AddEditCategoryFormComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
/*   onEmitStatusChange = new EventEmitter();
 */  categoryForm:any = FormGroup;
  dialogAction: any = 'Agregar';
  action: any = 'Agregar';
  responseMessage: any;
  productsCategories:any = [];
  
  constructor(
    private _fb : FormBuilder,
    private _categoryService : CategoriesService,
    public _dialogRef : MatDialogRef<AddEditCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    //this.productForm.patchValue(this.data);
    this.categoryForm = this._fb.group({
      name: [null,[Validators.required]],
      description: [null,[Validators.required]],
    });
    //console.log(this.data);

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.categoryForm.patchValue(this.dialogData.data);
    }

    //this.getProductsCategories() ;
  }

  getProductsCategories() {
    this._categoryService.getProductsCategories().subscribe(
      (resp : any) => {
        console.log(resp);
        this.productsCategories = resp;
      }, (err : any) => {
        console.log(err);
        if(err.message?.message){
          this.responseMessage = err.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSnackBar(this.responseMessage, GlobalConstants.error);
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
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name,
      description : formData.description,
    }

    this._categoryService.addCategory(data).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response.message;
        this._coreService.openSnackBar(this.responseMessage, "con exito!");
      },
      (error) => {
        console.log(data);
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  edit() {
    var formData = this.categoryForm.value;
    var data = {
      id : this.dialogData.data.id,
      name: formData.name,
      description : formData.description,
    }

    this._categoryService.update(data).subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response.message;
        this._coreService.openSnackBar(this.responseMessage, "con exito");
      },
      (error) => {
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
