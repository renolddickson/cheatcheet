import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CheatsheetComponent } from './components/cheatsheet/cheatsheet.component';
import { RouterModule } from '@angular/router';
import { AddCodeComponent } from './components/add-code/add-code.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  HighlightModule,
  HIGHLIGHT_OPTIONS,
  HighlightOptions,
} from 'ngx-highlightjs';
import { DialogComponent } from './components/dialog/dialog.component';
import { AwstokenComponent } from './components/awstoken/awstoken.component';
import { TranslatePathComponent } from './components/translate-path/translate-path.component';

@NgModule({
  declarations: [MainComponent, CheatsheetComponent, AddCodeComponent, DialogComponent, AwstokenComponent,TranslatePathComponent],

  imports: [
    CommonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    HighlightModule,
    MatTabsModule,
    ClipboardModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      },
    },
  ],
})
export class CoreModule {}
