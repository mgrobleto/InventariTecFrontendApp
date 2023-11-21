import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import { ConfirmationDialog } from './components/confirmation-dialog/confirmation-dialog.component';
import {MatSelectModule} from '@angular/material/select'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {MatTabsModule} from '@angular/material/tabs';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {NgxPrintModule} from 'ngx-print';
import { MatStepperModule } from '@angular/material/stepper';
import { AddEditFormComponent } from './components/add-edit-form/add-edit-form.component'


@NgModule({
  declarations: [
    ConfirmationDialog,
    AddEditFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatTabsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxPrintModule,
    MatStepperModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatTabsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxPrintModule,
    MatStepperModule
  ],
  providers: [
    provideNgxMask(),
  ]
})
export class SharedModule { }
