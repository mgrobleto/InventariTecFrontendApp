import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';


import { CurrencyService } from 'src/app/data/service/currency/currency-service.service';
import { PlanTypeService } from 'src/app/data/service/planType/plan-type-service.service';
import { RegisterService } from '../../services/register/register.service';

import {capitalize} from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    }
  ],
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  businessDataForm: FormGroup;
  businessInvoiceDataForm: FormGroup;
  businessOptionsDataForm: FormGroup;
  hide = true;

  /* temporary vars */
  currencyType : any = [];
  planType : any = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private _currencyService: CurrencyService,
    private _planTypeService: PlanTypeService,
    private _registerService: RegisterService,
  ) 
  {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    },
    {
      validators : this.passwordMatchValidator
    })

    this.businessDataForm = this.fb.group({
      businessName: ['', Validators.required],
    })

    this.businessInvoiceDataForm = this.fb.group({
      invoiceAuthorizationNumber: ['', Validators.required],
      invoiceSerie: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      lastRegisteredInvoices: ['', Validators.required],
    })

    this.businessOptionsDataForm = this.fb.group({
      currencyTypeId: ['', Validators.required],
      planTypeId: ['', Validators.required]
    })

  }

  ngOnInit(): void {
    this.getCurrencyType();
    this.getPlanType();
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  passwordMatchValidator : ValidatorFn = (control : AbstractControl) : ValidationErrors | null => {
    if(control.get('password') && control.get('passwordConfirmation') && control.get('password')?.value !== control.get('passwordConfirmation')?.value) {
      return {passwordmatcherror : true };
    }
    return null;
  }

  getCurrencyType () {
    this._currencyService.getCurrency().subscribe(
      (response: any) => {
        this.currencyType = response;
      }, (err : any) => {
        console.log(err);
      }
    )
  }
  
  getPlanType () {
    this._planTypeService.getPlanType().subscribe(
      (response: any) => {
        this.planType = response;
      },
      (error : any) => {
        console.log(error);
      }
    )
  }

  submitRegistration() {

    let responseMessage;
    
    let name = capitalize(this.businessDataForm.value.businessName);

    var user = {
      username : this.registerForm.value.username,
      password : this.registerForm.value.password,
      email: this.registerForm.value.email,
    }

    var business = {
      name: name,
      authorization_number: this.businessInvoiceDataForm.value.invoiceAuthorizationNumber,
      invoice_series : this.businessInvoiceDataForm.value.invoiceSerie,
      invoice_number: this.businessInvoiceDataForm.value.invoiceNumber,
      last_registered_invoice: this.businessInvoiceDataForm.value.lastRegisteredInvoices,
      number_of_product_records_available: this.businessInvoiceDataForm.value.numberOfProductRecordsAvailable,
      plan_type : this.businessOptionsDataForm.value.planTypeId,
      currency: this.businessOptionsDataForm.value.currencyTypeId
    }

    var userData = {
      user: user,
      businessData: business
    }

    console.log(userData);

    this._registerService.registerUserWithBusiness(user, business).subscribe(
      (resp: any) => {
        responseMessage = resp.message;
        console.log(responseMessage);
        Swal.fire('¡Tu negocio ha sido registrado!', '','success');
        this.redirectToLogin();
      },
      (error) => {
        if(error.message?.message) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salio mal, intenta de nuevo',
            footer: error.message?.message
          })
          console.log(error.message?.message)
        }
      }
    )
    
  }

}
