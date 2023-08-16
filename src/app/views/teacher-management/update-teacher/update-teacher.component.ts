import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../../common/authentication-service.service';
import { CommunicationService } from '../../../common/communication.service';
import { UtillsService } from '../../../common/utills-service.service';
import { TeacherManagementService } from '../teacher-management-service-rest';

@Component({
  selector: 'app-update-teacher',
  templateUrl: './update-teacher.component.html',
  styleUrls: ['./update-teacher.component.scss']
})
export class UpdateTeacherComponent implements OnInit {

  profile = { fullname: '', email: '', phoneNumber: '', cnic: '', userType: '', isDisabled: false, cvUrl: '' }
  imageURL = ""
  profilePicAvailable = false;
  hasEditAccess = false;
  adminEditAccess = true;
  admissionSessions = [];
  sessions = [];
  grades = [];
  cvAvailable = false;
  updateTeacherForm: FormGroup;
  isAdmin = false;

  constructor(private authenticationService: AuthenticationService,
    private utillservice: UtillsService, private teachermanagementservice: TeacherManagementService, 
    private spinner: NgxSpinnerService, private router: Router, private commService: CommunicationService, private utillService: UtillsService) {
      this.isAdmin = authenticationService.isAdmin()
     }

  ngOnInit(): void {
    this.getUserData();
    this.createForm()
  }
  ngOnDestroy() {
  }

  createForm(){
    this.updateTeacherForm = new FormGroup({
      name: new FormControl(this.profile.fullname, Validators.required),
      phoneNumber: new FormControl(this.profile.phoneNumber, [Validators.required, Validators.maxLength(11)]),
      cnic: new FormControl(this.profile.cnic, [Validators.required, Validators.maxLength(13)]),
      isDisabled: new FormControl(this.profile.isDisabled, Validators.required)
    });
  }

  onSubmit() {
    this.spinner.show()
    
    this.teachermanagementservice.updateUser(this.preparePayload()).subscribe((resData: any) => {
      this.spinner.hide();
      this.utillservice.showSuccess(resData.message)
      this.router.navigate(['/teacher-management']);
    },
      error => {
        this.spinner.hide();
        this.utillservice.showError('Unable to Submit Data')
      });
  }

  onEditCV(file: any) {
    let imageFile = file;
    //restricting user to not select more than one image
    if (imageFile.length > 1) {
      this.utillService.showError('select one image only');
    }
    else {
      let name = imageFile[0].name;
      var ext =  name.split('.').pop();
      let size = imageFile[0].size;
      let kbSize = Math.round(size / 1024);
      let mbSize = Math.round(kbSize / 1024);
      if (mbSize <= 60) {
        this.uploadCV(imageFile[0], ext);
      }
      else {
        this.utillService.showError('file size is greator than 200mb');
      }
    }
  };

  uploadCV(file: File, format) {
    this.spinner.show();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let data: any = reader.result;
      let base64data = data.split('base64,')[1];
      this.teachermanagementservice.uploadCV(String(base64data), format, this.profile.email)
        .subscribe(
          (resData: any) => {
            this.spinner.hide();
            this.utillService.showSuccess(resData.message);
            this.cvAvailable = true;
          },
          error => {
            this.spinner.hide();
            this.utillService.showError("Unable To Upload CV");
          }
        )
    }
  };

  logFormData(){
    console.log(this.updateTeacherForm.value);
    
  }
  preparePayload(){
    let payload = this.updateTeacherForm.value;
    payload.userType = this.profile.userType;
    payload.email = this.profile.email;
    return payload;
  }

  onToggle(event){
    this.updateTeacherForm.controls.isDisabled.setValue(!event.target.checked)
  }


  getUserData(){
    this.spinner.show()
    this.teachermanagementservice.getUserById(this.commService.userUpdateId).subscribe((resData: any) => {
      this.spinner.hide();
      this.populateData(resData.user)
      this.createForm()
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
    this.profile.cnic = data.cnic;
    this.imageURL = data.profilePictureUrl;
    this.profilePicAvailable = this.imageURL? true : false;
    this.profile.cvUrl = data.cvUrl;
    this.cvAvailable = data.cvUrl? true : false
    this.profile.userType = data.userType;
    this.profile.isDisabled = data.isDisabled;
  }
}