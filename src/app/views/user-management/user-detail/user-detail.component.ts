import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../common/authentication-service.service';
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
  profile = { fullname: '', email: '', contact: '', experience: '', designation: '', center: '', currentStack: [], todoStack: [], linkedin: '', current_projects: [] }
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
  userDataFetched = false;
  userPictureFetched = false;

  constructor(
    private modalService: NgbModal,
    private _Activatedroute: ActivatedRoute,
    private fetchData: UserManagementService,
    private spinner: NgxSpinnerService,
    private authentication: AuthenticationService,
    private utillService: UtillsService,
    private dataservice: DataService,
    private router: Router,
  ) {

  };

  ngOnInit(): void {
    this.subscription = this._Activatedroute.params.subscribe(params => {
      this.id = params.id;
      this.getProfilePicture();
      this.getUserData();
      this.getAllCvs(this.id);
      if (this.authentication.getUser().emp_id == this.id || this.authentication.isAdmin()) {
        this.hasEditAccess = true;
      }
      else {
        this.hasEditAccess = false;
      };

      //calling function to get users' profile pic
      //for checking whether login user id is same as of current user whose details are open
      if (this.id === this.authentication.getUser().emp_id) {
        //meaning loggedin user and emp whose detail section is currently in view, both are same
        //so display edit image button
        this.displayEditButton = true;
      }
      else {
        this.displayEditButton = false;
      };

      if (this.authentication.isAdmin() && this.authentication.getUser().emp_id !== this.id) {
        this.hasDeleteAccess = true;
      }
    })
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getFileUrl(index) {
    const source = `data:application/pdf;base64,${this.fileUrls[index]}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${'CV'}.pdf`
    link.click();
  }

  getAllCvs(id) {
    this.spinner.show();
    this.fetchData.getAllCVS(id).subscribe((resData: any) => {
      this.spinner.hide();
      for (let index = 0; index < resData.length; index++) {
        this.listOfFiles.push(resData[index].name);
        this.fileUrls.push(resData[index].url);
      }
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
    this.fetchData.deleteUser(this.id)
      .subscribe(
        (resData: any) => {
          this.spinner.hide();
          this.utillService.showSuccess('User Deleted Successfully');
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
      let size = imageFile[0].size;
      let kbSize = Math.round(size / 1024);
      let mbSize = Math.round(kbSize / 1024);
      if (mbSize <= 60) {
        this.uploadPic(imageFile[0], this.id);
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
  getUserData() {
    this.spinner.show();
    this.fetchData.fetchUserdetail(this.id).subscribe((resData: any) => {
      this.populateData(resData);
    },
      error => {
        this.spinner.hide();
      });
  }

  uploadPic(file: File, id: number) {
    this.spinner.show();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let data: any = reader.result;
      let base64data = data.split('base64,')[1];
      this.fetchData.uploadProfilePic(String(base64data), id)
        .subscribe(
          (resData: any) => {
            this.imageURL = `${"data:image/png;base64,"}${resData.profile_Picture}`;
            this.profilePicAvailable = true;
            this.dataservice.updateProfilePicture(resData.profile_Picture);
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
    this.profile.email = data.username;
    this.profile.contact = data.contact_num;
    this.profile.linkedin = data.linkedin_URL;
    this.profile.experience = data.experience;
    this.profile.center = data.city?.l_Name;
    this.profile.fullname = data.username;
    this.profile.designation = data.designation?.designation_Name;
    let projects = data.Current_Projects;
    let leads = data.project_Lead;
    let designation = data?.designation?.designation_Name;
    let current_stacks = data.current_Stack;
    let todo_stacks = data.to_Do_Stack;
    for (let index = 0; index < projects.length; index++) {
      let current_project_format = { name: '', lead: '', stack: '', designation: '' };
      current_project_format.name = projects[index].project_Name;
      current_project_format.designation = designation;
      current_project_format.lead = leads[index].p_Lead_Name;
      this.profile.current_projects.push(current_project_format);
    }
    for (let index = 0; index < current_stacks.length; index++) {
      this.profile.currentStack.push(current_stacks[index].stack_detail?.s_Name);
    }
    for (let index = 0; index < todo_stacks.length; index++) {
      this.profile.todoStack.push(todo_stacks[index].stack_detail?.s_Name);
    }
    this.userDataFetched = true;
    if (this.userPictureFetched && this.userDataFetched) {
      this.spinner.hide();
    }
  }
  getUserID() {
    return this.id;
  }

  getProfilePicture() {
    this.spinner.show();
    this.fetchData.getProfilepic(this.id)
      .subscribe(
        (data: any) => {
          if (data !== null && data != "") {
            this.profilePicAvailable = true;
            this.imageURL = `${"data:image/png;base64,"}${data}`;
            this.userPictureFetched = true;
            if (this.userPictureFetched && this.userDataFetched) {
              this.spinner.hide();
            }
          }
          else { this.profilePicAvailable = false; }
        },
        error => {
          this.spinner.hide();
          this.utillService.showError(error.statusText);
        },
      );
  }
  getUserId() {
    return this.authentication.getUser().emp_id;
  }
}

