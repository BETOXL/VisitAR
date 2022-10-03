import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisencuestasPage } from './misencuestas.page';

const routes: Routes = [
  {
    path: '',
    component: MisencuestasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisencuestasPageRoutingModule {}
