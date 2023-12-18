import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallsDetailsPage } from './halls-details.page';

const routes: Routes = [
  {
    path: '',
    component: HallsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HallsDetailsPageRoutingModule {}
