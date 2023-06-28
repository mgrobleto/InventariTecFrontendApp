import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CoreService {

  constructor(private _snackBar: MatSnackBar) { }

  openSuccessSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
      panelClass: 'green-snackbar',
      verticalPosition: 'top',
    });
  }

  openFailureSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
      panelClass: 'red-snackbar',
      verticalPosition: 'top',
    });
  }
}
