import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialsManagementComponent } from './tutorials-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TutorialsManagementRoutingModule } from './tutorials-management.routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TutorialManagementService } from '../tutorials-management/tutorial-management-service-rest';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TutorialsManagementRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    TutorialsManagementComponent,
  ],
  providers: [
    TutorialManagementService
  ]
})
export class TutorialsManagementModule { }
