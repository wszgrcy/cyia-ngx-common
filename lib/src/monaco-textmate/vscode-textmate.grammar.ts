import { RequestBase } from './request.base';
import { HttpClient } from '@angular/common/http';
import { Monaco, TextmateGrammarMap } from './vscode.define';
import { extname } from 'cyia-ngx-common/util';
import { parseRawGrammar, IGrammar, StackElement, IRawGrammar } from 'vscode-textmate';
import * as monaco from 'monaco-editor';
import { INITIAL, Registry } from 'vscode-textmate';

export class VscodeTextmateGrammar extends RequestBase {
  public textmateGrammarJson: TextmateGrammarMap;
  private iRawGrammarMap = new Map<string, Promise<IRawGrammar>>();
  private language2scopeName = new Map<string, string>();
  public scopeName2Injections = new Map<string, string[]>();
  private scopeNameToGrammar: Map<string, Promise<IGrammar>> = new Map();
  private registry: Registry;
  private monaco: Monaco;

  public setMonaco(monaco) {
    this.monaco = monaco;
  }
  public setRegisty(registry: Registry) {
    this.registry = registry;
  }
  constructor(http: HttpClient, private readonly textmateGrammarMapPath: string) {
    super(http);
  }
  public async loadGrammar(): Promise<void> {
    this.textmateGrammarJson = (await this.requstJson(this.textmateGrammarMapPath)) as any;
    for (const scopeName in this.textmateGrammarJson) {
      if (Object.prototype.hasOwnProperty.call(this.textmateGrammarJson, scopeName)) {
        const grammar = this.textmateGrammarJson[scopeName];
        if (grammar.injectTo) {
          for (const injectScopeName of grammar.injectTo) {
            let injections: string[];
            if (!this.scopeName2Injections.has(injectScopeName)) {
              injections = [];
            } else {
              injections = this.scopeName2Injections.get(injectScopeName);
            }
            injections.push(scopeName);
            this.scopeName2Injections.set(injectScopeName, injections);
          }
        }

        this.language2scopeName.set(this.textmateGrammarJson[scopeName].language, scopeName);
      }
    }
  }
  public getIRawGrammar(scopeName: string): Promise<IRawGrammar> {
    if (!this.iRawGrammarMap.has(scopeName)) {
      this.iRawGrammarMap.set(
        scopeName,
        Promise.resolve(this.textmateGrammarJson)
          .then((json) => {
            return json[scopeName];
          })
          .then((config) => this.requestText(config.path).then((data) => parseRawGrammar(data, `.${extname(config.path)}`)))
      );
    }
    return this.iRawGrammarMap.get(scopeName);
  }

  public async getTokensProviderForLanguage(language: string): Promise<monaco.languages.EncodedTokensProvider | null> {
    if (!this.language2scopeName.has(language)) {
      return null;
    }
    const scopeName = this.language2scopeName.get(language);

    const encodedLanguageId = this.monaco.languages.getEncodedLanguageId(language);

    return this.createEncodedTokensProvider(scopeName, encodedLanguageId);
  }

  private async createEncodedTokensProvider(scopeName: string, encodedLanguageId: number): Promise<monaco.languages.EncodedTokensProvider> {
    const grammar = await this.getGrammar(scopeName, encodedLanguageId);
    return {
      getInitialState(): StackElement {
        return INITIAL;
      },

      tokenizeEncoded(line: string, state: monaco.languages.IState): monaco.languages.IEncodedLineTokens {
        const tokenizeLineResult2 = grammar.tokenizeLine2(line, state as StackElement);
        const { tokens, ruleStack: endState } = tokenizeLineResult2;
        return { tokens, endState };
      },
    };
  }

  private getGrammar(scopeName: string, encodedLanguageId: number): Promise<IGrammar> {
    if (!this.scopeNameToGrammar.has(scopeName)) {
      this.scopeNameToGrammar.set(
        scopeName,
        this.registry.loadGrammarWithConfiguration(scopeName, encodedLanguageId, {}).then((grammar: IGrammar | null) => {
          if (grammar) {
            return grammar;
          } else {
            throw Error(`failed to load grammar for ${scopeName}`);
          }
        })
      );
    }
    return this.scopeNameToGrammar.get(scopeName);
  }
}
