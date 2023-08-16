import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../common/authentication-service.service';
import { CommunicationService } from '../../../common/communication.service';
import { DataService } from '../../../common/dataservice.service';
import { UtillsService } from '../../../common/utills-service.service';
import { UserManagementService } from '../user-management-service-rest';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  @ViewChild("infoModal") infoModal: TemplateRef<any>;
  profile = { fullname: '', email: '', contact: '', admissionSession: '', session: '', grade: '', classes: [], todoStack: [], linkedin: '', current_projects: [] }
  modalStack = "";
  modalLead = "";
  modalDesignation = "";
  hasEditAccess = false;
  title = 'appBootstrap';
  closeResult: string;
  project_name = "";
  id;
  listOfFiles: any[] = [];
  fileUrls = [];
  profilePicAvailable: boolean = false;
  displayEditButton: boolean = false;
  imageURL: string = "";
  subscription: Subscription;
  hasDeleteAccess: boolean = false;

  constructor(
    private modalService: NgbModal,
    private _Activatedroute: ActivatedRoute,
    private fetchData: UserManagementService,
    private spinner: NgxSpinnerService,
    private authentication: AuthenticationService,
    private utillService: UtillsService,
    private dataservice: DataService,
    private router: Router,
    private commService: CommunicationService
  ) {

  };

  ngOnInit(): void {
    this.getUserData()
    if (this.authentication.isAdmin() && this.authentication.getUser().email != this.commService.userDetailId) {
      this.hasDeleteAccess = true;
      this.hasEditAccess = true;
    }
    if (this.authentication.getUser().email == this.dataservice.getCurrentUser().email || this.authentication.isAdmin()) {
      this.displayEditButton = true
    }

    
  };

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
  
  getUserData(){
    this.spinner.show()
    this.fetchData.getUserById(this.commService.userDetailId).subscribe((resData: any) => {
      this.spinner.hide();
      this.populateData(resData.user)  
    },
      error => {
        this.spinner.hide();
        this.utillService.showError('Unable to fetch Data')
      });
  }

  openDelete(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  deleteUser() {
    this.spinner.show();
    this.fetchData.deleteUser(this.commService.userDetailId)
      .subscribe(
        (resData: any) => {
          this.spinner.hide();
          this.utillService.showSuccess(resData.message);
          this.modalService.dismissAll();
          this.router.navigate(['/user-management']);
        },
        error => {
          this.spinner.hide();
          this.utillService.showError('Unable To Delete User!');
        }
      )
  };

  onEditPic(file: any) {
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
        this.uploadPic(imageFile[0], ext);
      }
      else {
        this.utillService.showError('file size is greator than 200mb');
      }
    }
  };
  open1(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onEditUser(){
    this.commService.userUpdateId = this.commService.userDetailId;
  }

  open(content, index) {
    //setting data into popup modal
    this.project_name = this.profile.current_projects[index].name;
    this.modalStack = "Project Stack: " + this.profile.current_projects[index].stack;
    this.modalLead = "Project Lead: " + this.profile.current_projects[index].lead;
    this.modalDesignation = "Designation: " + this.profile.current_projects[index].designation;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  uploadPic(file: File, format) {
    this.spinner.show();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let data: any = reader.result;
      let base64data = data.split('base64,')[1];
      let payload = {
        image: String(base64data),
        imageformat: format,
        email: this.profile.email
      }
      this.fetchData.uploadProfilePic(payload)
        .subscribe(
          (resData: any) => {
            this.imageURL = resData.url;
            this.profilePicAvailable = true;
            if (this.profile.email == this.authentication.getUser().email) {
              this.dataservice.updateProfilePicture(resData.url);
            }
            this.spinner.hide();
            this.utillService.showSuccess(resData.msg);
          },
          error => {
            this.spinner.hide();
            this.utillService.showError("Unable To Upload Profile Picture");
          }
        )
    }
  };
  populateData(data) {
    this.profile.fullname = data.name;
    this.profile.email = data.email;
    this.profile.contact = data.phoneNumber;
    this.profile.admissionSession = data.admissionSessionTitle;
    this.profile.session = data.sessionTitle;
    this.profile.grade = data.gradeTitle;
    this.imageURL = data.profilePictureUrl;
    this.profilePicAvailable = this.imageURL? true : false;
    let tempsClasses = data.classes;
    tempsClasses?.forEach(element => {
      this.profile.classes.push(element)
    });
  }
  getUserID() {
    return this.id;
  }

  getProfilePicture() {
    this.imageURL = this.dataservice.getAvatarUrl()
    if (this.imageURL != "" || this.imageURL != null) {
      this.profilePicAvailable = true;
    }
  }
  getUserId() {
    return this.authentication.getUser().emp_id;
  }
}