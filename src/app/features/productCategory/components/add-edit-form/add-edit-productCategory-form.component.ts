import { Component, OnInit , Inject, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/data/service/productService/product.service';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { GlobalConstants } from '../../../../shared/global-constants';

import { ProductCategorieService } from 'src/app/data/service/productCategoryService/productCategories.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';

import swal from'sweetalert2';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-productCategory-form.component.html',
  styleUrls: ['./add-edit-productCategory-form.component.scss'
]
})
export class AddEditProductCategoryFormComponent implements OnInit {
  
  onAddProductCategory = new EventEmitter();
  onEditProductCategory = new EventEmitter();

  productCategoryForm:any = FormGroup;
  dialogAction: any = 'Guardar';
  action: any = 'Guardar';
  responseMessage: any;
  productsCategories:any = [];
  
  constructor(
    private _fb : FormBuilder,
    private productCategorieService : ProductCategorieService,
    private authService : AuthService,
    public _dialogRef : MatDialogRef<AddEditProductCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService,
  ) {}

  ngOnInit(): void {
    this.productCategoryForm = this._fb.group({
      name: [null,[Validators.required]],
    });

    if(this.dialogData.action === "Editar") 
    {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.productCategoryForm.patchValue({
        name: this.dialogData.data?.name ?? null,
      });
    }

    //this.getProductsCategories() ;
  }

  handleSubmit() {
    if(this.dialogAction === "Editar") {
      this.editProductCategory();
    } else {
      this.addProductCategory();
    }
  }

  addProductCategory() {
    var formData = this.productCategoryForm.value;
    var businessId = this.authService.getUserInfo().business.id;

    var data = {
      name: formData.name,
      business: businessId
    }
    console.log(data);

    this.productCategorieService.createNewCategory(data)
    .subscribe(

      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddProductCategory.emit();
        swal.fire(
          '¡ Nueva categoría registrada !',
          'Categoría: '+ formData.name,
          'success'
        )
        this.responseMessage = response.message;
        //this._coreService.openSuccessSnackBar("Producto agregado", "con éxito!");
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
        //this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  editProductCategory() {
    var formData = this.productCategoryForm.value;
    var data = {
      product_category_id : this.dialogData.data.id,
      name: formData.name,
    }

    this.productCategorieService.updateProductCategory(data)
    .subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditProductCategory.emit();
        swal.fire(
          '¡ Se ha actualizado !',
          'Categoría: '+ formData.name,
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

