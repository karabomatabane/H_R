import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ApplicationService } from '../application.service';
import { Application } from '../_models/application';
import { Observable, take } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  FormData: FormGroup;
  applications: Application[];
  newApp: boolean = false;
  filter: boolean = false;

  constructor (private builder: FormBuilder, private appService: ApplicationService) { }

  ngOnInit() {
    this.loadApps();
  }

  get formControls() {
    return this.FormData.controls;
  }

  onNew() {
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
    this.newApp = !this.newApp;
  }

  onSubmit(FormData) {
    console.log(FormData);
    this.appService.saveApp(FormData).subscribe(response => {
    }, error => {
      console.error(error);
    })
  }

  loadApps() {
    this.appService.getActiveApps(this.filter).subscribe(response => {
        this.applications = response;
      }, error => {
        console.error(error);
      });
  };

  concatReses(res1: String, res2: String, res3: String) {
    console.log('res1', res1, 'res2', res2, 'res3', res3);
    if (res2 !== undefined && res3 !== undefined) {
      return res1.concat(', ', res2.toString(), ', ' , res3.toString());
    } else if (res2 !== undefined) {
      return res1.concat(', ', res2.toString());
    } else if (res3 !== undefined) {
      return res1.concat(', ', res3.toString());
    } else {
      return res1.toString();
    }
    
  }
}
