import { DocMethod } from './doc-method';
import { MODULE_DOC_TYPE } from '../const/doc-type';

export class DocModule {
  id: string;
  aliases?: string[];
  name: string;
  description: string;
  // propertyList:
  importLib: string;
  templatename: string;
  /**使用markdown来描述 */
  markdownPath: string;
  readonly docType: string = MODULE_DOC_TYPE;
  /**所在文件夹,用于输出分类 */
  folder: string;
  /**NgModule装饰器的相关参数 */
  decoratorParameters: any[];
  NgModule: Object;
}
