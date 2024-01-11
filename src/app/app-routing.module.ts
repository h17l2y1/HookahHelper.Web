import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./services/guards/auth.guard";

const routes: Routes = [
  {path: 'tobacco/:id', loadChildren: () => import('./tobacco/tobacco.module').then(m => m.TobaccoModule)},
  {path: 'tobacco', loadChildren: () => import('./tobacco/tobacco.module').then(m => m.TobaccoModule)},
  {path: 'brand', loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule)},
  {path: 'tag', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule), canActivate: [AuthGuard] },
  {path: 'constructor', loadChildren: () => import('./constructor/constructor.module').then(m => m.ConstructorModule)},
  {path: 'mixes', loadChildren: () => import('./top-mix/top-mix.module').then(m => m.TopMixModule)},
  {path: '', redirectTo: 'tobacco', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
