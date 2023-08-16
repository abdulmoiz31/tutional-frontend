import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TeacherManagementRoutingModule } from './teacher-management.routing.module';
import { TeacherManagementComponent } from './teacher-management.component';
import { TeacherManagementService } from './teacher-management-service-rest';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';
import { UpdateTeacherComponent } from './update-teacher/update-teacher.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TeacherManagementRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    TeacherManagementComponent,
    TeacherDetailComponent,
    UpdateTeacherComponent
  ],
  providers: [
      TeacherManagementService
  ]
})
export class TeacherManagementModule { }
