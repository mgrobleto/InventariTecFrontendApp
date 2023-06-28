import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CoreService } from '../../shared/core.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoriesService } from 'src/app/services/categoryService/categories.service';
import { EquipmentService } from 'src/app/services/equipmentService/equipment.service';
import { AddEditEquipmentFormComponent } from './add-edit-equipment-form/add-edit-equipment-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/confirmation-dialog.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent {
  productDetails:any;
  equipmentCategories:any;
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Categoria', 'Editar', 'Eliminar'];

  constructor(
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _equipmentService : EquipmentService,
    private _categoriesService : CategoriesService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getEquipments();
  }

  

  openEditEquipmentForm(data : any) {
    const dialogRef = this.dialog.open(AddEditEquipmentFormComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getEquipments();
        }
      }
    });
  }

  getEquipments() {
    this._equipmentService.getAllEquipment().subscribe(
      (response: any) => {
        console.log(response);
        this.ngxService.stop();
        this.productDetails = new MatTableDataSource(response);
        //this.productDetails = response;
      }, (error : HttpErrorResponse) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
      );
  }

  getEquipmentCategories() {
    this._categoriesService.getEquipmentCategories().subscribe(
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

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.productDetails.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Agregar"
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditEquipmentFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddEquipment.subscribe((response) => {
      this.getEquipments();
    });
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(AddEditEquipmentFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditEquipment.subscribe((response) => {
      this.getEquipments();
    });
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar ' + values.name +' producto',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: string) {
      this._equipmentService.delete(id).subscribe(
        (response:any) => {
          this.ngxService.stop();
          this.getEquipments();
          this.responseMessage = response?.message;
          this._coreService.openSuccessSnackBar(this.responseMessage, "con exito");
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          this.ngxService.stop();
          console.log(error.error?.message);
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
        this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }
}
