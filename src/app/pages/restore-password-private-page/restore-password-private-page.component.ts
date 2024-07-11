import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RestorePasswordEmailService } from 'src/app/data/service/restore-password-email/restore-password-email.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-restore-password-private-page',
  templateUrl: './restore-password-private-page.component.html',
  styleUrls: ['./restore-password-private-page.component.scss']
})
export class RestorePasswordPrivatePageComponent {
  hide = true;
  loading = false;
  form : FormGroup;

  constructor(
    private fb : FormBuilder, 
    private router: Router,
    private _resetPasswordService : RestorePasswordEmailService
    ) {
      this.form = this.fb.group({
        newPassword: ["", Validators.required],
      });
   }

   changePassword() {
      
   }

}
