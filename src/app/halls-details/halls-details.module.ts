import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallsDetailsPageRoutingModule } from './halls-details-routing.module';

import { HallsDetailsPage } from './halls-details.page';
import { ReactiveFormsModule } from '@angular/forms';
// import { DatePickerModule } from 'ion-datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HallsDetailsPageRoutingModule,
    ReactiveFormsModule,
    // DatePickerModule
  ],
  declarations: [HallsDetailsPage]
})
export class HallsDetailsPageModule {}
