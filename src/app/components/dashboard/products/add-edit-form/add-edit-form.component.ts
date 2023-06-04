import { Component, OnInit , Inject, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { CoreService } from 'src/app/components/shared/core.service';
import { GlobalConstants } from 'src/app/components/shared/global-constants';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-form.component.html',
  styleUrls: ['./add-edit-form.component.scss']
})
export class AddEditFormComponent implements OnInit {
  
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
/*   onEmitStatusChange = new EventEmitter();
 */  productForm:any = FormGroup;
  dialogAction: any = 'Agregar';
  action: any = 'Agregar';
  responseMessage: any;
  productsCategories:any = [];
  
  constructor(
    private _fb : FormBuilder,
    private _productService : ProductService,
    private _categoryService : CategoriesService,
    public _dialogRef : MatDialogRef<AddEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService
  ) {
    /* this.productForm = this._fb.group({
      'name': '',
      'description': '',
      'stock': '',
      'cost': '',
      'price': '',
      'id_category': '',
    }); */
  }

  ngOnInit(): void {
    //this.productForm.patchValue(this.data);
    this.productForm = this._fb.group({
      name: [null,[Validators.required]],
      description: [null,[Validators.required]],
      stock: [null,[Validators.required]],
      cost: [null,[Validators.required]],
      price: [null,[Validators.required]],
      category: [null,[Validators.required]]
    });
    //console.log(this.data);

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.productForm.patchValue(this.dialogData.data);
    }

    this.getProductsCategories() ;
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
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      description : formData.description,
      stock : formData.stock,
      cost : formData.cost,
      price : formData.price,
      category : formData.category
    }

    this._productService.addProduct(data).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddProduct.emit();
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
    var formData = this.productForm.value;
    var data = {
      id : this.dialogData.data.id,
      name: formData.name,
      description : formData.description,
      stock : formData.stock,
      cost : formData.cost,
      price : formData.price,
      category : formData.category
    }

    this._productService.update(data).subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditProduct.emit();
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

 /*  onFormSubmit() {

    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      description : formData.description,
      stock : formData.stock,
      cost : formData.cost,
      price : formData.price,
      id_category : formData.id_category
    }

    if (this.productForm.valid) {
      if (this.dialogData) {
        this._productService
          .update(this.dialogData.id, this.productForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Producto actualizado!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._productService.addProduct(this.productForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Producto añadido exitosamente');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  } */

}
