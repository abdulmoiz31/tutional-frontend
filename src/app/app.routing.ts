import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAuthGuard } from './auth-guards/adminAuth.guard';
import { LoggedAuthGuard } from './auth-guards/loggedAuth.guard';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { TutorialsManagementComponent } from './views/tutorials-management/tutorials-management.component';
import { TutorialsComponent } from './views/tutorials/tutorials.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Change Password'
    },
    children: [
      {
        path: 'change-password',
        canActivate: [LoggedAuthGuard],
        component: ChangePasswordComponent
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Tutorials'
    },
    children: [
      {
        path: 'tutorials-list',
        canActivate: [LoggedAuthGuard],
        component: TutorialsManagementComponent
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'User Management'
    },
    children: [
      {
        path: 'user-management',
        canActivate: [LoggedAuthGuard],
        loadChildren: () => import('./views/user-management/user-management.module').then(m => m.UserManagementModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Teacher Management'
    },
    children: [
      {
        path: 'teacher-management',
        canActivate: [LoggedAuthGuard],
        loadChildren: () => import('./views/teacher-management/teacher-management.module').then(m => m.TeacherManagementModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Class Management'
    },
    children: [
      {
        path: 'class-management',
        canActivate: [LoggedAuthGuard],
        loadChildren: () => import('./views/class-management/class-management.module').then(m => m.ClassManagementModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [LoggedAuthGuard],
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Lov Management'
    },
    children: [
      {
        path: 'lov-management',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./views/lov-management/lov-management.module').then(m => m.LovManagementModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Tutorials Management'
    },
    children: [
      {
        path: 'tutorials-management',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./views/tutorials-management/tutorials-management.module').then(m => m.TutorialsManagementModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Announcement Management'
    },
    children: [
      {
        path: 'announcement-management',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./views/announcement-management/announcement-management.module').then(m => m.AnnouncementManagementModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
