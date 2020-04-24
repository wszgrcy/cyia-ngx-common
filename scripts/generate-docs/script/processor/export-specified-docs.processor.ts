import { Processor, DocCollection } from 'dgeni';
import { DECORATOR_DOC_TYPE, SERVICE_DOC_TYPE } from '../const/doc-type';
import { ServiceService } from '../service-package/service.service';
const ALLOW_OUT_DOCS = [DECORATOR_DOC_TYPE, SERVICE_DOC_TYPE];

export function ExportSpecifiedDocsProcessorFactory(serviceService) {
  return new ExportSpecifiedDocsProcessor(serviceService);
}
/**导出指定的文档 */
export class ExportSpecifiedDocsProcessor implements Processor {
  name = 'exportSpecifiedDocsProcessor';
  $runBefore = ['adding-extra-docs'];
  $process(docs: DocCollection) {
    return docs.filter((item) => ALLOW_OUT_DOCS.includes(item.docType));
    // .concat(this.serviceService.getAll());
  }
  constructor(private serviceService: ServiceService) {}
}
