import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserManagementComponent } from './user-management.component';
import { UpdateUserComponent } from './update-user/update-user.component';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
        data: {
            title: 'User Management'
        }
    },
    {
        path: 'user-detail/:id',
        component: UserDetailComponent,
        data: {
            title: 'User Detail View'
        }
    },
    {
        path: 'update-user/:id',
        component: UpdateUserComponent,
        data: {
            title: 'Update User'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }