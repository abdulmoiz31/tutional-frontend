import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../common/authentication-service.service';
import { navItems } from '../../_nav';
import { adminNavItems } from '../../_adminNav';
import { userTypes } from '../../mapping/userTypes';
import { DataService } from '../../common/dataservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public sidebarMinimized = false;
  public navigationItems = [];
  public isAdmin: boolean = true;
  subscription: any;
  
  //avatar image can be changed for every user
  avatarUrl = "assets/img/avatar/boy.png";

  constructor(private authentication: AuthenticationService, private router: Router, private spinner: NgxSpinnerService, private dataservice: DataService) {
    this.navigationItems = this.getNavigationItems();
  }
  ngOnInit() {
    if (!this.authentication.isAdmin()) {
      this.isAdmin = false
    }
    let url = this.dataservice.getAvatarUrl();
    if (url != "") {
      this.avatarUrl = `${"data:image/png;base64,"}${url}`;
    }
    this.subscription = this.dataservice.getProfilePictureChangeEmitter()
      .subscribe(item => this.updateAvatar(item)
      );
  };
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout() {
    this.router.navigate(['/login']);
  }
  getUserId() {
    return this.authentication.getUser().emp_id;
  }
  getNavigationItems() {
    if (this.authentication.getUser().user_Type == userTypes.admin) {
      return adminNavItems;
    }
    else if (this.authentication.getUser().user_Type == userTypes.associate) {
      return navItems;
    }
  }
  updateAvatar(url) {
    this.avatarUrl = `${"data:image/png;base64,"}${url}`;
  }
};
