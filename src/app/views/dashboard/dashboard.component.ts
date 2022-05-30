import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { DashboardService } from './dashboard-service-rest';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../common/authentication-service.service';
import { UtillsService } from '../../common/utills-service.service';


@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ["dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {

  accessToken: string = "";
  isAdmin: boolean = false;
  showToggle: boolean = false;

  radioModel: string = 'Month';
  isTrue: boolean = false;
  comparison: string = ""
  showAnnouncement: boolean = false;
  Announcements = [];
  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private utillService: UtillsService,
  ) {
   
  };
  
  ngOnInit(): void {
    
  }
}
