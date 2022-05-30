import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UserManagementModule } from './views/user-management/user-management.module';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { AppComponent } from './app.component';
// Import containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



const APP_CONTAINERS = [
  DefaultLayoutComponent
];
import {
  AppHeaderModule,
  AppSidebarModule,
} from '@coreui/angular';
// Import routing module
import { AppRoutingModule } from './app.routing';
// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { TutorialsComponent } from './views/tutorials/tutorials.component';
import { LovManagementModule } from './views/lov-management/lov-management.module';
import { TutorialsManagementModule } from './views/tutorials-management/tutorials-management.module';
import { AnnouncementManagementComponent } from './views/announcement-management/announcement-management.component';
import { AnnouncementManagementModule } from './views/announcement-management/announcement-management.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    UserManagementModule,
    LovManagementModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    TutorialsManagementModule,
    NgxDatatableModule,
    AnnouncementManagementModule
  ],

  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    ChangePasswordComponent,
    TutorialsComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    IconSetService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
