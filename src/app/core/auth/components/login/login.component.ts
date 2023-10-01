import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, Observable} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loading = false;
  form : FormGroup;

  requestData$! : Observable<any>;

 constructor(private fb : FormBuilder, 
  private authService: AuthService,
  private _snackBar: MatSnackBar,
  private router: Router) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
 }

 ngOnInit(): void {
  this.logOut();
 }

 login() {
  this.authService.login(this.form.value.username, this.form.value.password).pipe(first()).subscribe(
    data => {
    this.loading = true;
    this.router.navigate(['dashboard']);
    console.log(data);
  },
  error => {
    this._snackBar.open("Usuario o contraseña incorrectas",'',{
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    this.form.reset();
    console.log(error);
  }
  )
 }

  logOut() {
    this.authService.logout();
  }

}
