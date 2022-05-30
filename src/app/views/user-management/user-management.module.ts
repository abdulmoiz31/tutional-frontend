import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { UserManagementService } from './user-management-service-rest';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserDetailComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    UserManagementRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot() 
  ],
  providers: [
    UserManagementService
  ],
  exports: [
    NgxDatatableModule,
    ReactiveFormsModule,
    UploaderModule
  ]
})
export class UserManagementModule { }
