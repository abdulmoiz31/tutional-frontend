import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialsManagementComponent } from './tutorials-management.component';

const routes: Routes = [
    {
        path: '',
        component: TutorialsManagementComponent,
        data: {
            title: 'User Management'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TutorialsManagementRoutingModule { }