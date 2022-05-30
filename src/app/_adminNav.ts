import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-home',
  },
  {
    name: 'User Management',
    url: '/user-management',
    icon: 'icon-user',
  },
  {
    name: 'Lov Management',
    url: '/lov-management',
    icon: 'icon-list',
  },
  {
    name: 'Tutorials Management',
    url: '/tutorials-management',
    icon: 'fa fa-book',
  },
  {
    name: 'Announcements',
    url: '/announcement-management',
    icon: 'fa fa-bullhorn',
  }
];