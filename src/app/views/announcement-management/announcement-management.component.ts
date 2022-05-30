import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AuthenticationService } from '../../common/authentication-service.service';
import { TutorialManagementService } from '../tutorials-management/tutorial-management-service-rest';
import { AnnouncementManagementService } from '../announcement-management/announcement-management-service-rest';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtillsService } from '../../common/utills-service.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-announcement-management',
  templateUrl: './announcement-management.component.html',
  styleUrls: ['./announcement-management.component.scss']
})
export class AnnouncementManagementComponent implements OnInit {


  @ViewChild('table') table: ElementRef;
  @ViewChild('searchContent') search: ElementRef;
  @ViewChild("infoModal") infoModal: TemplateRef<any>;
  data1 = [];
  announcemetsData = [];
  accessToken: string = "";
  loggedInUser: any = {};
  isAdmin: boolean;
  loadingIndicator = false;
  reorderable = true;
  columns = [{ name: 'title' }, { name: 'announcement' }];
  ColumnMode = ColumnMode;
  check = false;
  users = [];
  tutorials = [];
  announcements = [];
  filtered_announcements = []
  closeResult: string;
  tutorialForm: FormGroup;
  updateTutorialForm: FormGroup;
  updateAnnouncementForm: FormGroup;
  announcementForm: FormGroup;
  designations = [];
  id;
  counter = [];
  deleteId!: number;

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private tutorialmanagementservice: TutorialManagementService,
    private announcementmanagmentservice: AnnouncementManagementService, private spinner: NgxSpinnerService, private toaster: UtillsService, @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUser();
    this.accessToken = this.authenticationService.getAuthToken();
    this.isAdmin = this.authenticationService.isAdmin();
    this.getAllAnnouncements();

    this.announcementForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      'announcement': new FormControl(null, [Validators.required])
    });

    this.updateAnnouncementForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      'announcement': new FormControl(null, [Validators.required])
    });

  }

  filterDatatable(event) {
    let val = this.search.nativeElement.value.toLowerCase();
    if (val === "") {
      this.data1 = this.filtered_announcements;
    } else {
      let colsAmt = this.columns.length;
      let keys = this.columns.map(a => a.name);
      this.data1 = this.filtered_announcements.filter(function (item) {
        for (let i = 0; i < colsAmt; i++) {
          if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
            return true;
          }
        }
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.updateAnnouncementForm.enable();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.updateAnnouncementForm.enable();
      return 'by clicking on a backdrop';
    } else {
      this.updateAnnouncementForm.enable();
      return `with: ${reason}`;
    }
  }
  open(content, rowIndex) {

    this.id = rowIndex;
    if (rowIndex >= 0) {
      this.populateAnnouncementModal(rowIndex);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  addAnnouncement() {

    if (this.announcementForm.status == "VALID") {
      this.spinner.show();
      this.announcementmanagmentservice.addnewAnnouncement(this.announcementForm.value).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('New Tutorial Added')
        this.getAllAnnouncements();
        this.announcementForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Tutorial Addition Failed')
        })
    }
  }

  updateAnnouncement() {
    if (this.updateAnnouncementForm.status == "VALID") {
      this.spinner.show();
      this.announcementmanagmentservice.updateAnnouncement(this.updateAnnouncementForm.value, this.data1[this.id]._id)
        .subscribe((resData: any) => {
          this.spinner.hide();
          this.modalService.dismissAll();
          this.toaster.showSuccess('Announcement Updated')
          this.getAllAnnouncements();
          this.updateAnnouncementForm.reset();
        },
          error => {
            this.spinner.hide();
            this.toaster.showError('Announcement Updation Failed')
          })
    }
    else {
      this.spinner.hide();
      this.toaster.showError('Enter Valid Data');
    }
  }


  populateAnnouncementModal(rowIndex) {
    let announcement = this.filtered_announcements[rowIndex];
    this.updateAnnouncementForm.get('title').setValue(announcement.title);
    this.updateAnnouncementForm.get('announcement').setValue(announcement.announcement);
  }


  getAllAnnouncements() {
    this.loadingIndicator = true;
    this.filtered_announcements = [];
    this.announcementmanagmentservice.getAllAnnouncements(this.authenticationService.getAuthToken()).subscribe((resData: any) => {
      this.announcements = resData.announcements
      for (let index = 0; index < this.announcements.length; index++) {

        let raw_announcements = this.announcements[index];

        let announcement = { 'title': '', 'announcement': '', '_id': '', 'check': false };

        if (raw_announcements._id != undefined) {
          announcement['_id'] = raw_announcements._id;
          announcement['check'] = true;
        }
        else {
          announcement['_id'] = undefined;
        }
        announcement['title'] = raw_announcements.title;
        announcement['announcement'] = raw_announcements.announcement;

        this.filtered_announcements.push(announcement);
      }


      this.data1 = this.filtered_announcements;
      this.loadingIndicator = false;
    },
      error => {
        this.loadingIndicator = false;
        this.toaster.showError('Unable to fetch Data')
      });
  }


  populateAnnouncementModalForDelete(rowIndex) {
    let announcement = this.filtered_announcements[rowIndex];
    this.updateAnnouncementForm.get('title').setValue(announcement.title);
    this.updateAnnouncementForm.get('announcement').setValue(announcement.announcement);

    this.deleteId = announcement._id;
    this.updateAnnouncementForm.disable();
  }

  openForDelete(content, rowIndex) {

    this.id = rowIndex;
    if (rowIndex >= 0) {
      this.populateAnnouncementModalForDelete(rowIndex);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  };

  deleteAnnouncement() {
    if (this.updateAnnouncementForm.status == "VALID" || this.updateAnnouncementForm.status == "DISABLED") {
      this.spinner.show();
      this.announcementmanagmentservice.deleteAnnouncement(this.deleteId).subscribe((resData: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.showSuccess('Announcement Deleted');
        this.updateAnnouncementForm.enable();
        this.getAllAnnouncements();
        this.updateAnnouncementForm.reset();
      },
        error => {
          this.spinner.hide();
          this.toaster.showError('Announcement Deletion Failed')
        })
    }
    else {
      this.toaster.showError('Enter Valid Data!');
    };
  };

}
