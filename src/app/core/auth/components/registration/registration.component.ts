import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CurrencyService } from 'src/app/data/service/currency/currency-service.service';
import { PlanTypeService } from 'src/app/data/service/planType/plan-type-service.service';
import { Router } from '@angular/router';
import { AbsoluteSourceSpan } from '@angular/compiler';
import { ValidationError } from 'webpack';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  businessDataForm: FormGroup;
  hide = true;

  /* temporary vars */
  currencyType : any = [];
  planType : any = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private _currencyService: CurrencyService,
    private _planTypeService: PlanTypeService
  ) 
  {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    },
    {
      validators : this.passwordMatchValidator
    }
    )

    this.businessDataForm = this.fb.group({
      name: ['', Validators.required],
      invoiceAuthorizationNumber: ['', Validators.required],
      invoiceSerie: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      lastRegisteredInvoices: ['', Validators.required],
      numberOfProductRecordsAvailable: ['', Validators.required],
      planTypeId: ['', Validators.required],
      currencyTypeId: ['', Validators.required],
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

  }

}
