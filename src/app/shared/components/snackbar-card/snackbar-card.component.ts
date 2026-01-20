import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type SnackbarCardType = 'success' | 'error';

export interface SnackbarCardData {
  type: SnackbarCardType;
  title: string;
  message: string;
  action: string;
}

@Component({
  selector: 'app-snackbar-card',
  templateUrl: './snackbar-card.component.html',
  styleUrls: ['./snackbar-card.component.scss'],
})
export class SnackbarCardComponent {
  constructor(
    private snackBarRef: MatSnackBarRef<SnackbarCardComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarCardData,
  ) {}

  close(): void {
    this.snackBarRef.dismiss();
  }
}
