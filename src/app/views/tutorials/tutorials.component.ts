import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../common/authentication-service.service';
import { TutorialsService } from './tutotrials-service.service';
import { UtillsService } from '../../common/utills-service.service';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit {

  loadingIndicator = false;
  reorderable = true;
  columns = [{ name: 'tutorial_Name', sortable: true }, { name: 'tutorial_URL', sortable: false }];
  ColumnMode = ColumnMode;
  accessToken = '';
  tutorials = [];
  data = [];
  
  constructor(private authentication: AuthenticationService, private tutorialsservice: TutorialsService, private utillservice: UtillsService) {
    this.accessToken = authentication.getAuthToken();
   // this.tutorialsList();
  }

  ngOnInit(): void {
  }

  tutorialsList() {
    this.loadingIndicator = true;
    this.tutorialsservice.getTutorial(this.accessToken)
      .subscribe((resData: any) => {
        let responseData: any = resData.tutorials;
        for (let index = 0; index < responseData.length; index++) {
          let raw_tutorial = responseData[index];
          let tutorial = { 'tutorial_Name': '', 'tutorial_URL': '' }
          tutorial['tutorial_Name'] = raw_tutorial.tutorial_Name;
          tutorial['tutorial_URL'] = raw_tutorial.tutorial_URL;
          this.tutorials.push(raw_tutorial);
        }
        this.data = this.tutorials;
        this.loadingIndicator = false;
      },
        error => {
          this.utillservice.showError(error.error.err.message);
        })
  }

}
