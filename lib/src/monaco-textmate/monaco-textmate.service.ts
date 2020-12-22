import { Injectable, Inject } from '@angular/core';
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma';

import { Registry, IOnigLib } from 'vscode-textmate';
import { HttpClient } from '@angular/common/http';
import * as monaco from 'monaco-editor';
import { RequestBase } from './request.base';
import { VscodeTheme, builtTheme } from './vscode-theme';
import { VscodeTextmateGrammar } from './vscode-textmate.grammar';
import { VscodeTextmateConfiguration } from './vscode-textmate.configuration';
import { LanguageInfo, TEXTMATE_PATH_CONFIG, TextmatePathConfig } from './vscode.define';

@Injectable()
export class CyiaMonacoTextmateService extends RequestBase {
  private grammar: VscodeTextmateGrammar;
  private configuration: VscodeTextmateConfiguration;
  private theme: VscodeTheme;
  constructor(http: HttpClient, @Inject(TEXTMATE_PATH_CONFIG) config: TextmatePathConfig) {
    super(http);
    ({
      vscodeOnigurumaPath: this.vscodeOnigurumaPath,
      textmateGrammarMapPath: this.textmateGrammarMapPath,
      textmateThemeListPath: this.textmateThemeListPath,
      textmateConfigurationListPath: this.textmateConfigurationListPath,
    } = config);
    this.grammar = new VscodeTextmateGrammar(this.http, this.textmateGrammarMapPath);
    this.configuration = new VscodeTextmateConfiguration(this.http, this.textmateConfigurationListPath);
    this.theme = new VscodeTheme(this.http, this.textmateThemeListPath);
  }
  private readonly vscodeOnigurumaPath: string;

  private readonly textmateGrammarMapPath: string;

  private readonly textmateThemeListPath: string;

  private readonly textmateConfigurationListPath: string;

  private registry: Registry;
  private monaco: typeof monaco;
  async init() {
    await Promise.all([this.grammar.loadGrammar()]);
    this.register(this.loadWasm());
    return this.registerLanguages();
  }

  private async loadWasm(): Promise<IOnigLib> {
    const data = await this.requestArrayBuffer(this.vscodeOnigurumaPath);
    await loadWASM(data);
    const onigLib = Promise.resolve({
      createOnigScanner,
      createOnigString,
    });
    return onigLib;
  }

  private register(onigLib: Promise<IOnigLib>): void {
    this.registry = new Registry({
      onigLib,
      loadGrammar: (scopeName: string) => {
        return this.grammar.getIRawGrammar(scopeName);
      },
      getInjections: (scopeName: string) => {
        return this.grammar.scopeName2Injections.get(scopeName);
      },
    });
    this.grammar.setRegisty(this.registry);
  }

  public setMonaco(monaco) {
    this.monaco = monaco;
    this.grammar.setMonaco(monaco);
  }
  getThemeList() {
    return this.theme.getThemeList();
  }

  private async fetchLanguageInfo(language: string): Promise<LanguageInfo> {
    const [tokensProvider, configuration] = await Promise.all([
      this.grammar.getTokensProviderForLanguage(language),
      this.configuration.fetchConfiguration(language),
    ]);
    return { tokensProvider, configuration };
  }
  async defineTheme(name: string): Promise<string> {
    const theme = await this.theme.load(name);
    this.registry.setTheme(theme);
    const colorMap = this.registry.getColorMap();
    colorMap[0] = colorMap[1];
    name = name.replace(/[^a-z0-9\-]/gi, '');
    this.monaco.editor.defineTheme(name, {
      base: builtTheme(name),
      inherit: false,
      rules: [],
      colors: {},
      encodedTokensColors: colorMap,
    });
    return name;
  }

  private async registerLanguages(): Promise<void> {
    const languages: monaco.languages.ILanguageExtensionPoint[] = await this.configuration.getTextmateConfigurationList();
    for (const extensionPoint of languages) {
      const { id: languageId } = extensionPoint;
      this.monaco.languages.register(extensionPoint);
      this.monaco.languages.onLanguage(languageId, async () => {
        const { tokensProvider, configuration } = await this.fetchLanguageInfo(languageId);

        if (tokensProvider != null) {
          this.monaco.languages.setTokensProvider(languageId, tokensProvider);
        }

        if (configuration != null) {
          this.monaco.languages.setLanguageConfiguration(languageId, configuration);
        }
      });
    }
  }
  /** 手动注册语言 */
  async manualRegisterLanguage(languageId: string) {
    const languages: monaco.languages.ILanguageExtensionPoint[] = await this.configuration.getTextmateConfigurationList();
    const extensionPoint = languages.find(
      (item) => item.id === languageId || (item.aliases || []).includes(languageId)
    );
    if (!extensionPoint) {
      throw new Error(`no language ${languageId} define`);
    }
    this.monaco.languages.register(extensionPoint);
    const { tokensProvider, configuration } = await this.fetchLanguageInfo(extensionPoint.id);

    if (tokensProvider != null) {
      this.monaco.languages.setTokensProvider(extensionPoint.id, tokensProvider);
    }

    if (configuration != null) {
      this.monaco.languages.setLanguageConfiguration(extensionPoint.id, configuration);
    }
  }
}
