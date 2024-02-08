import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard} from "./services/guards/admin.guard";
import {UrlIdResolver} from "./services/resolvers/url-id.resolver";

const routes: Routes = [
  {
    path: 'tobacco/:id',
    loadChildren: () => import('./tobacco/tobacco.module').then(m => m.TobaccoModule),
    resolve: {
      brandId: UrlIdResolver
    }
  },
  {path: 'tobacco', loadChildren: () => import('./tobacco/tobacco.module').then(m => m.TobaccoModule)},
  {path: 'brand', loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule)},
  {
    path: 'tag',
    loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
    canActivate: [AdminGuard]
  },
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
