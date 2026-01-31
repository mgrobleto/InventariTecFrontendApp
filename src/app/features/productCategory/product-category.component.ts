import {HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AddEditProductCategoryFormComponent } from './components/add-edit-form/add-edit-productCategory-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProductCategorieService } from 'src/app/data/service/productCategoryService/productCategories.service';
import { MatPaginator } from '@angular/material/paginator';
import { ExportToExcelService } from 'src/app/shared/service/export-to-excel.service';

import swal from'sweetalert2';


@Component({
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent {

  dataSource = new MatTableDataSource<any>();
  productsCategories:any;
  responseMessage:any;
  displayedColumns: string[] = ['ID', 'Nombre', 'Estado', 'Editar', 'Eliminar'];

  // Filter properties
  selectedShowOption: string = 'all';
  selectedSortOption: string = 'default';

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor(
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private _categoryService : ProductCategorieService,
    private excelExportService : ExportToExcelService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getProductsCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  
  openEditProductForm(data : any) {
    const dialogRef = this.dialog.open(AddEditProductCategoryFormComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getProductsCategories();
        }
      }
    });
  }

  getProductsCategories() {
    this._categoryService.getProductsCategories()
    .subscribe(
      (resp : any) => {
        console.log(resp);
        this.ngxService.stop();
        this.dataSource.data = resp.data;
      }, (err : any) => {
        this.ngxService.stop();
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const rows = (this.dataSource.filteredData?.length ? this.dataSource.filteredData : this.dataSource.data) || [];
    const exportRows = rows.map((row: any) => ({
      name: row?.name ?? row?.category ?? '',
      status: row?.status ?? ''
    }));

    const fileName = 'CategoriasProductos';
    const columns = [
      { header: 'Nombre', key: 'name', width: 24 },
      { header: 'Estado', key: 'status', width: 14 }
    ];

    this.excelExportService.exportJsonToExcel(exportRows, columns, fileName);
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Agregar"
    };
    dialogConfig.width = "auto";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.panelClass = 'category-dialog';
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    const dialogRef = this.dialog.open(AddEditProductCategoryFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProductCategory.subscribe((response) => {
      this.getProductsCategories();
    });
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:"Editar",
      data:values
    };
    dialogConfig.width = "auto";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.panelClass = 'category-dialog';
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    const dialogRef = this.dialog.open(AddEditProductCategoryFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProductCategory.subscribe((response) => {
      this.getProductsCategories();
    });
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'eliminar el ' + values.name +' producto',
      confirmation: true
    }
    dialogConfig.panelClass = 'confirmation-dialog';
    const dialogRef = this.dialog.open(ConfirmationDialog, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteCategory(values.id);
      dialogRef.close();
    })
  }

  deleteCategory(id: string) {
    this._categoryService.deleteProductCategory(id)
      .subscribe(
        (response:any) => {

          this.ngxService.stop();
          this.responseMessage = response?.message;

          swal.fire(
            'El producto ha sido eliminado correctamente',
            this.responseMessage = response?.message,
            'success'
          )

          this.getProductsCategories();
          //this._coreService.openSuccessSnackBar("Producto eliminado", "con exito");
        },
        (error : HttpErrorResponse) => {
          this.ngxService.stop();
          console.log(error.error?.message);
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No pudimos completar la acción.',
            footer: this.responseMessage
          })
        //this._coreService.openSuccessSnackBar(this.responseMessage,GlobalConstants.error);
      }
    );
  }

  // Status methods
  getCategoryStatus(category: any): string {
    // Adjust based on your category data structure
    // For now, assuming all categories are active if no status field exists
    return category.status || 'active';
  }

  updateStatus(category: any, status: string): void {
    // TODO: Implement status update API call
    category.status = status;
    this._coreService.openSuccessSnackBar(`Estado actualizado a ${status === 'active' ? 'Activo' : 'Inactivo'}`, 'success');
  }
}


