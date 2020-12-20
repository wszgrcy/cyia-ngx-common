import { RequestBase } from './request.base';
import { HttpClient } from '@angular/common/http';
import * as monaco from 'monaco-editor';
export class VscodeTextmateConfiguration extends RequestBase {
  private textmateConfigurationListPromise: Promise<monaco.languages.ILanguageExtensionPoint[]>;
  constructor(http: HttpClient, private readonly textmateConfigurationListPath: string) {
    super(http);
  }
  public getTextmateConfigurationList() {
    if (!this.textmateConfigurationListPromise) {
      this.textmateConfigurationListPromise = this.requstJson(this.textmateConfigurationListPath) as any;
    }
    return this.textmateConfigurationListPromise;
  }
  fetchConfiguration(language: string) {
    return this.getTextmateConfigurationList()
      .then((list) => {
        return list.find((e) => e.id === language || (e.aliases && e.aliases.includes(language)));
      })
      .then((item) => {
        return this.requestText((item as any).configuration);
      })
      .then((res) => convertToRegexpProperty(res));
  }
}

const CONVERT_TO_REGEXP_PROPERTY_LIST = [
  'indentationRules.decreaseIndentPattern',
  'indentationRules.increaseIndentPattern',
  'indentationRules.indentNextLinePattern',
  'indentationRules.unIndentedLinePattern',
  'folding.markers.start',
  'folding.markers.end',
  'wordPattern',
];
function convertToRegexpProperty(rawConfiguration: string): monaco.languages.LanguageConfiguration {
  const config: monaco.languages.LanguageConfiguration = JSON.parse(rawConfiguration);
  for (const property of CONVERT_TO_REGEXP_PROPERTY_LIST) {
    replaceValue2RegExp(config, property);
  }
  if (config.onEnterRules) {
    config.onEnterRules.forEach((rule) => {
      if (rule.afterText) {
        rule.afterText = new RegExp(rule.afterText);
      }
      if (rule.beforeText) {
        rule.beforeText = new RegExp(rule.beforeText);
      }
      if (rule.oneLineAboveText) {
        rule.oneLineAboveText = new RegExp(rule.oneLineAboveText);
      }
    });
  }
  return config;
}
function replaceValue2RegExp(obj, property: string): void {
  const list = property.split('.');
  list.reduce((pre, cur, curIndex) => {
    if (!pre) {
      return undefined;
    }
    if (list.length === curIndex + 1 && pre[cur]) {
      pre[cur] = new RegExp(pre[cur]);
      return undefined;
    }
    return pre[cur];
  }, obj);
}
