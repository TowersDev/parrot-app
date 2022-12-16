import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MdPage } from './md.page';

const routes: Routes = [
  {
    path: '',
    component: MdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MdPageRoutingModule {}
