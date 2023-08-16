import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AuthenticationService } from '../../common/authentication-service.service';
import { UtillsService } from '../../common/utills-service.service';

//importing interfaces
import { responseDataForStack } from '../../interface/lov-management-interface';
import { responseDataForLocation } from '../../interface/lov-management-interface';
import { responseDataForDesignation } from '../../interface/lov-management-interface';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { LovManagementService } from './lov-management-service-rest';


@Component({
  selector: 'app-lov-management',
  templateUrl: './lov-management.component.html',
  styleUrls: ['./lov-management.component.scss']
})


export class LovManagementComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  public isAdmin = false;
  public authToken = this.authenticationService.getAuthToken();
  closeResult: string = '';

  modalForm: FormGroup;

  //properties of ngx-datatable
  data: [] = [];

  loadingIndicatorForStack = false;
  loadingIndicatorForLocation = false;
  loadingIndicatorForDesignation = false;

  stackData!: responseDataForStack[];
  currentStackId!: number;
  locationData!: responseDataForLocation;
  currentLocationId!: number;
  designationData!: responseDataForDesignation;
  currentDesignationId!: number;

  columns = [{ name: 'emp_id', sortable: true }, { name: 'description', sortable: false }, { name: 'action', sortable: false }];
  ColumnMode = ColumnMode;
  reorderable = true;


  constructor(
    private authenticationService: AuthenticationService,
    private lovManagementService: LovManagementService,
    private utillService: UtillsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toaster: UtillsService,
    @Inject(DOCUMENT) private document: Document
  ) { };


  ngOnInit(): void {
    let user_Type = this.authenticationService.getUser().user_Type;

    //checking whether userType is admin or user
    
      this.isAdmin = this.authenticationService.isAdmin();
    

    //getting data for the tables
    this.getStack();
    this.getLocation();
    this.getDesignation();

    this.modalForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),

    });

  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.modalForm.controls['name'].enable();
      this.modalForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.modalForm.controls['name'].enable();
      this.modalForm.reset();
      return 'by clicking on a backdrop';
    } else {
      this.modalForm.controls['name'].enable();
      this.modalForm.reset();
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
  };

  openStackModal(content, rowIndex: number) {
    this.populateDataForStack(rowIndex);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  openStackModalForDelete(content, rowIndex: number) {
    this.populateDataForStackDelete(rowIndex);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  openLocationModal(content, rowIndex: number) {
    this.populateDataForLocation(rowIndex);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  openLocationModalForDelete(content, rowIndex: number) {
    this.populateDataForLocationDelete(rowIndex);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  openDesignationModal(content, rowIndex: number) {
    this.populateDataForDesignation(rowIndex);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  openDesignationModalForDelete(content, rowIndex: number) {
    this.populateDataForDesignationDelete(rowIndex);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  enterStack() {
    if (this.modalForm.status == "VALID") {
      this.spinner.show();
      this.lovManagementService.addStack(this.modalForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Stack Added');
        this.getStack();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Adding Stack Failed!');
        })
    }
    else {
      this.toaster.showError('Enter Valid Stack!');
    };
  };

  populateDataForStack(index: number) {
    let stack = this.stackData[index];
    this.currentStackId = stack.s_id;
    let name = stack.stack_Name;
    this.modalForm.setValue({
      'name': name,
    });
  };

  populateDataForStackDelete(index: number) {
    let stack = this.stackData[index];
    this.currentStackId = stack.s_id;
    let name = stack.stack_Name;
    this.modalForm.setValue({
      'name': name,
    });
    this.modalForm.controls['name'].disable();
  };

  updateStack() {
    if (this.modalForm.status == "VALID") {
      this.spinner.show();
      this.lovManagementService.updateStack(this.modalForm.value.name, this.currentStackId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Stack Updated');
        this.getStack();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Updating Stack Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Stack!');
    };
  };

  deleteStack() {
    if (this.modalForm.status == "VALID" || this.modalForm.status == "DISABLED") {
      this.spinner.show();
      this.lovManagementService.deleteStack(this.currentStackId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Stack Deleted');
        this.getStack();
        this.modalForm.controls['name'].enable();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Deleting Stack Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Stack!');
    };
  };

  enterLocation() {
    if (this.modalForm.status == "VALID") {
      this.spinner.show();
      this.lovManagementService.addLocation(this.modalForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Location Added');
        this.getLocation();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Adding Location Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Location!');
    };
  };

  populateDataForLocation(index: number) {
    let location = this.locationData[index];
    this.currentLocationId = location.l_id;
    let name = location.l_name;
    this.modalForm.setValue({
      'name': name,
    });
  };

  populateDataForLocationDelete(index: number) {
    let location = this.locationData[index];
    this.currentLocationId = location.l_id;
    let name = location.l_name;
    this.modalForm.setValue({
      'name': name,
    });
    this.modalForm.controls['name'].disable();
  };

  updateLocation() {
    if (this.modalForm.status == "VALID") {
      this.spinner.show();
      this.lovManagementService.updateLocation(this.modalForm.value.name, this.currentLocationId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Location Updated');
        this.getLocation();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Updating Location Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Location!');
    };
  };

  deleteLocation() {
    if (this.modalForm.status == "VALID" || this.modalForm.status == "DISABLED") {
      this.spinner.show();
      this.lovManagementService.deleteLocation(this.currentLocationId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Location Deleted');
        this.getLocation();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Deleting Location Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Location!');
    };
  };

  enterDesignation() {
    if (this.modalForm.status == "VALID") {
      this.spinner.show();
      this.lovManagementService.addDesignation(this.modalForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Designaton Added');
        this.getDesignation();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Adding Designation Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Designaton!');
    }
  };

  populateDataForDesignation(index: number) {
    let designation = this.designationData[index];
    this.currentLocationId = designation.d_id;
    let name = designation.designation_name;
    this.modalForm.setValue({
      'name': name,
    });
  };

  populateDataForDesignationDelete(index: number) {
    let designation = this.designationData[index];
    this.currentLocationId = designation.d_id;
    let name = designation.designation_name;
    this.modalForm.setValue({
      'name': name,
    });
    this.modalForm.controls['name'].disable();
  };

  updateDesignation() {
    if (this.modalForm.status == "VALID") {
      this.spinner.show();
      this.lovManagementService.updateDesignation(this.modalForm.value.name, this.currentLocationId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Location Updated');
        this.getDesignation();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Updating Location Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Location!');
    };
  };

  deleteDesignation() {
    if (this.modalForm.status == "VALID" || this.modalForm.status == "DISABLED") {
      this.spinner.show();
      this.lovManagementService.deleteDesignation(this.currentLocationId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Location Deleted');
        this.getDesignation();
        this.modalForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Deleting Location Failed!')
        })
    }
    else {
      this.toaster.showError('Enter Valid Location!');
    };
  };

  getStack() {
    this.loadingIndicatorForStack = true;
    this.lovManagementService.getStackLov(this.authToken)
      .subscribe(
        (data: any) => {
          let stackData: any = [];

          data.map((d, index) => {
            stackData[index] = {
              "s_id": d.s_Id,
              "stack_Name": d.s_Name,
              "_id": d._id,
            };
          });

          this.stackData = stackData;
          this.loadingIndicatorForStack = false;
        },

        error => {
          this.utillService.showError('Unable To Get Data For Stack Table');
        }
      );
  };


  getLocation() {
    this.loadingIndicatorForLocation = true;
    this.lovManagementService.getCenter(this.authToken)
      .subscribe(
        ({ data }: any) => {
          let locationData: any = [];

          data.map((d, index) => {
            locationData[index] = {
              "l_id": d.l_Id,
              "l_name": d.l_Name,
              "_id": d._id,
            };
          });

          this.locationData = locationData;
          this.loadingIndicatorForLocation = false;
        },

        error => {
          this.utillService.showError('Unable To Get Data For Location Table');
        }
      );
  };


  getDesignation() {
    this.loadingIndicatorForLocation = true;
    this.lovManagementService.getDesignationLov(this.authToken)
      .subscribe(
        ({ data }: any) => {
          let designationData: any = [];

          data.map((d, index) => {
            designationData[index] = {
              "d_id": d.d_Id,
              "designation_name": d.designation_Name,
              "_id": d._id,
            };
          });

          this.designationData = designationData;
          this.loadingIndicatorForLocation = false;
        },

        error => {
          this.utillService.showError('Unable To Get Data For Designation Table');
        }
      );
  };
};