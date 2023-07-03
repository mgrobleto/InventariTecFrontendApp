import { Component, EventEmitter, OnInit , Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/components/shared/core.service';
import { GlobalConstants } from 'src/app/components/shared/global-constants';
import { CategoriesService } from 'src/app/services/categoryService/categories.service';
import { ProductService } from 'src/app/services/productService/product.service';
import swal from'sweetalert2';


@Component({
  selector: 'app-add-edit-stock',
  templateUrl: './add-edit-stock.component.html',
  styleUrls: ['./add-edit-stock.component.scss']
})
export class AddEditStockComponent implements OnInit {
  
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
    public _dialogRef : MatDialogRef<AddEditStockComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    //this.productForm.patchValue(this.data);
    this.productForm = this._fb.group({
      productName: [null, [Validators.required]],
      stock: [null,[Validators.required]],
    });
    //console.log(this.data);

    if(this.dialogData.action === "Editar") {
      this.dialogAction = "Editar";
      this.action = "Actualizar";
      this.productForm.patchValue(this.dialogData.data);
    }
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
      stock : formData.stock,
      cost : formData.cost,
      price : formData.price,
      category : formData.category
    }

    console.log(data);

    this._productService.addProduct(data).subscribe(
      (response:any) => {
        console.log(data);
        this._dialogRef.close();
        this.onAddProduct.emit();
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
    var formData = this.productForm.value;
    var data = {
      id : this.dialogData.data.id,
      productName: formData.productName,
      stock : formData.stock
    }

    this._productService.updateProductStock(data).subscribe(
      (response:any) => {
        this._dialogRef.close();
        this.onEditProduct.emit();
        swal.fire(
          'Stock actualizado!',
          'Producto: '+ formData.productName,
          'success'
        )
        this.responseMessage = response.message;
        //this._coreService.openSuccessSnackBar("Stock actualizado", "con éxito");
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
