import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { UtillsService } from '../../../common/utills-service.service';
import { AuthenticationService } from '../../../common/authentication-service.service';
import { UserManagementService } from '../user-management-service-rest';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {

  @ViewChild('attachments') attachment: any;
  stackList = [];
  todoList = [];
  designationList = [];
  locationList = [];
  selectedItemsCurrent = [];
  selectedItemsTodo = [];
  dropdownSettings: IDropdownSettings;
  dropdownSettingsDesignation: IDropdownSettings;
  closeResult: string;
  file_name = "";
  fileSize = "";
  file: boolean = false;
  uploadedFiles: String = '';
  listOfFiles: any[] = [];
  accessToken: string = "";
  id;
  hasEditAccess = false;
  adminEditAccess = true;
  project_Name: String[] = [];
  temp = [];
  fileUrls = [];
  arr = [];
  arr2 = [];
  projectDetailsSection = new FormArray([
    new FormGroup({
      'currentprojects': new FormControl(
        null,
        [Validators.required, Validators.maxLength(200), Validators.minLength(3)]
      ),
      'projectlead': new FormControl(
        null,
        [Validators.required, Validators.maxLength(50), Validators.minLength(3)]
      ),
    })
  ]);
  myReactiveForm: FormGroup;
  subscription: Subscription;
  isAdmin = false;

  constructor(private modalService: NgbModal, private authenticationService: AuthenticationService,
    private utillservice: UtillsService, private usermanagementservice: UserManagementService, private spinner: NgxSpinnerService, private _Activatedroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this._Activatedroute.params.subscribe(params => {
      this.id = params.id;
      this.isAdmin = this.authenticationService.isAdmin();
      this.getUserData();
      if (this.authenticationService.getUser().emp_id == this.id || this.authenticationService.isAdmin()) {
        this.hasEditAccess = true;
      }
      this.accessToken = this.authenticationService.getAuthToken();
      this.getStackCurrent();
      this.getStackTodo();
      this.getDesignation();
      this.getCenter();
      this.getAllCvs(this.id);

      this.myReactiveForm = new FormGroup({
        'fullname': new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'contact': new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.minLength(8)]),
        'experiance': new FormControl(null, [Validators.required, Validators.max(50), Validators.min(0)]),
        'currentstack': new FormControl('', Validators.required),
        'todostack': new FormControl('', Validators.required),
        'cvattachment': new FormControl(null),
        'linkedinlink': new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]),
        'center': new FormControl('', Validators.required),
        'designation': new FormControl('', Validators.required),
        'projectDetailSection': this.projectDetailsSection,
      });

      if (!this.authenticationService.isAdmin()) {
        this.adminEditAccess = false;
        this.myReactiveForm.get('designation').disable();
        this.myReactiveForm.get('center').disable();
      }
      else {
        this.myReactiveForm.get('designation').enable();
        this.myReactiveForm.get('center').enable();
      }

      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.dropdownSettingsDesignation = {
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select',
        unSelectAllText: 'UnSelect',
      };
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddProject() {
    (<FormArray>this.myReactiveForm.get('projectDetailSection'))
      .push(
        new FormGroup({
          'currentprojects': new FormControl(
            null,
            [Validators.required, Validators.maxLength(200), Validators.minLength(3)]
          ),
          'projectlead': new FormControl(
            null,
            [Validators.required, Validators.maxLength(50), Validators.minLength(3)]
          ),
        })
      )
  };

  onDeleteProject(index: number) {
    this.projectDetailsSection.removeAt(index);
  }

  onSubmit() {
    if (this.myReactiveForm.status == "VALID") {
      this.spinner.show();
      if (this.authenticationService.isAdmin()) {
        this.updateUserLocation();
        this.updateEmpDesignation();
      }
      this.usermanagementservice.updateUser(this.myReactiveForm.value, this.id).subscribe((resData: any) => {
        this.spinner.hide();
        this.utillservice.showSuccess(resData.status);
        this.router.navigate(['user-management/user-detail/' + this.id]);
      },
        error => {
          this.spinner.hide();
          this.utillservice.showError(error.statusText);
        })
    }
  }


  onFileChanged(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      var size = selectedFile.size;
      var kbSize = Math.round(size / 1024);
      var mbSize = Math.round(kbSize / 1024);
      if (mbSize <= 200) {
        this.uploadCvFile(selectedFile, this.id);
        this.file = false;
        this.fileSize = "";
      }
      else {
        this.fileSize = "File Size too large"
        this.file = true;
      }
    }
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.spinner.show();
    this.usermanagementservice.deleteCV(this.listOfFiles[index], this.id).subscribe((resData: any) => {
      this.utillservice.showSuccess('File Deleted')
      this.listOfFiles.splice(index, 1);
      this.fileUrls.splice(index, 1);
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
        this.utillservice.showError('Unable to Delete CV')
      })

  }

  open(content) {
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

  //current stack item functions
  onItemSelectCurrent(item: any) {
    this.arr.push(item);
    this.selectedItemsCurrent = this.arr;
  }
  onSelectAllCurrentStackCurrent(items: any) {
    this.arr = this.stackList;
    this.selectedItemsCurrent = this.arr;
  }
  unSelectCurrent(item: any) {
    this.arr.splice(this.arr.indexOf(item), 1);
    this.selectedItemsCurrent = this.arr;
  }
  unSelectAllCurrent(items: any) {
    this.arr = [];
    this.selectedItemsCurrent = this.arr;
  }

  //todo stach item functions
  onItemSelectTodo(item: any) {
    this.arr2.push(item);
    this.selectedItemsTodo = this.arr2;
  }
  onSelectAllTodo(items: any) {
    this.arr2 = this.todoList;
    this.selectedItemsTodo = this.arr2;
  }
  unSelectTodo(item: any) {
    this.arr2.splice(this.selectedItemsTodo.indexOf(item), 1);
    this.selectedItemsTodo = this.arr2;
  }
  unSelectAllTodo(items: any) {
    this.arr2 = []
    this.selectedItemsTodo = this.arr2;
  }

  getStackCurrent() {
    this.spinner.show();
    const tmp = [];
    this.usermanagementservice.getStackLov(this.accessToken).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        tmp.push({ item_id: data[i]._id, item_text: data[i].s_Name });
      }
      this.stackList = tmp;
      this.spinner.hide();
    });

  }

  getStackTodo() {
    this.spinner.show();
    const tmp = [];
    this.usermanagementservice.getStackLov(this.accessToken).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        tmp.push({ item_id: data[i]._id, item_text: data[i].s_Name });
      }
      this.todoList = tmp;
      this.spinner.hide();
    }
    );
  }

  getDesignation() {
    this.spinner.show();
    this.usermanagementservice.getDesignationLov(this.accessToken).subscribe(response => {
      this.designationList = response.data;
      this.spinner.hide();
    });
  }

  getCenter() {
    this.spinner.show();
    this.usermanagementservice.getCenter(this.accessToken).subscribe(response => {
      this.locationList = response.data;
      this.spinner.hide();
    });
  }
  uploadCvFile(file, id) {
    this.spinner.show();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let data: any = reader.result;
      let base64data = data.split('base64,')[1];
      this.usermanagementservice.uploadCV(base64data, file.name.split('.')[0].replace(/\s/g, ''), id).subscribe((resData: any) => {
        this.spinner.hide();
        this.fileUrls.push(resData.base64);
        this.listOfFiles.push(file.name.split('.')[0].replace(/\s/g, ''));
        this.utillservice.showSuccess(resData.msg);
      },
        error => {
          this.spinner.hide();
          this.utillservice.showError("Unable To Upload CV")
        })

    };
  }

  getUserData() {
    this.spinner.show();
    this.usermanagementservice.fetchUserdetail(this.id).subscribe((resData: any) => {
      this.spinner.hide();
      this.populateData(resData);
    },
      error => {
        this.spinner.hide();
      });
  }

  populateData(data) {
    for (let i = 0; i < data.Current_Projects.length; i++) {
      this.myReactiveForm.get('projectDetailSection')['controls'][i]['controls'].currentprojects.setValue(data.Current_Projects[i].project_Name);
      this.myReactiveForm.get('projectDetailSection')['controls'][i]['controls'].projectlead.setValue(data.project_Lead[i].p_Lead_Name);
      if (i != data.Current_Projects.length - 1) {
        this.onAddProject();
      }
    }

    this.myReactiveForm.get('fullname').setValue(data?.username);
    this.myReactiveForm.get('email').setValue(data?.username);
    this.myReactiveForm.get('contact').setValue(data?.contact_num);
    this.myReactiveForm.get('designation').setValue(data.designation?._id);
    this.myReactiveForm.get('experiance').setValue(data?.experience);
    this.myReactiveForm.get('linkedinlink').setValue(data?.linkedin_URL);
    this.myReactiveForm.get('center').setValue(data.city?._id);

    let temp = [];

    for (let i = 0; i < data.current_Stack.length; ++i) {
      temp.push(
        {
          "_id": data.current_Stack[i].stack_detail._id,
          "s_id": data.current_Stack[i].stack_detail.s_Id,
          "s_Name": data.current_Stack[i].stack_detail.s_Name
        }
      );
    }

    for (let index = 0; index < temp.length; index++) {
      this.arr.push
        ({
          item_id: temp[index]._id,
          item_text: temp[index].s_Name
        })
    }
    this.selectedItemsCurrent = this.arr;
    this.myReactiveForm.controls.currentstack.setValue(this.selectedItemsCurrent);

    let temp2 = [];

    for (let i = 0; i < data.to_Do_Stack.length; i++) {
      temp2.push(
        {
          "_id": data.to_Do_Stack[i].stack_detail._id,
          "s_id": data.to_Do_Stack[i].stack_detail.s_Id,
          "s_Name": data.to_Do_Stack[i].stack_detail.s_Name
        }
      );
    }

    for (let index = 0; index < temp2.length; index++) {
      this.arr2.push
        ({
          item_id: temp2[index]._id,
          item_text: temp2[index].s_Name
        })
    }
    this.selectedItemsTodo = this.arr2;
    this.myReactiveForm.controls.todostack.setValue(this.selectedItemsTodo);
  }

  getAllCvs(id) {
    this.spinner.show();
    this.usermanagementservice.getAllCVS(id).subscribe((resData: any) => {
      this.spinner.hide();
      for (let index = 0; index < resData.length; index++) {
        this.listOfFiles.push(resData[index].name);
        this.fileUrls.push(resData[index].url);
      }
    },
      error => {
        this.spinner.hide();
        this.utillservice.showError('Unable to fetch Data')
      });
  }

  getFileUrl(index) {
    const source = `data:application/pdf;base64,${this.fileUrls[index]}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${'CV'}.pdf`
    link.click();
  }
  updateUserLocation() {
    this.spinner.show();
    this.usermanagementservice.updateLocation(this.myReactiveForm.value, this.id).subscribe((resData: any) => {
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      })
  }

  updateEmpDesignation() {
    this.spinner.show();
    this.usermanagementservice.updateDesignation(this.myReactiveForm.value, this.id).subscribe((resData: any) => {
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      })
  }
}


