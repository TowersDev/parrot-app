import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MdPageRoutingModule } from './md-routing.module';

import { MdPage } from './md.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MdPageRoutingModule
  ],
  declarations: [MdPage]
})
export class MdPageModule {}
