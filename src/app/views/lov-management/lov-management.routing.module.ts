import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LovManagementComponent } from './lov-management.component';

const routes: Routes = [
    {
        path: '',
        component: LovManagementComponent,
        data: {
            title: 'User Management'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LovManagementRoutingModule { }