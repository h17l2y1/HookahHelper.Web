import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard} from "./services/guards/admin.guard";
import {LoginComponent} from "./authorization/login/login.component";
import {SignUpComponent} from "./authorization/sign-up/sign-up.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'brands', loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule)},
  {path: 'tobaccos', loadChildren: () => import('./tobacco/tobacco.module').then(m => m.TobaccoModule)},
  {
    path: 'tags',
    loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
    canActivate: [AdminGuard]
  },
  {path: 'constructor', loadChildren: () => import('./constructor/constructor.module').then(m => m.ConstructorModule)},
  {path: 'mixes', loadChildren: () => import('./top-mix/top-mix.module').then(m => m.TopMixModule)},
  {path: '', redirectTo: '/tobaccos', pathMatch: 'full'},
  {path: '**', redirectTo: '/tobaccos', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
