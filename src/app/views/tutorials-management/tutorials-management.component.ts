import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AuthenticationService } from '../../common/authentication-service.service';
import { TutorialManagementService } from '../tutorials-management/tutorial-management-service-rest';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtillsService } from '../../common/utills-service.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-tutorials-management',
  templateUrl: './tutorials-management.component.html',
  styleUrls: ['./tutorials-management.component.scss']
})
export class TutorialsManagementComponent implements OnInit {

  @ViewChild('table') table: ElementRef;
  @ViewChild('searchContent') search: ElementRef;
  @ViewChild("infoModal") infoModal: TemplateRef<any>;
  data1 = [];
  accessToken: string = "";
  loggedInUser: any = {};
  isAdmin: boolean;
  loadingIndicator = false;
  reorderable = true;
  columns = [{ name: 'tutorial_id', sortable: true }, { name: 'tutorial_name', sortable: true }, { name: 'tutorial_url' }];
  ColumnMode = ColumnMode;
  users = [];
  tutorials = [];
  filtered_users = [];
  closeResult: string;
  tutorialForm: FormGroup;
  updateTutorialForm: FormGroup;
  designations = [];
  id!: number;
  deleteId!: number;

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private tutorialmanagementservice: TutorialManagementService, private spinner: NgxSpinnerService, private toaster: UtillsService, @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUser();
    this.accessToken = this.authenticationService.getAuthToken();
    this.isAdmin = this.authenticationService.isAdmin();
    this.getAllTutorials();

    this.tutorialForm = new FormGroup({
      'tutorial_name': new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      'tutorial_url': new FormControl(null, [Validators.required])
    });

    this.updateTutorialForm = new FormGroup({
      'tutorial_name': new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      'tutorial_url': new FormControl(null, [Validators.required])
    });

  }

  filterDatatable(event) {
    // get the value of the key pressed and make it lowercase
    let val = this.search.nativeElement.value.toLowerCase();
    if (val === "") {
      this.data1 = this.filtered_users;
    } else {
      // get the amount of columns in the table
      let colsAmt = this.columns.length;
      // get the key names of each column in the dataset
      let keys = this.columns.map(a => a.name);
      // assign filtered matches to the active datatable
      this.data1 = this.filtered_users.filter(function (item) {
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.updateTutorialForm.enable();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.updateTutorialForm.enable();
      return 'by clicking on a backdrop';
    } else {
      this.updateTutorialForm.enable();
      return `with: ${reason}`;
    }
  }
  open(content, rowIndex) {

    this.id = rowIndex;
    if (rowIndex >= 0) {
      this.populateTutorialModal(rowIndex);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  };

  openForDelete(content, rowIndex) {

    this.id = rowIndex;
    if (rowIndex >= 0) {
      this.populateTutorialModalForDelete(rowIndex);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  };

  addTutorial() {
    if (this.tutorialForm.status == "VALID") {
      this.spinner.show();
      this.tutorialmanagementservice.addnewTutorial(this.tutorialForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('New Tutorial Added')
        this.getAllTutorials();
        this.tutorialForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Tutorial Addition Failed')
        })
    }
    else {
      this.spinner.hide();
      this.toaster.showError('Enter Valid Data');
    };
  }

  updateTutorial() {
    if (this.updateTutorialForm.status == "VALID") {
      this.spinner.show();
      let tut_id: number = this.data1[this.id].tutorial_id;
      this.tutorialmanagementservice.updateTutorialbyID(this.updateTutorialForm.value, tut_id).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Tutorial Updated')
        this.getAllTutorials();
        this.updateTutorialForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Tutorial Addition Failed')
        })
    }
    else {
      this.spinner.hide();
      this.toaster.showError('Enter Valid Data');
    };
  };

  deleteTutorial() {
    if (this.updateTutorialForm.status == "VALID" || this.updateTutorialForm.status == "DISABLED") {
      this.spinner.show();
      this.tutorialmanagementservice.deleteTutorial(this.deleteId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Tutorial Deleted');
        this.getAllTutorials();
        this.updateTutorialForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Tutorial Deletion Failed')
        })
    }
    else {
      this.toaster.showError('Enter Valid Data!');
    };
  };
  getAllTutorials() {
    this.loadingIndicator = true;
    this.filtered_users = [];
    this.tutorialmanagementservice.getAllTutorials(this.authenticationService.getAuthToken()).subscribe((resData: any) => {
      this.tutorials = resData.tutorials;

      for (let index = 0; index < this.tutorials.length; index++) {
        let raw_tutorial = this.tutorials[index];
        let tutorial = { 'tutorial_id': '', 'tutorial_name': '', 'tutorial_url': '' };

        tutorial['tutorial_id'] = raw_tutorial.t_Id;
        tutorial['tutorial_name'] = raw_tutorial.tutorial_Name;
        tutorial['tutorial_url'] = raw_tutorial.tutorial_URL;

        this.filtered_users.push(tutorial);
      }

      this.data1 = this.filtered_users;
      this.loadingIndicator = false;
    },
      error => {
        this.loadingIndicator = false;
        this.toaster.showError('Unable to fetch Data')
      });
  }

  populateTutorialModal(rowIndex) {
    let tutorial = this.filtered_users[rowIndex];
    this.updateTutorialForm.get('tutorial_name').setValue(tutorial.tutorial_name);
    this.updateTutorialForm.get('tutorial_url').setValue(tutorial.tutorial_url);
  }

  populateTutorialModalForDelete(rowIndex) {
    let tutorial = this.filtered_users[rowIndex];
    this.updateTutorialForm.get('tutorial_name').setValue(tutorial.tutorial_name);
    this.updateTutorialForm.get('tutorial_url').setValue(tutorial.tutorial_url);

    //if we need to delete the data
    this.deleteId = tutorial.tutorial_id;

    this.updateTutorialForm.disable();
  }

}
