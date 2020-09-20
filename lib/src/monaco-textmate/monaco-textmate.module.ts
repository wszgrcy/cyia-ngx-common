import { NgModule, ModuleWithProviders } from '@angular/core';
import { MonacoTextmateService } from './monaco-textmate.service';
import { TEXTMATE_PATH_CONFIG, TextmatePathConfig } from './vscode.define';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [MonacoTextmateService],
})
export class MonacoTextmateModule {
  static forRoot(
    config: TextmatePathConfig = {
      vscodeOnigurumaPath: 'assets/vscode-oniguruma/onig.wasm',
      textmateGrammarMapPath: 'assets/monaco/textmate-grammar-map.json',
      textmateThemeListPath: 'assets/monaco/theme-list.json',
      textmateConfigurationListPath: 'assets/monaco/textmate-configuration-list.json',
    }
  ): ModuleWithProviders<MonacoTextmateModule> {
    return {
      ngModule: MonacoTextmateModule,
      providers: [{ provide: TEXTMATE_PATH_CONFIG, useValue: config }],
    };
  }
}
