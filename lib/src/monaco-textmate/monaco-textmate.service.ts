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
/**
 * @docs-service
 * @description monaco-editor使用textmate方式解析代码的服务
 * @export
 *
 */
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
  /** 2.初始化相关逻辑,需要在初始化后,才能执行monaco的一些操作 */
  async init(autoRegistry = true) {
    await Promise.all([this.grammar.loadGrammar()]);
    this.register(this.loadWasm());
    if (autoRegistry) {
      return this.registerLanguages();
    }
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
  /** 1.传入`monaco`模块 */
  public setMonaco(monaco) {
    this.monaco = monaco;
    this.grammar.setMonaco(monaco);
  }
  /** 获得主题列表 */
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
  /**
   * @description 定义主题,代替 `monaco.editor.defineTheme`
   * @param name 从`getThemeList`方法中返回的名字
   *
   *
   */
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
  /** 自动注册语言 */
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
  /** 通过语言别名或者id,获得语言的id */
  async getLanguageId(languageIdOrType: string) {
    const languages: monaco.languages.ILanguageExtensionPoint[] = await this.configuration.getTextmateConfigurationList();

    const extensionPoint = languages.find(
      (item) => item.id === languageIdOrType || (item.aliases || []).includes(languageIdOrType)
    );
    return extensionPoint.id;
  }
}
