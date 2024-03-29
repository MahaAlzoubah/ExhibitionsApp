import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallsPageRoutingModule } from './halls-routing.module';
import {ReactiveFormsModule} from '@angular/forms';

import { HallsPage } from './halls.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HallsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [HallsPage]
})
export class HallsPageModule {}
