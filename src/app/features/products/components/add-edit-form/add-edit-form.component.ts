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
  templateUrl: './add-edit-form.component.html',
  styleUrls: ['./add-edit-form.component.scss'
]
})
export class AddEditFormComponent implements OnInit {
  
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();

  currencies:any;
  productForm:any = FormGroup;
  dialogAction: any = 'Agregar';
  action: any = 'Agregar';
  responseMessage: any;
  productsCategories:any = [];
  
  constructor(
    private _fb : FormBuilder,
    private _productService : ProductService,
    private productCategorieService : ProductCategorieService,
    private authService : AuthService,
    public _dialogRef : MatDialogRef<AddEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService,
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
      cost_price: [null,[Validators.required]],
      sale_price: [null,[Validators.required]],
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
    this.productCategorieService.getProductsCategories().subscribe(
      (resp : any) => {
        console.log(resp);
        this.productsCategories = resp.data;
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
      this.editProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    var formData = this.productForm.value;
    var businessId = this.authService.getUserInfo().business.id;
    var categoryID = this.productForm.controls['category'].value;

    var data = {
      name: formData.name,
      description : formData.description,
      stock: formData.stock,
      cost_price : formData.cost_price,
      sale_price : formData.sale_price,
      category : categoryID,
      business: businessId,
      with_iva : true
    }
    console.log(data);

    this._productService.addNewProduct(data).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddProduct.emit();
        swal.fire(
          '¡ Nuevo producto agregado al inventario !',
          'Producto: '+ formData.name,
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
          text: 'Algo salió mal!',
          footer: this.responseMessage
        })
        //this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  editProduct() {
    var formData = this.productForm.value;
    var categoryID = this.productForm.controls['category'].value;
    
    var data = {
      product_id : this.dialogData.data.id,
      name: formData.name,
      description : formData.description,
      stock: formData.stock,
      cost_price : formData.cost_price,
      sale_price : formData.sale_price,
      category : categoryID,
    }

    this._productService.updateProduct(data).subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditProduct.emit();
        swal.fire(
          '¡ Producto editado con éxito !',
          'Producto: '+ formData.name,
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
