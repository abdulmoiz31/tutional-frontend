import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-home',
  },
  {
    name: 'Student Management',
    url: '/user-management',
    icon: 'icon-user',
  },
  {
    name: 'Teacher Management',
    url: '/teacher-management',
    icon: 'icon-list',
  },
  {
    name: 'Tutorials Management',
    url: '/tutorials-list',
    icon: 'fa fa-book',
  },
  {
    name: 'Class Management',
    url: '/class-management',
    icon: 'fa fa-bullhorn',
  }
];