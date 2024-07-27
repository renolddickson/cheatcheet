import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './core/components/main/main.component';
import { CheatsheetComponent } from './core/components/cheatsheet/cheatsheet.component';
import { LoginGuard } from './core/services/Guard/login.guard';
import { AddCodeComponent } from './core/components/add-code/add-code.component';
import { CanDeactivateGuard } from './core/services/Guard/can-deactivate.guard';
import { AwstokenComponent } from './core/components/awstoken/awstoken.component';
import { TranslatePathComponent } from './core/components/translate-path/translate-path.component';
import { FontChangeComponent } from './core/components/font-change/font-change.component';
import { ProductDetailsTpComponent } from './core/components/product-details-tp/product-details-tp.component';
import { RecentlyvpTranslateComponent } from './core/components/recentlyvp-translate/recentlyvp-translate.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'token_converter',
    component: AwstokenComponent
  },
  {
    path: 'cheatsheet/:id',
    component: CheatsheetComponent,
  },
  {
    path: 'add/:id/:dataId',
    canActivate: [LoginGuard],
    component: AddCodeComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'add/:id',
    canActivate: [LoginGuard],
    component: AddCodeComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'translate',
    component: TranslatePathComponent
  },
  {
    path: 'translate-pd',
    component: ProductDetailsTpComponent
  },
  {
    path: 'fontfamily',
    component: FontChangeComponent
  },
  {
    path: 'sectiontranslation',
    component: RecentlyvpTranslateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
