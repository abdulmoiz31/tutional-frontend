import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementManagementComponent } from './announcement-management.component';

const routes: Routes = [
    {
        path: '',
        component: AnnouncementManagementComponent,
        data: {
            title: 'User Management'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnnouncementManagementRoutingModule { }