import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, Observable} from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { AuthService } from '../../services/auth.service';

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

 constructor(
  private fb : FormBuilder, 
  private _loginService : LoginService,
  private authService : AuthService,
  private _snackBar: MatSnackBar,
  private router: Router
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
 }

 ngOnInit(): void {
  //this.logOut();
 }

 login() {
  // Mark all fields as touched to show validation errors
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // Set loading state
  this.loading = true;

  this._loginService.login(this.form.value.username, this.form.value.password)
    .pipe(first())
    .subscribe({
      next: (data) => {
        console.log(data);
        this.loading = false;
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this._snackBar.open("Usuario o contraseña incorrectas", '', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        // Reset password field only, keep username
        this.form.get('password')?.reset();
        console.log(error);
      }
    });
 }

  redirectToRegister() {
    this.router.navigate(['/registration']);
  }

  redirectToRestorePasswordEmail() {
    this.router.navigate(['/restore-password']);
  }

}
