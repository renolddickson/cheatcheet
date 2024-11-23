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
import { JsonMigraterComponent } from './core/components/json-migrater/json-migrater.component';
import { UndoRedoDemoComponent } from './core/components/undo-redo-demo/undo-redo-demo.component';
import { AngulatToHtmlComponent } from './core/components/angulat-to-html/angulat-to-html.component';

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
    path: 'json-migrate',
    component: JsonMigraterComponent
  },
  {
    path: 'undo-redo',
    component: UndoRedoDemoComponent
  },
  {
    path: 'fontfamily',
    component: FontChangeComponent
  },
  {
    path: 'angulartohtml',
    component: AngulatToHtmlComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
