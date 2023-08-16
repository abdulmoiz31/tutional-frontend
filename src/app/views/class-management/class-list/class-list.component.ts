import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../../common/authentication-service.service';
import { ClassManagementService } from '../class-management-service-rest';
import { UtillsService } from '../../../common/utills-service.service';
import { DataService } from '../../../common/dataservice.service';


@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  @ViewChild('searchContent') search: ElementRef;
  @ViewChild("infoModal") infoModal: TemplateRef<any>;
  @Output() createClass = new EventEmitter<boolean>();
  @Output() onEdit = new EventEmitter<string>();
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
  columns = [{ name: 'id' }, { name: 'className' }, {name: 'teachers'}];
  
  ColumnMode = ColumnMode;
  users = [];
  filtered_users = [];
  closeResult: string;
  designations = [];
  deleteIndex = null;

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private classmanagementservice: ClassManagementService, private spinner: NgxSpinnerService, private toaster: UtillsService,
    @Inject(DOCUMENT) private document: Document, private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUser();
    this.accessToken = this.authenticationService.getAuthToken();
    this.isAdmin = this.authenticationService.isAdmin();
    this.getClasses();
  }

  edit(index) {
    this.onEdit.emit(this.data[index].id)
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

  getClasses() {
    this.loadingIndicator = true;
    let filteredUsers = [];
    this.classmanagementservice.getClasses()
      .subscribe((res:any) => {
        this.filtered_users = res;
        filteredUsers = res;
        for (let index = 0; index < filteredUsers.length; index++) {
          let teachers = filteredUsers[index].teachers
          for (let index1 = 0; index1 < teachers.length; index1++) {
            teachers[index1] = teachers[index1].name;
          }
          filteredUsers[index].teachers = teachers.join(", ");
        }
        this.data = filteredUsers;
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
  open() {
    this.createClass.emit(false);
  }

  openDelete(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  deleteClass(index, content){
    this.deleteIndex = index;
    this.openDelete(content)
  }

  deleteConfirmed(){
    this.spinner.show()
    this.classmanagementservice.deleteClass(this.data[this.deleteIndex].id).subscribe(
      (resData: any) => {
        this.spinner.hide();
        this.toaster.showSuccess(resData.message);
        this.modalService.dismissAll();
        this.getClasses()
      },
      error => {
        this.spinner.hide();
        this.toaster.showError('Unable To Delete Class');
      });
  }
}