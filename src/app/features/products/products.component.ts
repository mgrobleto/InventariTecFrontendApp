import {HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

import { ProductService } from 'src/app/data/service/productService/product.service';
import { ProductCategorieService } from 'src/app/data/service/productCategoryService/productCategories.service';
import { CoreService } from 'src/app/data/service/snackBar/core.service';
import { ExportToExcelService } from 'src/app/shared/service/export-to-excel.service';

import { AddEditFormComponent } from './components/add-edit-form/add-edit-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

import swal from'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit{

  dataSource = new MatTableDataSource<any>();
  originalData: any[] = []; // Store original data for filtering
  //productDetails:any;
  productsCategories:any;
  productStocks:any;
  responseMessage:any;
  displayedColumns: string[] = ['Nombre', 'Costo', 'Stock', 'Precio Total', 'Categoria', 'Estado', 'Editar', 'Eliminar'];
  displayedColumnsWithSelect: string[] = ['select', 'Nombre', 'Costo', 'Stock', 'Precio Total', 'Categoria', 'Estado', 'Editar', 'Eliminar'];
  productStockColumns: string[] = ['ID', 'Nombre', 'Stock','Editar'];

  // Selection
  selection = new SelectionModel<any>(true, []);

  // Filter properties
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';
  selectedPriceRange: string = 'all';
  selectedStore: string = 'all';
  selectedShowOption: string = 'all';
  selectedSortOption: string = 'default';

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  
  constructor(
    private productService : ProductService, 
    public router : Router,
    private dialog : MatDialog,
    private _coreService : CoreService,
    private ngxService: NgxUiLoaderService,
    private productCategoryService : ProductCategorieService,
    private excelExportService : ExportToExcelService
    ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllProducts();
    this.getProductsCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  exportToExcel() {
    const tableId = 'productsData';
    const columnsToInclude = ['ID', 'Nombre', 'Descripcion', 'Stock', 'Costo', 'Precio Total', 'Categoría']
    const fileName = 'Inventario Productos'

    this.excelExportService.ExportToExcelComponent(tableId, columnsToInclude, fileName);
  }
  

  openEditProductForm(data : any) {
    const dialogRef = this.dialog.open(AddEditFormComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getAllProducts();
        }
      }
    });
  }


  getAllProducts() {
    this.productService.getAllProducts()
    .subscribe
    (
      (response: any) => {

        console.log(response);
        this.ngxService.stop();
        this.originalData = response.data || [];
        // Map category IDs to category objects (this also updates dataSource.data)
        this.mapCategoriesToProducts();
        //this.productDetails = response;

      }, (error : any) => {

        this.ngxService.stop();
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

  getProductsCategories() {
    this.productCategoryService.getProductsCategories()
    .subscribe
    (
      (resp : any) => {

        console.log(resp);
        this.productsCategories = resp;
        // Map categories after categories are loaded
        this.mapCategoriesToProducts();

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

  mapCategoriesToProducts() {
    // Only map if both products and categories are loaded
    if (!this.originalData || !this.productsCategories?.data) {
      return;
    }

    // Create a map of category ID to category object for quick lookup
    const categoryMap = new Map();
    this.productsCategories.data.forEach((cat: any) => {
      categoryMap.set(cat.id, cat);
    });

    // Map category IDs to category objects in products
    this.originalData.forEach((product: any) => {
      // If category is just an ID (number or string), map it to the full category object
      if (product.category && typeof product.category !== 'object') {
        const categoryId = typeof product.category === 'string' ? parseInt(product.category) : product.category;
        product.category = categoryMap.get(categoryId) || null;
      }
      // If category is already an object but missing name, try to enrich it
      else if (product.category && product.category.id && !product.category.name) {
        const enrichedCategory = categoryMap.get(product.category.id);
        if (enrichedCategory) {
          product.category = enrichedCategory;
        }
      }
    });

    // Update the data source
    this.dataSource.data = [...this.originalData];
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    //this.productDetails.filter((value:any) => value.productsCategories.category).breadcrumb[0].replace()
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    try {
      console.log('Opening add product dialog...');
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action: "Guardar"
      };
      dialogConfig.width = "auto";
      dialogConfig.maxWidth = "90vw";
      dialogConfig.disableClose = false;
      dialogConfig.hasBackdrop = true;
      dialogConfig.panelClass = 'product-dialog';
      dialogConfig.autoFocus = true;
      dialogConfig.restoreFocus = true;
      
      const dialogRef = this.dialog.open(AddEditFormComponent, dialogConfig);
      console.log('Dialog opened:', dialogRef);
      
      // Check if dialog element exists in DOM
      /* setTimeout(() => {
        const dialogElement = document.querySelector('.cdk-overlay-pane.product-dialog');
        const dialogContainer = document.querySelector('.mat-mdc-dialog-container');
        console.log('Dialog element in DOM:', dialogElement);
        console.log('Dialog container in DOM:', dialogContainer);
        if (dialogElement) {
          console.log('Dialog element styles:', window.getComputedStyle(dialogElement));
        }
      }, 100); */
      
      if (dialogRef) {
        this.router.events.subscribe(() => {
          dialogRef.close();
        });

        const sub = dialogRef.componentInstance.onAddProduct.subscribe((response) => {
          this.getAllProducts();
          sub.unsubscribe();
        });
      } else {
        console.error('Dialog reference is null');
      }
    } catch (error) {
      console.error('Error opening dialog:', error);
      this._coreService.openSuccessSnackBar('Error al abrir el formulario', GlobalConstants.error);
    }
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: "Editar",
      data: values
    };
    dialogConfig.width = "auto";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.panelClass = 'product-dialog';
    
    const dialogRef = this.dialog.open(AddEditFormComponent, dialogConfig);
    
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.getAllProducts();
      sub.unsubscribe();
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
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id)
    .subscribe
    (
      (response:any) => {

        this.ngxService.stop();
        this.getAllProducts();
        this.responseMessage = response?.message;

        swal.fire(
          'El producto ha sido eliminado correctamente',
          this.responseMessage = response?.message,
          'success'
        )

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
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No pudimos completar la acción.',
          footer: this.responseMessage
        })

      }
    );
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  toggleSelectAll(event: any): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  toggleSelection(row: any): void {
    this.selection.toggle(row);
  }

  // Filter methods
  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  filterByPrice(priceRange: string): void {
    this.selectedPriceRange = priceRange;
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredData = [...this.originalData];

    // Category filter
    if (this.selectedCategory !== 'all') {
      filteredData = filteredData.filter(product => product.category?.id === this.selectedCategory);
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      // Assuming products have a status field, adjust based on your data structure
      filteredData = filteredData.filter(product => {
        const status = this.getProductStatus(product);
        return status === this.selectedStatus;
      });
    }

    // Price filter
    if (this.selectedPriceRange !== 'all') {
      const [min, max] = this.selectedPriceRange.split('-').map(v => v === '+' ? Infinity : parseFloat(v));
      filteredData = filteredData.filter(product => {
        const price = parseFloat(product.sale_price) || 0;
        if (this.selectedPriceRange === '200+') {
          return price >= 200;
        }
        return price >= min && price <= max;
      });
    }

    this.dataSource.data = filteredData;
  }

  getCategoryCount(categoryId: number): number {
    return this.originalData.filter(p => p.category?.id === categoryId).length;
  }

  // Status methods
  getProductStatus(product: any): string {
    // Adjust based on your product data structure
    // For now, assuming all products are active if no status field exists
    return product.status || 'active';
  }

  updateStatus(product: any, status: string): void {
    // TODO: Implement status update API call
    product.status = status;
    this._coreService.openSuccessSnackBar(`Estado actualizado a ${status === 'active' ? 'Activo' : 'Inactivo'}`, 'success');
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-empty';
    if (stock < 10) return 'stock-low';
    if (stock < 50) return 'stock-medium';
    return 'stock-high';
  }

  getCategoryName(product: any): string {
    // If category is an object with name property
    if (product.category && typeof product.category === 'object' && product.category.name) {
      return product.category.name;
    }
    // If category is just an ID, try to find it in categories list
    if (product.category && this.productsCategories?.data) {
      const categoryId = typeof product.category === 'string' ? parseInt(product.category) : product.category;
      const category = this.productsCategories.data.find((cat: any) => cat.id === categoryId);
      if (category) {
        return category.name;
      }
    }
    return 'Sin categoría';
  }

}

