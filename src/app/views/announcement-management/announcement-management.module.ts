import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementManagementComponent } from './announcement-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AnnouncementManagementRoutingModule } from './announcement-management.routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AnnouncementManagementService } from '../announcement-management/announcement-management-service-rest';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AnnouncementManagementRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    AnnouncementManagementComponent,
  ],
  providers: [
    AnnouncementManagementService
  ]
})
export class AnnouncementManagementModule { }
