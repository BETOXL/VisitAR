import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisencuestasPageRoutingModule } from './misencuestas-routing.module';

import { MisencuestasPage } from './misencuestas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisencuestasPageRoutingModule
  ],
  declarations: [MisencuestasPage]
})
export class MisencuestasPageModule {}
