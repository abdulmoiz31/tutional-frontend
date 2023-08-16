import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';
import { TeacherManagementComponent } from './teacher-management.component';
import { UpdateTeacherComponent } from './update-teacher/update-teacher.component';

const routes: Routes = [
    {
        path: '',
        component: TeacherManagementComponent,
        data: {
            title: 'Teacher Management'
        }
    },
    {
        path: 'teacher-detail',
        component: TeacherDetailComponent,
        data: {
            title: 'Teacher Detail View'
        }
    },
    {
        path: 'update-teacher',
        component: UpdateTeacherComponent,
        data: {
            title: 'Update Teacher'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeacherManagementRoutingModule { }