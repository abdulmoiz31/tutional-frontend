import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss']
})
export class ClassManagementComponent implements OnInit {
  displayList = true;
  classId = null;

  constructor() { }

  ngOnInit(): void {
  }

  showCreateClass(value){
    this.displayList = value;
  }

  onClassEdit(classID){
    this.classId = classID;
    this.displayList = !this.displayList;
  }

  onCLassCreate(){
    this.displayList = !this.displayList;
  }
}
