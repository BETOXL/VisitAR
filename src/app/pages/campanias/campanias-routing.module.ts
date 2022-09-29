import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaniasPage } from './campanias.page';

const routes: Routes = [
  {
    path: '',
    component: CampaniasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaniasPageRoutingModule {}
