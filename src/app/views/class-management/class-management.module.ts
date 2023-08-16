import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



import { ClassManagementRoutingModule } from './class-management.routing.module';
import { ClassManagementComponent } from './class-management.component';
import { ClassManagementService } from './class-management-service-rest';
import { ClassListComponent } from './class-list/class-list.component';
import { CreateClassComponent } from './create-class/create-class.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SelectionListComponent } from './create-class/selection-list/selection-list.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ClassManagementRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    ClassManagementComponent,
    ClassListComponent,
    CreateClassComponent,
    SelectionListComponent
  ],
  providers: [
      ClassManagementService
  ]
})
export class ClassManagementModule { }
