import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallsPage } from './halls.page';

const routes: Routes = [
  {
    path: '',
    component: HallsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HallsPageRoutingModule {}
