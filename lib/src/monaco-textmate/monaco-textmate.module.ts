import { NgModule, ModuleWithProviders } from '@angular/core';
import { CyiaMonacoTextmateService } from './monaco-textmate.service';
import { TEXTMATE_PATH_CONFIG, TextmatePathConfig } from './vscode.define';
import { HttpClientModule } from '@angular/common/http';
/**
 * @docs-module
 * @docs-overview overview.md
 * @docs-example example.md
 */
@NgModule({
  imports: [HttpClientModule],
  providers: [CyiaMonacoTextmateService],
})
export class CyiaMonacoTextmateModule {
  static forRoot(
    config: TextmatePathConfig = {
      vscodeOnigurumaPath: 'assets/vscode-oniguruma/onig.wasm',
      textmateGrammarMapPath: 'assets/monaco/textmate-grammar-map.json',
      textmateThemeListPath: 'assets/monaco/theme-list.json',
      textmateConfigurationListPath: 'assets/monaco/textmate-configuration-list.json',
    }
  ): ModuleWithProviders<CyiaMonacoTextmateModule> {
    return {
      ngModule: CyiaMonacoTextmateModule,
      providers: [{ provide: TEXTMATE_PATH_CONFIG, useValue: config }],
    };
  }
}
