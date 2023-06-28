import { Component, OnInit , Inject, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/productService/product.service';
import { CoreService } from 'src/app/components/shared/core.service';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { CategoriesService } from 'src/app/services/categoryService/categories.service';
import { BillService } from 'src/app/services/salesService/sales.service';

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
    private _categoryService : CategoriesService,
    public _dialogRef : MatDialogRef<AddEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService,
    private _billService : BillService,
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
      currency: [null,[Validators.required]],
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
    this.getCurrencyType();
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
        this._coreService.openSuccessSnackBar(this.responseMessage, GlobalConstants.error);
      }
    )
  }

  getCurrencyType() {
    this._billService.getCurrencyType().subscribe(
      (response: any) => {
        console.log(response);
        this.currencies = response;
      }, (error : any) => {
        console.log(error.error?.message);
        if(error.message?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
      );
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
      currency: formData.currency,
      cost : formData.cost,
      price : formData.price,
      category : formData.category
    }

    var stockData = {
      productName: formData.name,
      stock : formData.stock,
    }

    console.log(data);

    this._productService.addProduct(data).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = response.message;
        this._coreService.openSuccessSnackBar("Producto agregado", "con éxito!");
      },
      (error) => {
        console.log(data);
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );

    this._productService.addProductStock(stockData).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = response.message;
        this._coreService.openSuccessSnackBar("Producto agregado", "con éxito!");
      },
      (error) => {
        console.log(data);
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
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
        this._coreService.openSuccessSnackBar("Producto actualizado", "con éxito");
      },
      (error) => {
        if(error.message?.message){
          this.responseMessage = error.message?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openFailureSnackBar(this.responseMessage, GlobalConstants.error);
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
