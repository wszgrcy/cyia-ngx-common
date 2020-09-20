import { mergePath, getDir, extname } from 'cyia-ngx-common/util';
import { HttpClient } from '@angular/common/http';
import { RequestBase } from './request.base';
import { IRawTheme, IRawThemeSetting } from 'vscode-textmate';
import { Writeable, TextmateTheme } from './vscode.define';
import * as json from 'json5';
import { parse } from './plistParser';
import * as monaco from 'monaco-editor';

export class VscodeTheme extends RequestBase {
  private themeListPromise: Promise<{ name: string; path: string }[]>;
  private themeMap = new Map<string, () => Promise<IRawTheme>>();
  constructor(http: HttpClient, private readonly themeListPath: string) {
    super(http);
  }
  public getThemeList(): Promise<string[]> {
    return this._getThemeList().then((list) => list.map((item) => item.name));
  }
  private _getThemeList() {
    if (!this.themeListPromise) {
      this.themeListPromise = this.requstJson(this.themeListPath) as any;
      this.themeListPromise.then((list) => {
        for (const item of list) {
          let result: Promise<IRawTheme>;
          this.themeMap.set(item.name, () => {
            if (!result) {
              result = this._load(item.path);
            }
            return result;
          });
        }
      });
    }
    return this.themeListPromise;
  }
  load(name: string): Promise<IRawTheme> {
    if (this.themeMap.has(name)) {
      return this.themeMap.get(name)();
    }
    throw new Error(`no "${name}" theme define`);
  }
  private async _load(url: string) {
    const result: IRawTheme = { settings: [] };
    await this._loadColorTheme(url, result);
    return result;
  }

  private async _loadColorTheme(url: string, result: Writeable<IRawTheme>): Promise<any> {
    if (extname(url) === 'json') {
      const content = await this.requestText(url);
      let contentValue: TextmateTheme;
      try {
        contentValue = json.parse(content);
      } catch (error) {
        throw error;
      }
      if (contentValue.name && !result.name) {
        result.name = contentValue.name;
      }
      /**可能是载入的配置json */
      if (contentValue.include) {
        await this._loadColorTheme(mergePath(getDir(url), contentValue.include), result);
      }
      // 配置解析
      if (Array.isArray(contentValue.settings)) {
        convertSettings(contentValue.settings, result);
        return null;
      }

      const tokenColors = contentValue.tokenColors;
      if (tokenColors) {
        if (Array.isArray(tokenColors)) {
          result.settings.push(...tokenColors);
        } else if (typeof tokenColors === 'string') {
          await this._loadSyntaxTokens(mergePath(getDir(url), tokenColors), result);
        } else {
          throw new Error('other error type of tokenColors');
        }
      }
      defaultTokenColor(contentValue, result);
    } else {
      return this._loadSyntaxTokens(url, result);
    }
  }
  private _loadSyntaxTokens(themeLocation: string, result: IRawTheme): Promise<any> {
    return this.requestText(themeLocation).then(
      (content) => {
        try {
          const contentValue: TextmateTheme = parse(content);
          const settings: IRawThemeSetting[] = contentValue.settings;
          if (!Array.isArray(settings)) {
            throw new Error('settings is not a array');
          }
          convertSettings(settings, result);
          return Promise.resolve(null);
        } catch (e) {
          throw new Error('cannotparse');
        }
      },
      (error) => {
        throw new Error('cannotload');
      }
    );
  }
}

function convertSettings(oldSettings: Writeable<IRawThemeSetting>[], result: { settings: IRawThemeSetting[] }): void {
  for (const rule of oldSettings) {
    result.settings.push(rule);
    if (!rule.scope) {
      const settings = rule.settings;
      if (!settings) {
        rule.settings = {};
      }
    }
  }
}
function defaultTokenColor(contentValue: TextmateTheme, result: IRawTheme): void {
  if (contentValue.colors) {
    const rule: Writeable<IRawThemeSetting> = { settings: {} };
    if (contentValue.colors['editor.background']) {
      (rule.settings as Writeable<typeof rule.settings>).background = contentValue.colors['editor.background'];
    }
    if (contentValue.colors['editor.foreground']) {
      (rule.settings as Writeable<typeof rule.settings>).foreground = contentValue.colors['editor.foreground'];
    }
    if (Object.keys(rule.settings).length) {
      result.settings.push(rule);
    }
  }
}
export function builtTheme(str: string): monaco.editor.BuiltinTheme {
  str = str.toLocaleLowerCase();
  if (str.includes('highcontrast')) {
    return 'hc-black';
  } else if (str.includes('light')) {
    return 'vs';
  } else {
    return 'vs-dark';
  }
}
