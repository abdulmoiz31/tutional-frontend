import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../../../common/authentication-service.service';
import { ClassManagementService } from '../../class-management-service-rest';
import { UtillsService } from '../../../../common/utills-service.service';
import { DataService } from '../../../../common/dataservice.service';
import { IDS } from '../../../../constants/app.constants';


@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  @ViewChild('searchContent') search: ElementRef;
  @ViewChild("infoModal") infoModal: TemplateRef<any>;
  @Output() onCheck = new EventEmitter<any>()
  @Input() stepper;
  @Input() displayList;
  _IDS: any = IDS;
  data = [];
  selected = [];
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
  columns = [{ name: 'name' }];
  
  ColumnMode = ColumnMode;
  users = [];
  filtered_users = [];
  closeResult: string;
  designations = [];

  constructor(
    private authenticationService: AuthenticationService,
    private classmanagementservice: ClassManagementService, private spinner: NgxSpinnerService, private toaster: UtillsService,
    @Inject(DOCUMENT) private document: Document, private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.data = this.displayList;
    this.loggedInUser = this.authenticationService.getUser();
    this.accessToken = this.authenticationService.getAuthToken();
    this.isAdmin = this.authenticationService.isAdmin();
    if (this.stepper == this._IDS.STEPPER_STUDENTS) {
      this.columns = [{name: 'studentId'}, { name: 'name' }, {name: 'session'}, {name: 'grade'},];
    }
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

  onCheckBoxClick(rowIndex, event){
    this.displayList[rowIndex].checked = event.target.checked;
    this.onCheck.emit({index: rowIndex, checked: event.target.checked})
  }

}