import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../common/authentication-service.service';
import { UtillsService } from '../../common/utills-service.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [AuthenticationService, HttpClient]
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  accessToken: string = "";

  constructor(private authentication: AuthenticationService, private router: Router,
    private utillservice: UtillsService, private spinner: NgxSpinnerService) {
    this.accessToken = authentication.getAuthToken();
  }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      'old_password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      'new_password': new FormControl(null, [Validators.required, Validators.minLength(8), , Validators.maxLength(15)]),
      'confirm_password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
    }, { validators: this.checkPasswords }
    )
  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('new_password').value;
    const confirmPassword = group.get('confirm_password').value;
    return password === confirmPassword ? null : { unmatched: true }
  }
  changePasswordScreen() {
    this.spinner.show();

    this.authentication.changePassword(this.accessToken, this.changePasswordForm.value)
      .subscribe((resData: any) => {
        this.spinner.hide();
        this.utillservice.showSuccess(resData.message);
        this.router.navigate(['/login']);
      },
        error => {
          this.spinner.hide();
          this.utillservice.showError(error.message);
        })
  }
}
