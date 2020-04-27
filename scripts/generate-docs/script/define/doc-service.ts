import { DocMethod } from './doc-method';
import { SERVICE_DOC_TYPE } from '../const/doc-type';

export class DocService {
  id: string;
  aliases?: string[];
  name: string;
  description: string;
  methodList: DocMethod[];
  // propertyList:
  readonly docType: string = SERVICE_DOC_TYPE;
}
