import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassManagementComponent } from './class-management.component';

const routes: Routes = [
    {
        path: '',
        component: ClassManagementComponent,
        data: {
            title: 'Class Management'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClassManagementRoutingModule { }