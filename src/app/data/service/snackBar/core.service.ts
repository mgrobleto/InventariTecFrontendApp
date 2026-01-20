import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarCardComponent } from 'src/app/shared/components/snackbar-card/snackbar-card.component';

@Injectable({
  providedIn: 'root',
})
export class CoreService {

  constructor(private _snackBar: MatSnackBar) { }

  openSuccessSnackBar(message: string, action: string = 'Continue') {
    const isErrorAction = action?.toLowerCase() === 'error';

    if (isErrorAction) {
      this.openFailureSnackBar(message);
      return;
    }

    this._snackBar.openFromComponent(SnackbarCardComponent, {
      duration: 2500,
      panelClass: ['snackbar-card-overlay'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
      data: {
        type: 'success',
        title: 'Success',
        message,
        action,
      },
    });
  }

  openFailureSnackBar(message: string, action: string = 'Try again') {
    this._snackBar.openFromComponent(SnackbarCardComponent, {
      duration: 3500,
      panelClass: ['snackbar-card-overlay'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
      data: {
        type: 'error',
        title: 'Error',
        message,
        action,
      },
    });
  }
}

