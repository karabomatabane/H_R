import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  validationErrors: string[] = [];
  student: boolean = true;

  constructor(private accountService: AccountService, private toastr: ToastrService, private builder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initialiseForm();
    document.querySelector('.btn-group').addEventListener('click', () => {
        this.initialiseForm();
    })
  }

  register() {
    this.accountService.register(this.registerForm.value, this.student).subscribe(response => {
      this.router.navigateByUrl('/residences');
    }, error => {
      this.validationErrors = error;
    })
  }

  get formControls() {
    return this.registerForm.controls;
  }

  initialiseForm() {
    this.registerForm = this.builder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
      gender: new FormControl('F', [Validators.required]),
    });
    if (!this.student) {
      this.registerForm.removeControl('studentNo');
      this.registerForm.setControl('staffNo', new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(8)]));
    } else {
      this.registerForm.removeControl('staffNo');
      this.registerForm.setControl('studentNo', new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]));
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
      ? null : {isMatching: true}
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
