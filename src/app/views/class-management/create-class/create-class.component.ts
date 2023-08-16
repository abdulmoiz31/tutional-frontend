import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtillsService } from '../../../common/utills-service.service';
import { IDS } from '../../../constants/app.constants';
import { ClassManagementService } from '../class-management-service-rest';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {
  @Output() classCreated = new EventEmitter<any>();
  @Input() classId = null;
  replacementArray = [];
  classForm: FormGroup;
  _IDS: any = IDS;
  steppers = [this._IDS.STEPPER_TEACHERS ,this._IDS.STEPPER_STUDENTS]
  currentStepper = "";
  students = [];
  teachers = [];
  studentIds = [];
  teacherIds = [];

  constructor(private classManagementService: ClassManagementService, private toaster: UtillsService, private spinner: NgxSpinnerService) {
    
  }

  ngOnInit(): void {
    this.createForm()
    this.spinner.show()
    if (this.classId != null) {
      this.spinner.show()
      this.classManagementService.getClassById(this.classId)
      .subscribe((resData:any) => {
        this.classForm.controls.className.setValue(resData.classData.className)
        resData.classData.students.forEach(selectedStudent => {
          this.studentIds.push(selectedStudent.email)
        });
        resData.classData.teachers.forEach(selectedTeacher => {
          this.teacherIds.push(selectedTeacher.email)
        });
        this.classManagementService.getStudents()
      .subscribe((res:any) => {
        this.spinner.hide()
        for (let index = 0; index < res.length; index++) {
          let found = false;
          resData.classData.students.forEach(selectedStudent => {
            if (!found) {
              res[index].checked = res[index].email == selectedStudent.email? true : false
              found = res[index].checked;
              }
          });
        }
        this.students = res;
      },(err)=>{
        this.spinner.hide()
      });
      this.classManagementService.getTeachers()
      .subscribe((res:any) => {
        this.spinner.hide()
        for (let index = 0; index < res.length; index++) {
          let found = false;
          resData.classData.teachers.forEach(selectedTeacher => {
            if (!found) { 
            res[index].checked = res[index].email == selectedTeacher.email? true : false
            found = res[index].checked;
            }
          });
        }
        this.teachers = res;
        this.currentStepper = "SELECT_TEACHERS";
      },(err)=>{
        this.spinner.hide()
      });
      },(err)=>{
        this.spinner.hide()
      });
    }
    else{
      this.classManagementService.getStudents()
      .subscribe((res:any) => {
        this.spinner.hide()
        for (let index = 0; index < res.length; index++) {
           res[index].checked = false;
        }
        this.students = res;
      },(err)=>{
        this.spinner.hide()
      });
      this.classManagementService.getTeachers()
      .subscribe((res:any) => {
        this.spinner.hide()
        for (let index = 0; index < res.length; index++) {
           res[index].checked = false;
        }
        this.teachers = res;
        this.currentStepper = "SELECT_TEACHERS";
      },(err)=>{
        this.spinner.hide()
      });
    }
  }
  ngAfterViewInit(): void {
    
  }

  createForm(){
    this.classForm = new FormGroup({
      className: new FormControl('', Validators.required)
    });
  }

  onNext(){
    let currentIndex = this.steppers.indexOf(this.currentStepper)
    if (currentIndex+1 < this.steppers.length) {
      this.currentStepper = this.steppers[currentIndex+1]
    }
  }

  onBack(){
    let currentIndex = this.steppers.indexOf(this.currentStepper)
    if (currentIndex-1 > -1) {
      this.currentStepper = this.steppers[currentIndex-1]
    }
  }

  onSubmit(){
    if (this.classId) {
      let newAdded = []
      let oldRemoved = []
      let students = this.selectedStudents()
      let teachers = this.selectedTeachers()
      students.forEach(student => {
        if (!this.studentIds.includes(student.email)) {
          newAdded.push(student.email)
        }
      });

      teachers.forEach(teacher => {
        if (!this.teacherIds.includes(teacher.email)) {
          newAdded.push(teacher.email)
        }
      });

      this.studentIds.forEach(email => {
        if (this.students.filter((student) => {return student.email == email}).length == 0) {
          oldRemoved.push(email)
        }
      });

      this.teacherIds.forEach(email => {
        if (this.teachers.filter((teacher) => {return teacher.email == email}).length == 0) {
          oldRemoved.push(email)
        }
      });
    let payload = {
      newAdded: newAdded,
      oldRemoved: oldRemoved,
      students: students,
      teachers: teachers,
      className: this.classForm.value.className,
      classId: this.classId
    };

    this.spinner.show()
    this.classManagementService.updateClass(payload)
    .subscribe((res:any) => {
      this.spinner.hide()
      this.toaster.showSuccess(res.message)
      this.classCreated.emit();
    },(err)=>{
      this.spinner.hide()
    });
    } else {
    let payload = {
      students: this.selectedStudents(),
      teachers: this.selectedTeachers(),
      className: this.classForm.value.className
    };

    this.spinner.show()
    this.classManagementService.createClass(payload)
    .subscribe((res:any) => {
      this.spinner.hide()
      this.toaster.showSuccess("Class Created Successfully")
      this.classCreated.emit();
    },(err)=>{
      this.spinner.hide()
    });
    }
  }

  selectedStudents(){
    let selectedStudents = []
    for (let index = 0; index < this.students.length; index++) {
      const student = this.students[index];
      if (student.checked) {
        selectedStudents.push({name: student.name, email: student.email})
      }
    }
    return selectedStudents;
  }

  selectedTeachers(){
    let selectedTeachers = []
    for (let index = 0; index < this.teachers.length; index++) {
      const teacher = this.teachers[index];
      if (teacher.checked) {
        selectedTeachers.push({name: teacher.name, email: teacher.email})
      }
    }
    return selectedTeachers;
   }

  onCheckStudent(student){
    this.students[student.index] = student.checked
  }

  onCheckTeacher(teacher){
    this.teachers[teacher.index] = teacher.checked
  }

  isValid(){
    let teachersCount = 0;
    let studentsCount = 0;
    this.students.forEach(student => {
      if (student.checked) {
        studentsCount++;
      }
    });

    this.teachers.forEach(teacher => {
      if (teacher.checked) {
        teachersCount++;
      }
    });
    if (teachersCount > 0 && studentsCount > 0 && !this.classForm.invalid) {
      return true;
    }
    return false;
  }
}
