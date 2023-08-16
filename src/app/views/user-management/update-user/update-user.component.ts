import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { UtillsService } from '../../../common/utills-service.service';
import { AuthenticationService } from '../../../common/authentication-service.service';
import { UserManagementService } from '../user-management-service-rest';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommunicationService } from '../../../common/communication.service';
import { LOVManagementService } from '../../../common/lov-service-rest';
import { LOV, USER_TYPES } from '../../../constants/app.constants';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {

  profile = { fullname: '', email: '', phoneNumber: '', admissionSession: '', session: '', grade: '', classes: [], userType: '', isDisabled: false }
  imageURL = ""
  profilePicAvailable = false;
  hasEditAccess = false;
  adminEditAccess = true;
  project_Name: String[] = [];
  temp = [];
  fileUrls = [];
  arr = [];
  arr2 = [];
  admissionSessions = [];
  sessions = [];
  grades = [];
  
  updateUserForm: FormGroup;
  subscription: Subscription;
  isAdmin = false;

  constructor(private utillservice: UtillsService, private usermanagementservice: UserManagementService, private spinner: NgxSpinnerService,
    private router: Router, private commService: CommunicationService, private LOVService: LOVManagementService) { }

  ngOnInit(): void {
    this.getLovs();
    this.getUserData();
    this.createForm()
  }
  ngOnDestroy() {
  }

  createForm(){
    this.updateUserForm = new FormGroup({
      name: new FormControl(this.profile.fullname, Validators.required),
      phoneNumber: new FormControl(this.profile.phoneNumber, Validators.required),
      admissionSession: new FormControl(this.profile.admissionSession, Validators.required),
      session: new FormControl(this.profile.session, Validators.required),
      grade: new FormControl(this.profile.grade, Validators.required),
      isDisabled: new FormControl(this.profile.isDisabled, Validators.required)
    });
  }

  onSubmit() {
    this.spinner.show()
    
    this.usermanagementservice.updateUser(this.preparePayload()).subscribe((resData: any) => {
      this.spinner.hide();
      this.utillservice.showSuccess(resData.message)
      this.router.navigate(['/user-management']);
    },
      error => {
        this.spinner.hide();
        this.utillservice.showError('Unable to fetch Data')
      });
  }

  logFormData(){
    console.log(this.updateUserForm.value);
    
  }
  preparePayload(){
    let payload = this.updateUserForm.value;
    payload.userType = this.profile.userType;
    payload.email = this.profile.email;
    if (this.profile.userType == USER_TYPES.studentUser) {
      this.grades.filter((grade)=>{
        if (grade.lovId == payload.grade) {
          payload.gradeTitle = grade.lovTitle
        }
      })
      this.admissionSessions.filter((adSession)=>{
        if (adSession.lovId == payload.admissionSession) {
          payload.admissionSessionTitle = adSession.lovTitle
        }
      })
      this.sessions.filter((session)=>{
        if (session.lovId == payload.session) {
          payload.sessionTitle = session.lovTitle
        }
      })
    }
    return payload;
  }

  onToggle(event){
    this.updateUserForm.controls.isDisabled.setValue(!event.target.checked)
  }

  getUserData(){
    this.spinner.show()
    this.usermanagementservice.getUserById(this.commService.userUpdateId).subscribe((resData: any) => {
      this.spinner.hide();
      this.populateData(resData.user)
      this.createForm()
    },
      error => {
        this.spinner.hide();
        this.utillservice.showError('Unable to fetch Data')
      });
  }

  getLovs(){
    this.LOVService.getLOV(LOV.ADMISSION_SESSION).subscribe((resData: any) => {
      this.spinner.hide();
      this.admissionSessions = resData.lovs;
    },
      error => {
        this.spinner.hide();
        this.utillservice.showError('Unable to fetch Data')
      });

      this.LOVService.getLOV(LOV.SESSION).subscribe((resData: any) => {
        this.spinner.hide();
        this.sessions = resData.lovs;
      },
        error => {
          this.spinner.hide();
          this.utillservice.showError('Unable to fetch Data')
        });

        this.LOVService.getLOV(LOV.GRADE).subscribe((resData: any) => {
          this.spinner.hide();
          this.grades = resData.lovs;
        },
          error => {
            this.spinner.hide();
            this.utillservice.showError('Unable to fetch Data')
          });
  }

  populateData(data) {
    this.profile.fullname = data.name;
    this.profile.email = data.email;
    this.profile.phoneNumber = data.phoneNumber;
    this.profile.admissionSession = data.admissionSession;
    this.profile.session = data.session;
    this.profile.grade = data.grade;
    this.imageURL = data.profilePictureUrl;
    this.profilePicAvailable = this.imageURL? true : false;
    this.profile.userType = data.userType;
    this.profile.isDisabled = data.isDisabled;
    let tempsClasses = data.classes;
    tempsClasses?.forEach(element => {
      this.profile.classes.push(element)
    });
  }
}