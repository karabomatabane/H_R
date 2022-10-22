import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { Application } from '../_models/application';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  FormData: FormGroup;
  newApp: boolean = false;

  constructor (private builder: FormBuilder, private appService: ApplicationService) { }

  ngOnInit() {
    this.FormData = this.builder.group({
      studentNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])]),
      residence1: new FormControl('', [Validators.required]),
      residence2: new FormControl(''),
      residence3: new FormControl(''),
      status: new FormControl('true'),
      semester: new FormControl('true', [Validators.required]),
    });
  }

  get formControls() {
    return this.FormData.controls;
  }

  onNew() {
    this.newApp = !this.newApp;
  }

  onSubmit(FormData) {
    console.log(FormData);
    this.appService.saveApp(FormData).subscribe(response => {
    }, error => {
      console.error(error);
    })
  }
}
