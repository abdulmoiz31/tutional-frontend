import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../common/authentication-service.service';
import { DataService } from '../../common/dataservice.service';
import { UtillsService } from '../../common/utills-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthenticationService, HttpClient]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authentication: AuthenticationService, private router: Router, private spinner: NgxSpinnerService,
    private utillservice: UtillsService, private dataservice: DataService) {
    this.logout();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.maxLength(40), Validators.minLength(8)]),
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  loginUser() {
    if (this.loginForm.status == "VALID") {
      this.spinner.show();
      this.authentication.login(this.loginForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.authentication.setAuthToken(resData.token);
        this.authentication.setUser(resData.user)
        this.utillservice.showSuccess(resData.message);
        this.dataservice.setAvatarUrl(resData.user.profilePictureUrl);
        this.router.navigate(['/dashboard']);
      },
        error => {
          this.spinner.hide();
          this.utillservice.showError(error.statusText);
        })
    }
  }

  logout() {
    this.spinner.show();
    this.authentication.logout().subscribe((resData: any) => {
      this.spinner.hide();
      if (resData.logout == true) {
        this.authentication.clearLocalStorage();
      }
    },
      error => {
        this.spinner.hide();
      })
  }
}
