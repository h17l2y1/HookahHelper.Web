import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'tobacco', loadChildren: () => import('./tobacco/tobacco.module').then(m => m.TobaccoModule) },
  { path: 'brand', loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
