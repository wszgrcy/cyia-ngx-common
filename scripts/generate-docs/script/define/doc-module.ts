import { DocMethod } from './doc-method';
import { MODULE_DOC_TYPE } from '../const/doc-type';

export class DocModule {
  id: string;
  aliases?: string[];
  name: string;
  description: string;
  // propertyList:
  readonly docType: string = MODULE_DOC_TYPE;
}
