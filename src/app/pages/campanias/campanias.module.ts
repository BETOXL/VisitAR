import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaniasPageRoutingModule } from './campanias-routing.module';

import { CampaniasPage } from './campanias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaniasPageRoutingModule
  ],
  declarations: [CampaniasPage]
})
export class CampaniasPageModule {}
