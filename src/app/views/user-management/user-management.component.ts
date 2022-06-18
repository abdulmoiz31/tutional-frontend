import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AuthenticationService } from '../../common/authentication-service.service';
import { UserManagementService } from './user-management-service-rest';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtillsService } from '../../common/utills-service.service';
import { DOCUMENT } from '@angular/common';
import { DataService } from '../../common/dataservice.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
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
  columns = [{ name: 'studentId', sortable: true }, { name: 'name', sortable: true }, { name: 'session' }, { name: 'admissionSession' }, { name: 'grade' }];
  
  ColumnMode = ColumnMode;
  users = [];
  filtered_users = [];
  closeResult: string;
  signupForm: FormGroup;
  designations = [];

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private usermanagementservice: UserManagementService, private spinner: NgxSpinnerService, private toaster: UtillsService,
    @Inject(DOCUMENT) private document: Document, private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUser();
    this.accessToken = this.authenticationService.getAuthToken();
    this.isAdmin = this.authenticationService.isAdmin();
    this.getUsers();
    this.createForm()
  }

  createForm() {
    this.signupForm = new FormGroup({
      password: new FormControl('tutional@123', [Validators.required, Validators.maxLength(40), Validators.minLength(8)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      studentId: new FormControl(null, [Validators.required]),
      session: new FormControl(null, [Validators.required]),
      admissionSession: new FormControl(null, [Validators.required]),
      grade: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required])
    });
  }

  get signupControls() {
    return this.signupForm.controls;
  }

  edit(id) {
    window.open(this.document.location.origin.toString() + '/#/user-management/update-user/' + id, "_blank");
  }

  filterDatatable(event) {
    // get the value of the key pressed and make it lowercase
    let val = this.search.nativeElement.value.toLowerCase();
    if (val === "") {
      this.data = this.filtered_users;
    } else {
      // get the amount of columns in the table
      let colsAmt = this.columns.length;
      // get the key names of each column in the dataset
      let keys = this.columns.map(a => a.name);
      // assign filtered matches to the active datatable
      this.data = this.filtered_users.filter(function (item) {
        // iterate through each row's column data
        for (let i = 0; i < colsAmt; i++) {
          // check for a match
          if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
            // found match, return true to add to result set
            return true;
          }
        }
      });
      // whenever the filter changes, always go back to the first page
      // this.table.nativeElement.offset = 0;
    }
  }

  getUsers() {
    this.loadingIndicator = true;
    this.filtered_users = [];
    this.usermanagementservice.getStudents(this.accessToken)
      .subscribe((res:any) => {
        // this.users = res;
        // for (let index = 0; index < this.users.length; index++) {
        //   let raw_user = this.users[index];
        //   let user = { name: '', session: '', studentId: '', grade: '', admissionSession: '', subjects: raw_user.subjects};
        //   user['name'] = raw_user.name;
        //   user['session'] = raw_user.session;
        //   user['studentId'] = raw_user.studentId;
        //   user['grade'] = raw_user.grade;
        //   user['admissionSession'] = raw_user.admissionSession;
        //   this.filtered_users.push(user);
        // }
        this.data = res;
        this.loadingIndicator = false;
      },(err)=>{
        this.loadingIndicator = false;
      });
  }
  userDetail(user) {
    this.dataService.setCurrentUser(this.data[user])
    window.open(this.document.location.origin.toString() + '/#/user-management/user-detail', "_blank");
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
      this.usermanagementservice.studentSignup(this.signupForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('User Registered')
        this.getUsers();
        this.signupForm.reset();
        this.signupForm.patchValue({password: "tutional@123"})
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('User registration Failed')
        })
    }
  }
  getDesignations() {
    this.usermanagementservice.getDesignationLov(this.authenticationService.getAuthToken()).subscribe(
      (resData: any) => {
        this.designations = resData.data;
      },
      error => {
        this.toaster.showError('Unable to fetch Data from Server');
      })
  }

}
