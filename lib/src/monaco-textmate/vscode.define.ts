import * as monaco from 'monaco-editor';
import { InjectionToken } from '@angular/core';
export type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};
export type Monaco = typeof monaco;
export interface LanguageInfo {
  tokensProvider: monaco.languages.EncodedTokensProvider | null;
  configuration: monaco.languages.LanguageConfiguration | null;
}
export interface TextmateGrammarMap {
  [scopeName: string]: { language: string; scopeName: string; path: string; injectTo: string[] };
}

export interface TextmateTheme {
  name: string;
  include: string;
  tokenColors: TokenColor[];
  settings: TokenColor[];
  colors: Colors;
}

interface TokenColor {
  name?: string;
  scope: string[] | string;
  settings: Settings;
}

interface Settings {
  foreground?: string;
  background?: string;
  fontStyle?: string;
}
interface Colors {
  'editor.background': string;
  'editor.foreground': string;
}

export const TEXTMATE_PATH_CONFIG = new InjectionToken('TextmatePathConfig');
export interface TextmatePathConfig {
  /** 编译扫描器asm */
  vscodeOnigurumaPath: string;
  /** 语法语言对象 */
  textmateGrammarMapPath: string;
  /** 主题列表 */
  textmateThemeListPath: string;
  /** 配置语言列表 */
  textmateConfigurationListPath: string;
}
