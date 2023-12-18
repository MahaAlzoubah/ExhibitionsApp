import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallsDetailsPageRoutingModule } from './halls-details-routing.module';

import { HallsDetailsPage } from './halls-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HallsDetailsPageRoutingModule
  ],
  declarations: [HallsDetailsPage]
})
export class HallsDetailsPageModule {}
