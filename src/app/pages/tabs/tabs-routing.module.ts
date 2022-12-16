import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchPageModule),
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('./notification/notification.module').then(
            (m) => m.NotificationPageModule
          ),
      },
      {
        path: 'md',
        loadChildren: () =>
          import('./md/md.module').then((m) => m.MdPageModule),
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
