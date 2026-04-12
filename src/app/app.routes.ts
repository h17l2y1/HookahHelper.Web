import { Routes } from '@angular/router';
import { BrandFilterOptionsResolver } from './brand/brand-filter-options.resolver';
import { BrandQueryParamResolver } from './brand/brand-query-param.resolver';
import { BrandTableComponent } from './brand/brand-table/brand-table.component';
import { ConstructorComponent } from './constructor/constructor.component';
import { TobaccoResolver } from './services/resolvers/tobacco.resolver';
import { TagTableComponent } from './tag/tag-table/tag-table.component';
import { TobaccoFilterOptionsResolver } from './tobacco/tobacco-table/tobacco-filter-options.resolver';
import { TobaccoLinesResolver } from './tobacco/tobacco-table/tobacco-lines.resolver';
import { TobaccoQueryParamResolver } from './tobacco/tobacco-table/tobacco-query-param.resolver';
import { TobaccoTableComponent } from './tobacco/tobacco-table/tobacco-table.component';
import { TobaccoViewPageComponent } from './tobacco/tobacco-table/tobacco-view-page/tobacco-view-page.component';
import { TopMixComponent } from './top-mix/top-mix.component';

export const routes: Routes = [
  {
    path: 'brands',
    component: BrandTableComponent,
    resolve: {
      countries: BrandFilterOptionsResolver,
      queryParam: BrandQueryParamResolver,
    },
  },
  {
    path: 'tobaccos',
    component: TobaccoTableComponent,
    resolve: {
      filterOptions: TobaccoFilterOptionsResolver,
      lines: TobaccoLinesResolver,
      queryParam: TobaccoQueryParamResolver,
    },
  },
  {
    path: 'tobacco/:id',
    component: TobaccoViewPageComponent,
    resolve: { tobacco: TobaccoResolver },
  },
  { path: 'tags', component: TagTableComponent },
  {
    path: 'constructor',
    component: ConstructorComponent,
  },
  {
    path: 'mixes',
    component: TopMixComponent,
  },
  { path: '', redirectTo: '/tobaccos', pathMatch: 'full' },
  { path: '**', redirectTo: '/tobaccos', pathMatch: 'full' },
];
