import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomPagePage } from './custom-page.page';

const routes: Routes = [
  {
    path: '',
    component: CustomPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomPagePageRoutingModule {}
