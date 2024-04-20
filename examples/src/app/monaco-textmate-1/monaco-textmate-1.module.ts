import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoTextmate1Component } from './monaco-textmate-1.component';
import { CyiaMonacoTextmateModule } from '@cyia/ngx-common/monaco-textmate';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
@NgModule({
  imports: [
    CommonModule,
    CyiaMonacoTextmateModule.forRoot({
      vscodeOnigurumaPath: environment.assetsPrefix + 'vscode-oniguruma/onig.wasm',
      textmateGrammarMapPath: environment.assetsPrefix + 'monaco/textmate-grammar-map.json',
      textmateThemeListPath: environment.assetsPrefix + 'monaco/theme-list.json',
      textmateConfigurationListPath: environment.assetsPrefix + 'monaco/textmate-configuration-list.json',
    }),
    FormsModule,
  ],
  declarations: [MonacoTextmate1Component],
})
export class MonacoTextmate1Module {}
