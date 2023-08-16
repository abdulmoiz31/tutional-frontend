import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AuthenticationService } from '../../common/authentication-service.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtillsService } from '../../common/utills-service.service';
import { DOCUMENT } from '@angular/common';
import { DataService } from '../../common/dataservice.service';
import { TeacherManagementService } from './teacher-management-service-rest';
import { Router } from '@angular/router';
import { CommunicationService } from '../../common/communication.service';


@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  @ViewChild('searchContent') search: ElementRef;
  @ViewChild("infoModal") infoModal: TemplateRef<any>;
  data = [];
  accessToken: string = "";
  loggedInUser: any = {};
  afuConfig = {
    uploadAPI: {
      url: "https://example-file-upload-api"
    }
  };
  isAdmin: boolean;
  loadingIndicator = false;
  reorderable = true;
  columns = [{ name: 'name', sortable: true }, { name: 'cnic' }, { name: 'phoneNumber' }, {name: 'classes'}];
  
  ColumnMode = ColumnMode;
  users = [];
  filtered_users = [];
  closeResult: string;
  signupForm: FormGroup;
  designations = [];

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private usermanagementservice: TeacherManagementService, private spinner: NgxSpinnerService, private toaster: UtillsService,
    @Inject(DOCUMENT) private document: Document, private dataService: DataService, private router: Router, private commService: CommunicationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUser();
    this.accessToken = this.authenticationService.getAuthToken();
    this.isAdmin = this.authenticationService.isAdmin();
    this.getTeachers();
    this.createForm()
  }

  createForm() {
    this.signupForm = new FormGroup({
      password: new FormControl('tutional@123', [Validators.required, Validators.maxLength(40), Validators.minLength(8)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required])
    });
  }

  get signupControls() {
    return this.signupForm.controls;
  }

  edit(index) {
    this.commService.userUpdateId = this.data[index].email
    this.router.navigate(['/teacher-management/update-teacher']);
  }

  filterDatatable(event) {
    // // get the value of the key pressed and make it lowercase
    // let val = this.search.nativeElement.value.toLowerCase();
    // if (val === "") {
    //   this.data = this.filtered_users;
    // } else {
    //   // get the amount of columns in the table
    //   let colsAmt = this.columns.length;
    //   // get the key names of each column in the dataset
    //   let keys = this.columns.map(a => a.name);
    //   // assign filtered matches to the active datatable
    //   this.data = this.filtered_users.filter(function (item) {
    //     // iterate through each row's column data
    //     for (let i = 0; i < colsAmt; i++) {
    //       // check for a match
    //       if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
    //         // found match, return true to add to result set
    //         return true;
    //       }
    //     }
    //   });
    //   // whenever the filter changes, always go back to the first page
    //   // this.table.nativeElement.offset = 0;
    // }
  }

  getTeachers() {
    this.loadingIndicator = true;
    this.filtered_users = [];
    this.usermanagementservice.getTeachers(this.accessToken)
      .subscribe((res:any) => {
        this.filtered_users = res;
        for (let index = 0; index < this.filtered_users.length; index++) {
          this.filtered_users[index].classes =  this.filtered_users[index].classes.length;
        }
        this.data = this.filtered_users;
        this.loadingIndicator = false;
      },(err)=>{
        this.loadingIndicator = false;
      });
  }
  userDetail(index) {
    this.commService.userDetailId = this.data[index].email
    this.router.navigate(['/teacher-management/teacher-detail']);
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  open(content) {
    //setting data into popup modal
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  signupUser() {
    if (this.signupForm.status == "VALID") {
      this.spinner.show();
      this.usermanagementservice.teacherSignup(this.signupForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Teacher Registered')
        this.getTeachers();
        this.signupForm.reset();
        this.signupForm.patchValue({password: "tutional@123"})
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Teacher registration Failed')
        })
    }
  }
}
