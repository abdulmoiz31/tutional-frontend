import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LovManagementComponent } from './lov-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LovManagementRoutingModule } from './lov-management.routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LovManagementService } from './lov-management-service-rest';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    LovManagementRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot() // ToastrModule added
  ],
  declarations: [LovManagementComponent],
  providers: [LovManagementService]
})
export class LovManagementModule { }
