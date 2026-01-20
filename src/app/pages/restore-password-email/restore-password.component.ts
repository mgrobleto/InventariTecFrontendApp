import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RestorePasswordEmailService } from 'src/app/data/service/restore-password-email/restore-password-email.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent {
  hide = true;
  loading = false;
  form : FormGroup;

  constructor(
    private fb : FormBuilder, 
    private router: Router,
    private _resetPasswordService : RestorePasswordEmailService
    ) {
      this.form = this.fb.group({
        email: ["", Validators.required],
      });
   }

   sendEmail() {
    this._resetPasswordService.sendEmail(this.form.value.email).subscribe(
      resp => {
        Swal.fire(
          'Correo enviado exitosamente',
          'Revisa tu correo electrónico',
          'success'
        )
        this.router.navigate(['login']);
      },
      (error : HttpErrorResponse) => {
        console.log(error.error?.message);
        if(error.error?.message) {
          error.error?.message;
        } 
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No pudimos completar la acción.',
          footer: error.error?.message
        })
      }
    )
   }
  
}

