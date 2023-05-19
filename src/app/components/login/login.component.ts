import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  hide = true;

  form : FormGroup;

 constructor(private fb : FormBuilder) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
 }

 login() {
   console.log(this.form);
   const username = this.form.value.username;
   const password = this.form.value.password;

   if(username == 'admin' && password == 'admin123') {
    //direct to dashboard
   } else{
    
  }
 }
}
